interface IPool {

  function stake(uint256 amount) external;

  function withdraw(uint256 amount) external;

  function exit() external;

  function getReward() external;

}
