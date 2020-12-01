import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // TODO: replace with IERC20

import "./basiscash/IPool.sol";

contract BasisApe is Ownable {
  using SafeMath for uint256;

  address public factory;
  address public pool;
  address public asset;
  mapping(address => uint256) public balances;

  uint256 constant BATCH_SIZE = 200000e18; // TODO for USDC and USDT

  constructor() Ownable() public {
  }

  function deposit(uint256 amount) {
    asset.approve(pool, amount);
    pool.stake(amount);
  }

  function withdraw(address recipient, uint256 amount) onlyOwner {
    IPool(pool).withdraw(amount);
    ERC20(asset).transfer(recipient, amount);
  }

  // exit? initialize with benefactor, allow to call withdraw

}
