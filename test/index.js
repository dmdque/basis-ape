const { assert } = require('chai')

const BigNumber = ethers.BigNumber

describe('BasisApeFactory', function() {
  describe('deposit', function() {
    it('should deposit less than the limit', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcPool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '100000000000')
      await factory.connect(user1).deposit('10000000000') // 10,000

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups()
      assert.equal(balance.toString(), '10000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '1', 'number of cups should be correct')
    })

    it('should deposit the limit', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcPool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '200000000000')
      await factory.connect(user1).deposit('20000000000') // 20,000

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups()
      assert.equal(balance.toString(), '20000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '1', 'number of cups should be correct')
    })

    it('should deposit more than the limit with no remainder', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcPool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '1000000000000')
      await factory.connect(user1).deposit('100000000000') // 100,000

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups()
      assert.equal(balance.toString(), '100000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '5', 'number of cups should be correct')
    })

    it('should deposit more than the limit with remainder', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcPool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '800000000001')
      await factory.connect(user1).deposit('80000000001') // 80,000.000001

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups()
      assert.equal(balance.toString(), '80000000001', 'balance should be correct')
      assert.equal(numCups.toString(), '5', 'number of cups should be correct')
    })

    it('should deposit multiple times less than the limit', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcPool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '15000000000')
      await factory.connect(user1).deposit('5000000000') // 5,000
      await factory.connect(user1).deposit('5000000000')
      await factory.connect(user1).deposit('5000000000')

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups()
      assert.equal(balance.toString(), '15000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '1', 'number of cups should be correct')
    })

    it('should deposit multiple times more than the limit', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcPool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '25000000000')
      await factory.connect(user1).deposit('5000000000') // 5,000
      await factory.connect(user1).deposit('5000000000')
      await factory.connect(user1).deposit('5000000000')
      await factory.connect(user1).deposit('5000000000')
      await factory.connect(user1).deposit('5000000000')

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups()
      assert.equal(balance.toString(), '25000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '2', 'number of cups should be correct')
    })

    it('should deposit a large amount', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '180000000000')
      await factory.connect(user1).deposit('180000000000') // 1,800,000

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups()
      assert.equal(balance.toString(), '180000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '9', 'number of cups should be correct')
    })

    it('should deposit a large amount multiple times', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '300000000000')
      await factory.connect(user1).deposit('100000000000') // 1,000,000
      await factory.connect(user1).deposit('100000000000')
      await factory.connect(user1).deposit('100000000000')

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups()
      assert.equal(balance.toString(), '300000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '15', 'number of cups should be correct')
    })
  })
})

async function setup() {
  const [owner, user1, user2] = await ethers.getSigners()
  const Factory = await ethers.getContractFactory('BasisApeFactory')
  const Pool = await ethers.getContractFactory('Wrapper')
  const BACUSDCPool = await ethers.getContractFactory('BACUSDCPool')
  const ERC20Mintable = await ethers.getContractFactory('ERC20Mintable')

  const bac = await ERC20Mintable.deploy('Basis Cash', 'BAC', 18)
  const usdc = await ERC20Mintable.deploy('USD Coin', 'USDC', 6)
  await bac.deployed()
  await usdc.deployed()

  const now = Math.floor(Date.now() / 1000)
  const usdcPool = await BACUSDCPool.deploy(bac.address, usdc.address, now)
  await usdcPool.deployed()

  const factory = await Factory.deploy(usdcPool.address, usdc.address)
  await factory.deployed()

  await usdc.connect(owner).mint(user1.address, '100000000000000') // 100,000,000

  return [bac, usdc, usdcPool, factory]
}
