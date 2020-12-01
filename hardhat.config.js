require('@nomiclabs/hardhat-waffle')
require('hardhat-gas-reporter')

const { alchemyAPIKey, deployerPrivateKey } = require('./config/secrets.json')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.6.8',
  networks: {
    mainnet: {
      url: `https://eth-mainnet.ws.alchemyapi.io/v2/${alchemyAPIKey}`,
      //accounts: [
        //{
          //privateKey: deployerPrivateKey, balance: '10000000000000000000'
        //}
      //]
    },
    hardhat: {
      //accounts: [ {
        //privateKey: deployerPrivateKey, balance: '10000000000000000000' }
      //]
    }
  },
}
