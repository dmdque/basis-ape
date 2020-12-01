import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./basiscash/IPool.sol";
import "./interfaces/IBasisApeFactory.sol";

contract BasisApe is Ownable {
  address public factory;

  constructor() Ownable() public {
    factory = msg.sender;
  }

  function deposit(uint256 amount) external onlyOwner {
    address pool = IBasisApeFactory(factory).pool();
    address asset = IBasisApeFactory(factory).asset();
    IERC20(asset).approve(pool, amount);
    IPool(pool).stake(amount);
  }

  function withdraw(uint256 amount) external onlyOwner {
    address pool = IBasisApeFactory(factory).pool();
    address asset = IBasisApeFactory(factory).asset();
    address bac = IBasisApeFactory(factory).bac();
    IPool(pool).withdraw(amount);
    IPool(pool).getReward();
    IERC20(asset).transfer(msg.sender, amount);
    IERC20(bac).transfer(msg.sender, IERC20(bac).balanceOf(address(this)));
  }
}
