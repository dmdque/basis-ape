// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile')

  const [deployer] = await hre.ethers.getSigners()
  const BAC = '0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a'
  const pools = [
    //{
      //name: 'BACDAIPool',
      //pool:  '0xEBd12620E29Dc6c452dB7B96E1F190F3Ee02BDE8',
      //asset: '0x6b175474e89094c44da98b954eedeac495271d0f',
      //batchSize: '20000000000000000000000',
    //},
    //{
      //name: 'BACSUSDPool',
      //pool:  '0xDc42a21e38C3b8028b01A6B00D8dBC648f93305C',
      //asset: '0x57Ab1E02fEE23774580C119740129eAC7081e9D3',
      //batchSize: '20000000000000000000000',
    //},
    {
      name: 'BACUSDCPool ',
      pool:  '0x51882184b7F9BEEd6Db9c617846140DA1d429fD4',
      asset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      batchSize: '20000000000',
    },
    //{
      //name: 'BACUSDTPool',
      //pool:  '0x2833bdc5B31269D356BDf92d0fD8f3674E877E44',
      //asset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      //batchSize: '20000000000',
    //},
    //{
      //name: 'BACyCRVPool',
      //pool:  '0xC462d8ee54953E7d7bF276612b75387Ea114c3bf',
      //asset: '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8',
      //batchSize: '20000000000000000000000',
    //},
  ]

  const Factory = await ethers.getContractFactory('BasisApeFactory')

  console.log('deployer', deployer.address)
  for (const pool of pools) {
    console.log('Deploying', pool.name)
    const factory = await Factory.deploy(pool.pool, pool.asset, BAC, deployer.address, '20000000000')
    await factory.deployed()
    console.log(pool.name, 'factory deployed to:', factory.address)
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
