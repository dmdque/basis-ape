import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // TODO: replace with IERC20

import "./BasisApe.sol";


// MVP v0.0.1
contract BasisApeFactory is Ownable {
  using SafeMath for uint256;

  address public pool;
  address public asset;
  address[] public cups; // A cup dog is called a pup, a cup ape is called a cup

  //mapping(address => uint256) public balances;
  uint256 private _balance;
  uint256 private _remainder;

  uint256 constant FEE = 100; // 10000 denominated
  uint256 constant BATCH_SIZE = 200000e18; // TODO for USDC and USDT


  constructor() public {
  }

  function deposit(uint256 amount) {
    uint256 currentCup = _balance.div(BATCH_SIZE);

    // Fill first cup
    uint256 remainingAmount;
    if (_remainder > 0) {
      address cup = cups[currentCup];
      if (_remainder.add(amount) <= BATCH_SIZE) {
        ERC20(asset).transferFrom(msg.sender, cup, amount);
        BasisApe(cup).deposit(amount);
        _remainder = _remainder.add(amount) % BATCH_SIZE;
        return;
      } else {
        uint256 amountToFillCup = BATCH_SIZE.sub(_remainder);
        BasisApe(cup).deposit(amountToFillCup);
        remainingAmount = amount.sub(amountToFillCup);
      }
    }

    // Fully fill cups
    currentCup = currentCup.add(1);
    while (remainingAmount >= BATCH_SIZE) {
      address cup = cups[currentCup];
      ERC20(asset).transferFrom(msg.sender, cup, BATCH_SIZE);
      BasisApe(cup).deposit(BATCH_SIZE);
      remainingAmount = remainingAmount.sub(BATCH_SIZE);
      currentCup = currentCup.add(1);
    }

    // Fill last cup
    if (remainingAmount > 0) {
      address cup = cups[currentCup];
      ERC20(asset).transferFrom(msg.sender, cup, remainingAmount);
      BasisApe(cup).deposit(remainingAmount);
      remainingAmount = remainingAmount.sub(BATCH_SIZE)
    }

    _remainder = remainingAmount;
    _balance = _balance.add(amount);
  }

  //function withdraw(uint256 amount) {
    //_balance = _balance.sub(amount);

    //if (_remainder > 0) {
      //BasisApe(cup).withdraw(_remainder);
    //}

    //uint256 remainingAmount = amount.sub(_remainder);
    //uint256 batches = 1.add(remainingAmount.div(BATCH_SIZE));
    //uint256 remainder = remainingAmount % BATCH_SIZE;

    //for (uint256 i = cups.length.sub(1); i >= 0; i--) {
      //BasisApe(cup).withdraw(msg.sender, BATCH_SIZE);
    //}
  //}

}
