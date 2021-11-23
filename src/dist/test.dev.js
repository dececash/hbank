"use strict";

var Web3EthAbi = require('web3-eth-abi');

var s = Web3EthAbi.encodeParameters(['address', 'uint256'], ["0x27e700b45719dbf69f4a7f762a5e6c31e5c7fcb0", 100]);
console.log(s);