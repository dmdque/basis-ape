import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./basiscash/IPool.sol";
import "./interfaces/IBasisApeFactory.sol";

contract BasisApe is Ownable {
  address public factory;

  constructor() Ownable() public {
    factory = msg.sender;
  }

  function deposit(uint256 amount) external {
    address pool = IBasisApeFactory(factory).pool();
    address asset = IBasisApeFactory(factory).asset();
    IERC20(asset).approve(pool, amount);
    IPool(pool).stake(amount);
  }

  function withdraw(address recipient, uint256 amount) onlyOwner external {
    address pool = IBasisApeFactory(factory).pool();
    address asset = IBasisApeFactory(factory).asset();
    IPool(pool).withdraw(amount);
    IERC20(asset).transfer(recipient, amount);
  }

  // exit? initialize with benefactor, allow to call withdraw

}
