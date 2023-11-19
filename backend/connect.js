
const { Web3 } = require('web3')
const web3 = new Web3('wss://eth-sepolia.g.alchemy.com/v2/XtMqC-QXZYIhIKRHcVZ7DRVRj5Sz78YF')

const loginAbi = require('./login.json').output.abi;
const LoginContract = new web3.eth.Contract(loginAbi, '0xbdd0E93Ff18899C5B31d6191e0f80cD8d63336AB')

module.exports = LoginContract
