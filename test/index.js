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
      const numCups = await factory.numCups(user1.address)
      assert.equal(balance.toString(), '10000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '1', 'number of cups should be correct')
    })

    it('should deposit the limit', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcPool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '200000000000')
      await factory.connect(user1).deposit('20000000000') // 20,000

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups(user1.address)
      assert.equal(balance.toString(), '20000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '1', 'number of cups should be correct')
    })

    it('should deposit more than the limit with no remainder', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcPool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '1000000000000')
      await factory.connect(user1).deposit('100000000000') // 100,000

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups(user1.address)
      assert.equal(balance.toString(), '100000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '5', 'number of cups should be correct')
    })

    it('should deposit more than the limit with remainder', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcPool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '800000000001')
      await factory.connect(user1).deposit('80000000001') // 80,000.000001

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups(user1.address)
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
      const numCups = await factory.numCups(user1.address)
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
      const numCups = await factory.numCups(user1.address)
      assert.equal(balance.toString(), '25000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '2', 'number of cups should be correct')
    })

    it('should deposit multiple times more than the limit, with a batch bigger than the limit', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcPool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '30000000000')
      await factory.connect(user1).deposit('5000000000') // 5,000
      await factory.connect(user1).deposit('25000000000')

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups(user1.address)
      assert.equal(balance.toString(), '30000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '2', 'number of cups should be correct')
    })

    it('should deposit the limit multiple times', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcPool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '80000000000')
      await factory.connect(user1).deposit('20000000000') // 20,000
      await factory.connect(user1).deposit('20000000000')
      await factory.connect(user1).deposit('20000000000')
      await factory.connect(user1).deposit('20000000000')

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups(user1.address)
      assert.equal(balance.toString(), '80000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '4', 'number of cups should be correct')
    })

    it('should deposit a large amount', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '120000000000')
      await factory.connect(user1).deposit('120000000000') // 1,200,000

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups(user1.address)
      assert.equal(balance.toString(), '120000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '6', 'number of cups should be correct')
    })

    it('should deposit a large amount multiple times', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '300000000000')
      await factory.connect(user1).deposit('100000000000') // 1,000,000
      await factory.connect(user1).deposit('100000000000')
      await factory.connect(user1).deposit('100000000000')

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups(user1.address)
      assert.equal(balance.toString(), '300000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '15', 'number of cups should be correct')
    })
  })

  describe('withdraw', function() {
    it('should deposit less than the limit then withdraw', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '1000000000')
      await factory.connect(user1).deposit('1000000000') // 10,000
      await factory.connect(user1).withdraw(user1.address, '1000000000')

      const balance = await factory.balanceOf(user1.address)
      assert.equal(balance.toString(), '0', 'balance should be correct')
    })

    it('should deposit the limit then withdraw all', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '20000000000')
      await factory.connect(user1).deposit('20000000000') // 20,000
      await factory.connect(user1).withdraw(user1.address, '20000000000')

      const balance = await factory.balanceOf(user1.address)
      assert.equal(balance.toString(), '0', 'balance should be correct')
    })

    it('should deposit then withdraw some', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '20000000000')
      await factory.connect(user1).deposit('20000000000') // 20,000
      await factory.connect(user1).withdraw(user1.address, '15000000000')

      const balance = await factory.balanceOf(user1.address)
      assert.equal(balance.toString(), '5000000000', 'balance should be correct')
    })

    it('should deposit more than limit with remainder then withdraw remainder', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '25000000000')
      await factory.connect(user1).deposit('25000000000') // 25,000
      await factory.connect(user1).withdraw(user1.address, '5000000000')

      const balance = await factory.balanceOf(user1.address)
      assert.equal(balance.toString(), '20000000000', 'balance should be correct')
    })

    it('should deposit more than limit with remainder then withdraw some of remainder', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '25000000000')
      await factory.connect(user1).deposit('25000000000') // 25,000
      await factory.connect(user1).withdraw(user1.address, '1000000000')

      const balance = await factory.balanceOf(user1.address)
      assert.equal(balance.toString(), '24000000000', 'balance should be correct')
    })

    it('should deposit more than limit with remainder then withdraw remainder and batch', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '45000000000')
      await factory.connect(user1).deposit('45000000000') // 45,000
      await factory.connect(user1).withdraw(user1.address, '25000000000')

      const balance = await factory.balanceOf(user1.address)
      assert.equal(balance.toString(), '20000000000', 'balance should be correct')
    })

    it('should deposit more than limit with remainder then withdraw remainder, batch, and then some', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '45000000000')
      await factory.connect(user1).deposit('45000000000') // 45,000
      await factory.connect(user1).withdraw(user1.address, '30000000000')

      const balance = await factory.balanceOf(user1.address)
      assert.equal(balance.toString(), '15000000000', 'balance should be correct')
    })

    it('should deposit then withdraw in multiple transactions', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '45000000000')
      await factory.connect(user1).deposit('45000000000') // 45,000
      await factory.connect(user1).withdraw(user1.address, '30000000000')
      await factory.connect(user1).withdraw(user1.address, '15000000000')

      const balance = await factory.balanceOf(user1.address)
      assert.equal(balance.toString(), '0', 'balance should be correct')
    })

    // TODO: assert throws not working with async
    it.skip('should fail to withdraw more than deposited', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '20000000000')
      await factory.connect(user1).deposit('20000000000') // 20,000
      assert.throws(async () => {
        await factory.connect(user1).withdraw(user1.address, '30000000000').catch((e) => { throw new Error('reverted') })
      }, 'reverted', null, 'should fail to withdraw')
    })
  })

  describe('deposit and withdraw', function() {
    it('should deposit less than the limit, withdraw, then deposit less than limit', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '2000000000')
      await factory.connect(user1).deposit('1000000000') // 10,000
      await factory.connect(user1).withdraw(user1.address, '1000000000')
      await factory.connect(user1).deposit('1000000000')

      const balance = await factory.balanceOf(user1.address)
      assert.equal(balance.toString(), '1000000000', 'balance should be correct')
    })

    it('should deposit less than the limit, withdraw all, then deposit limit', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '3000000000')
      await factory.connect(user1).deposit('1000000000') // 10,000
      await factory.connect(user1).withdraw(user1.address, '1000000000')
      await factory.connect(user1).deposit('2000000000')

      const balance = await factory.balanceOf(user1.address)
      assert.equal(balance.toString(), '2000000000', 'balance should be correct')
    })

    it('should deposit less than the limit, withdraw all, then deposit more than the limit', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '40000000000')
      await factory.connect(user1).deposit('10000000000') // 10,000
      await factory.connect(user1).withdraw(user1.address, '10000000000')
      await factory.connect(user1).deposit('30000000000')

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups(user1.address)
      assert.equal(balance.toString(), '30000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '2', 'number of cups should be correct')
    })

    it('should deposit the limit, withdraw some, then deposit more than the limit', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '55000000000')
      await factory.connect(user1).deposit('20000000000') // 20,000
      await factory.connect(user1).withdraw(user1.address, '3000000000')
      await factory.connect(user1).deposit('35000000000')

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups(user1.address)
      assert.equal(balance.toString(), '52000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '3', 'number of cups should be correct')
    })

    it('should deposit more than the limit, withdraw some, then deposit less than before', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '100000000000')
      await factory.connect(user1).deposit('55000000000')
      await factory.connect(user1).withdraw(user1.address, '23000000000')
      await factory.connect(user1).deposit('45000000000')

      const balance = await factory.balanceOf(user1.address)
      const numCups = await factory.numCups(user1.address)
      assert.equal(balance.toString(), '77000000000', 'balance should be correct')
      assert.equal(numCups.toString(), '4', 'number of cups should be correct')
    })

    it('should deposit more than the limit, withdraw some, then deposit more than before', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '10000000000')
      await factory.connect(user1).deposit('4500000000')
      await factory.connect(user1).withdraw(user1.address, '2300000000')
      await factory.connect(user1).deposit('5500000000')

      const balance = await factory.balanceOf(user1.address)
      assert.equal(balance.toString(), '7700000000', 'balance should be correct')
    })
  })
  describe.only('fees', function() {
    it('should collect fee', async function() {
      const [owner, user1, user2] = await ethers.getSigners()
      const [bac, usdc, usdcpool, factory] = await setup()

      await usdc.connect(user1).approve(factory.address, '50000000000')
      await factory.connect(user1).deposit('50000000000')
      await factory.connect(user1).withdraw(user1.address, '30000000000')
      await factory.connect(user1).withdraw(user1.address, '20000000000')

      const balance = await factory.balanceOf(user1.address)
      const developerUSDCBalance = await usdc.balanceOf(owner.address)
      assert.equal(balance.toString(), '0', 'balance should be correct')
      assert.equal(developerUSDCBalance.toString(), '250000000', 'developer usdc balance should be correct')
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

  const factory = await Factory.deploy(usdcPool.address, usdc.address, bac.address, owner.address)
  await factory.deployed()

  await usdc.connect(owner).mint(user1.address, '100000000000000') // 100,000,000

  return [bac, usdc, usdcPool, factory]
}
