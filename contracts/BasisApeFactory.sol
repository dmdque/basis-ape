import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./BasisApe.sol";

// MVP v0.0.1
/*
 * \       / \       / \       /
 *  \     /   \     /   \     /
 *   \___/     \___/     \___/
 */
contract BasisApeFactory is Ownable {
  using SafeMath for uint256;

  address public pool;
  address public asset;
  address public bac;
  address public developer;
  uint256 public batchSize;
  mapping(address => address[]) public cups;
  mapping(address => uint256) public balances;

  uint256 constant FEE = 50; // .5% (10000 denominated)

  constructor(address _pool, address _asset, address _bac, address _developer, uint256 _batchSize) public {
    pool = _pool;
    asset = _asset;
    bac = _bac;
    developer = _developer;
    batchSize = _batchSize;
  }

  function deposit(uint256 amount) external {
    uint256 remainder = balances[msg.sender] % batchSize;
    uint256 currentCup = balances[msg.sender].div(batchSize);
    uint256 remainingAmount = amount;

    // Fill first cup
    if (remainder > 0) {
      address cup = cups[msg.sender][currentCup];
      if (remainder.add(amount) <= batchSize) {
        IERC20(asset).transferFrom(msg.sender, cup, amount); // Transferring directly to cup saves some gas
        BasisApe(cup).deposit(amount);
        remainder = remainder.add(amount) % batchSize; // Mod because when remainder is batchSize, we want it to be 0
        balances[msg.sender] = balances[msg.sender].add(amount);
        return;
      } else {
        uint256 amountToFillCup = batchSize.sub(remainder);
        IERC20(asset).transferFrom(msg.sender, cup, amountToFillCup); // Transferring directly to cup saves some gas
        BasisApe(cup).deposit(amountToFillCup);
        remainingAmount = remainingAmount.sub(amountToFillCup);
        currentCup = currentCup.add(1);
      }
    }

    // Fully fill cups
    while (remainingAmount >= batchSize) {
      address cup;
      if (cups[msg.sender].length <= currentCup) {
        cup = address(new BasisApe());
        cups[msg.sender].push(cup);
      } else {
        cup = cups[msg.sender][currentCup];
      }
      IERC20(asset).transferFrom(msg.sender, cup, batchSize);
      BasisApe(cup).deposit(batchSize);
      remainingAmount = remainingAmount.sub(batchSize);
      currentCup = currentCup.add(1);
    }

    // Fill last cup
    if (remainingAmount > 0) {
      address cup;
      if (cups[msg.sender].length <= currentCup) {
        cup = address(new BasisApe());
        cups[msg.sender].push(cup);
      } else {
        cup = cups[msg.sender][currentCup];
      }
      IERC20(asset).transferFrom(msg.sender, cup, remainingAmount);
      BasisApe(cup).deposit(remainingAmount);
    }

    balances[msg.sender] = balances[msg.sender].add(amount);
  }

  function withdraw(address recipient, uint256 amount) external {
    require(amount <= balances[msg.sender], "BasisApeFactory: Must have sufficient balance");

    uint256 remainder = balances[msg.sender] % batchSize;
    uint256 currentCup = balances[msg.sender].div(batchSize);
    uint256 remainingAmount = amount;

    // Empty last cup
    if (remainder > 0) {
      address cup = cups[msg.sender][currentCup];
      if (amount <= remainder) {
        BasisApe(cup).withdraw(amount);
        remainder = remainder.sub(amount);
        balances[msg.sender] = balances[msg.sender].sub(amount);
        return;
      } else {
        BasisApe(cup).withdraw(remainder);
        remainingAmount = remainingAmount.sub(remainder);
      }
    }

    // Fully empty cups
    while (remainingAmount >= batchSize) {
      currentCup = currentCup.sub(1);
      address cup = cups[msg.sender][currentCup];
      BasisApe(cup).withdraw(batchSize);
      remainingAmount = remainingAmount.sub(batchSize);
    }

    // Empty first cup
    if (remainingAmount > 0) {
      currentCup = currentCup.sub(1);
      address cup = cups[msg.sender][currentCup];
      BasisApe(cup).withdraw(remainingAmount);
    }

    balances[msg.sender] = balances[msg.sender].sub(amount, "BasisApeFactory: Must have sufficient balance");
    uint256 fee = amount.mul(FEE).div(10000);
    IERC20(asset).transfer(developer, fee);
    IERC20(asset).transfer(recipient, amount.sub(fee));
  }

  function numCups(address account) external view returns (uint256) {
    return cups[account].length;
  }

  function balanceOf(address account) external view returns (uint256) {
    return balances[account];
  }

}
