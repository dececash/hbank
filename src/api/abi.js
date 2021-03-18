import seropp from 'sero-pp'
import serojs from "serojs";
import BigNumber from 'bignumber.js'
import { Toast } from "antd-mobile";
import i18n from '../i18n';
import { JsonRpc } from "./jsonrpc";
import keccak256 from "keccak256";
const rpc = new JsonRpc();

const config = {
	name: "GINKGO BANK",

	contractAddress: "5sDcSj6m1NL1ho5jczaFf1zYHG1yymW6WW1SsxxDnud92mrgjNDRZFGdNKDK15rJ3PC9Ca2HyWBgdi5YuLCX8yYc",
	hbankAddress: "2LaPfgdkTzWPxy6o2e81PFpU5oBAZdy58eE1ScdHGeeov9oxaAmBybJ8C2DBH8o7fKSjPgR25gTC7zDnGehymj4V",
	dkrwdelegateAddress: "5sWtPb2ap1ABpHYM1uBEEMVLJgaYmRVLaxik9u83JUoiUubzmSKB5HwRhm2SKAuGzL7eE2gcTYMENuTJ5sqgy34k",
	dkrwAddress: "48jaTaWHnoGivTRMdZHEUuDktA4hkL68qaJF5P1za52HQymezdtaJdmZTWJs1fuZmzbpW7sU3sUYGjW9hBwDcrEo",

	// dece
	// contractAddress: "5YX3dccXGu55ZUxUqXkzqEzCxQySHhSRe9wVKS8HNTbibYCgk62xgKRmQyeQM7jiFkuvFBDaXZ7MWv1kpNJJFQja",
	// hbankAddress: "3rwbnbmvb5j4P5Rv4NXcoqGq3N4vKuZELE5Sua2M9Y9erqw7A1erpYvy3UDtQC8xowndvAue92inucUeJYJpsg9M",
	// dkrwdelegateAddress: "5R9Dar4hT7u1U63DU8H9aU1uj1dYpA1786kN5Jec46zFXzkPi1KMqpChiNFM8YsREfzWzgLSYj9YM8mJYyVoaRdU",
	// dkrwAddress: "5zxVuiiXFinR4FuqiEWFFnSxBzC4fPSfX8ZuYft7ZC2HApgY4CpcsQYdLXchUjF23Nd5yPq6hxtVtbhnuZEtcCdS",
	// http://13.124.240.238:8545

	github: "https://github.com/dececash/hbank",
	author: "GINKGO BANK",
	url: document.location.href,
	logo: document.location.protocol + '//' + document.location.host + '/logo.png',
	barColor: "#cf4b04",
	navColor: "#cf4b04",
	barMode: "dark",
	navMode: "light"
};


const abiJson = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tokenA",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "tokenB",
				"type": "string"
			}
		],
		"name": "delPair",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "token",
				"type": "string"
			}
		],
		"name": "exchange",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tokenA",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "tokenB",
				"type": "string"
			}
		],
		"name": "getPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "keys",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "head",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "tail",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "len",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_end",
				"type": "uint256"
			}
		],
		"name": "pairList",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "tokenA",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "tokenB",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "feeRate",
						"type": "uint256"
					}
				],
				"internalType": "struct Swap.Pair[]",
				"name": "rets",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "pairs",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "tokenA",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "tokenB",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "feeRate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tokenA",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "tokenB",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "feeRate",
				"type": "uint256"
			}
		],
		"name": "setFeeRate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_manager",
				"type": "address"
			}
		],
		"name": "setManager",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tokenA",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "tokenB",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "setPair",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "token",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

const contract = serojs.callContract(abiJson, config.contractAddress);

const hbankJson = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_swap",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32[]",
				"name": "keys",
				"type": "bytes32[]"
			},
			{
				"internalType": "bool",
				"name": "flag",
				"type": "bool"
			}
		],
		"name": "check",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "list",
				"type": "address[]"
			},
			{
				"internalType": "bool",
				"name": "flag",
				"type": "bool"
			}
		],
		"name": "checkUsers",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_tokenA",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_tokenB",
				"type": "string"
			}
		],
		"name": "exchange",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "financeAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "tokenStr",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "params",
				"type": "bytes"
			}
		],
		"name": "financing",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32[]",
				"name": "currencys",
				"type": "bytes32[]"
			}
		],
		"name": "getBalances",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "cy",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lasttime",
						"type": "uint256"
					}
				],
				"internalType": "struct Hbank.RetAsset[]",
				"name": "item",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCheckList",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "key",
						"type": "bytes32"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "time",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "currency",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "status",
						"type": "uint256"
					}
				],
				"internalType": "struct Hbank.RetCheck[]",
				"name": "retcheck",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32[]",
				"name": "currencys",
				"type": "bytes32[]"
			}
		],
		"name": "getInterestsList",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "cy",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "iRate",
						"type": "uint256"
					}
				],
				"internalType": "struct Hbank.RetInterest[]",
				"name": "item",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "currency",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"name": "getRecords",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "len",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "time",
						"type": "uint256"
					},
					{
						"internalType": "enum Hbank.OperateType",
						"name": "rType",
						"type": "uint8"
					}
				],
				"internalType": "struct Hbank.Record[]",
				"name": "list",
				"type": "tuple[]"
			},
			{
				"internalType": "uint256[]",
				"name": "statusList",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRegisterList",
		"outputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "phone",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "email",
								"type": "string"
							},
							{
								"internalType": "bytes32",
								"name": "code",
								"type": "bytes32"
							},
							{
								"internalType": "enum Hbank.KycState",
								"name": "state",
								"type": "uint8"
							}
						],
						"internalType": "struct Hbank.UserInfo",
						"name": "info",
						"type": "tuple"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"internalType": "struct Hbank.RetuserInfo[]",
				"name": "retuserInfo",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "UserAddress",
				"type": "address"
			}
		],
		"name": "getUserInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "phone",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "email",
						"type": "string"
					},
					{
						"internalType": "bytes32",
						"name": "code",
						"type": "bytes32"
					},
					{
						"internalType": "enum Hbank.KycState",
						"name": "state",
						"type": "uint8"
					}
				],
				"internalType": "struct Hbank.UserInfo",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pageIndex",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pageCount",
				"type": "uint256"
			}
		],
		"name": "getUserInfoList",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "len",
				"type": "uint256"
			},
			{
				"components": [
					{
						"components": [
							{
								"internalType": "string",
								"name": "name",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "phone",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "email",
								"type": "string"
							},
							{
								"internalType": "bytes32",
								"name": "code",
								"type": "bytes32"
							},
							{
								"internalType": "enum Hbank.KycState",
								"name": "state",
								"type": "uint8"
							}
						],
						"internalType": "struct Hbank.UserInfo",
						"name": "info",
						"type": "tuple"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"internalType": "struct Hbank.RetuserInfo[]",
				"name": "retuserInfo",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pageIndex",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pageCount",
				"type": "uint256"
			}
		],
		"name": "getWithdrawList",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "len",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "key",
						"type": "bytes32"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "time",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "currency",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "status",
						"type": "uint256"
					}
				],
				"internalType": "struct Hbank.RetCheck[]",
				"name": "retcheck",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "token",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "hbankWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "interests",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "iRate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "phone",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "email",
				"type": "string"
			}
		],
		"name": "modifyInformation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "recharge",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "phone",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "email",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "code",
				"type": "bytes32"
			}
		],
		"name": "register",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_swap",
				"type": "address"
			}
		],
		"name": "setHSwap",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "currency",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "iRate",
				"type": "uint256"
			}
		],
		"name": "setInterest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_manager",
				"type": "address"
			}
		],
		"name": "setManager",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "currency",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "withDraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

const hbank = serojs.callContract(hbankJson, config.hbankAddress);

const dkrwdelegateJson = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_dkrw",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_baseInfo",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_hbank",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_hSwap",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "RewardLog",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "contractOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "dailyTapIn",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "estimateTapInTime",
				"type": "uint256"
			}
		],
		"name": "delegateQueryTotalRevenue",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "refferCode",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "flag",
				"type": "bool"
			}
		],
		"name": "doInvest",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "opData",
				"type": "bytes"
			}
		],
		"name": "financing",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "refferCode",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "investorAddr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "investmentAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "happenedTime",
				"type": "uint256"
			}
		],
		"name": "investAction",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "queryTapInRevenueCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "queryTapInRevenueDetail",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "queryTotalRevenue",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "perPage",
				"type": "uint256"
			}
		],
		"name": "queryUserInvestment",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "investmentTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "investmentAmount",
						"type": "uint256"
					}
				],
				"internalType": "struct DkrwDelegate.Investment[]",
				"name": "",
				"type": "tuple[]"
			},
			{
				"internalType": "uint256",
				"name": "totalRecords",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "perPage",
				"type": "uint256"
			}
		],
		"name": "queryUserInvestmentTapInRevenue",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "tapInDatetime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "tapInRewardAmount",
						"type": "uint256"
					}
				],
				"internalType": "struct DkrwDelegate.UserTapInDailyReward[]",
				"name": "",
				"type": "tuple[]"
			},
			{
				"internalType": "uint256",
				"name": "totalRecords",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "startIdx",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "perPage",
				"type": "uint256"
			}
		],
		"name": "queryUserRecommendRevenue",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "rewardTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "rewardAmount",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "uname",
						"type": "string"
					}
				],
				"internalType": "struct DkrwDelegate.RecommendReward[]",
				"name": "",
				"type": "tuple[]"
			},
			{
				"internalType": "uint256",
				"name": "totalRecords",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "queryUserRecommendRevenueCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "queryUserRecommendRevenueDetail",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "baseInfoAddress",
				"type": "address"
			}
		],
		"name": "setBaseInfo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "dkrwAddress",
				"type": "address"
			}
		],
		"name": "setDkrw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "bankAddress",
				"type": "address"
			}
		],
		"name": "setHBank",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "swapAddress",
				"type": "address"
			}
		],
		"name": "setHSwap",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_manager",
				"type": "address"
			}
		],
		"name": "setManager",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "tapInRecordsMapping",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "lastTapInTime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userInvestmentsMapping",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "investmentTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "investmentAmount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userRecommendRewardListMapping",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "rewardTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "rewardAmount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "uname",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userTotalRevenueMapping",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalTapInRevenue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalRecommendRevenue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tapInRewardEstimate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "token",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

const dkrwdelegate = serojs.callContract(dkrwdelegateJson, config.dkrwdelegateAddress);

const dkrwJson = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_marketAddr",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "reffer",
				"type": "string"
			}
		],
		"name": "avatarLog",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "refferId",
				"type": "uint256"
			}
		],
		"name": "generationLog",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "pType",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "profit",
				"type": "uint256"
			}
		],
		"name": "profitLog",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "refferCode",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "agent",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "code",
				"type": "string"
			}
		],
		"name": "decode",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "details",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "ID",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "idLeft",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "idRight",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "leftAchievement",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "rightAchievement",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "boosterLevel",
						"type": "uint256"
					},
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "refferId",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "value",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "returnValue",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "canDrawupValue",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "level",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "recommendProfit",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "boosterProfit",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "roolupProfit",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "suportProfit",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "achievement",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "otherAchievement",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "avatarValue",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "overflowValue",
								"type": "uint256"
							}
						],
						"internalType": "struct NewDKRW.Player",
						"name": "player",
						"type": "tuple"
					},
					{
						"internalType": "string",
						"name": "reffer",
						"type": "string"
					}
				],
				"internalType": "struct NewDKRW.Detail",
				"name": "detail",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint64",
				"name": "number",
				"type": "uint64"
			}
		],
		"name": "encode",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "referId",
				"type": "uint256"
			}
		],
		"name": "findLocation",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "flags",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getBotherId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "childId",
				"type": "uint256"
			}
		],
		"name": "getParentId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "idsMap",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "x",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "y",
				"type": "uint256"
			}
		],
		"name": "locationToId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "locationToIdMap",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "locations",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "x",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "y",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "refferId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "returnValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "canDrawupValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "recommendProfit",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "boosterProfit",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "roolupProfit",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "suportProfit",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "achievement",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "otherAchievement",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "avatarValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "overflowValue",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "refferCode",
				"type": "string"
			}
		],
		"name": "register",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_marketAddr",
				"type": "address"
			}
		],
		"name": "setMarketAddr",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "start",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const dkrw = serojs.callContract(dkrwJson, config.dkrwAddress)


class Abi {

	constructor() {
		let self = this;
		self.init = new Promise(
			(resolve, reject) => {
				seropp.init(config, function (rest) {
					if (rest === 'success') {
						return resolve()
					} else {
						return reject(rest)
					}
				})
				this.getPopupInfo();
			}
		)
	}

	hash(data, callback) {
		callback(keccak256(data).toString('hex'))
	}

	getFullAddress(pkrs, callback) {
		seropp.getInfo(function (info) {
			rpc.seroRpc(info.rpc, "dece_getFullAddress", [pkrs], function (rets) {
				callback(rets);
			});
		});
	}

	getShortAddress(mianPKr, callback) {
		seropp.getInfo(function (info) {
			rpc.seroRpc(info.rpc, "dece_getShortAddress", [mianPKr], function (rets) {
				callback(rets);
			});
		});
	}

	initLanguage(callback) {
		seropp.getInfo(function (info) {
			callback(info.language);
		});
	}

	getPopupInfo() {
		seropp.getInfo(function (info) {
			localStorage.setItem("language", info.language)
			i18n.changeLanguage(info.language).catch()
		});
	}

	getTransactionReceipt(txHash, callback) {
		seropp.getInfo(function (info) {
			rpc.seroRpc(info.rpc, "dece_getTransactionReceipt", [txHash], function (rest) {
				if (callback) {
					callback(rest)
				}
			});
		});
	}

	startGetTxReceipt(hash, callback) {
		const self = this;
		Toast.loading("Loading...", 60)
		this.getTransactionReceipt(hash, function (res) {
			if (res && res.result) {
				Toast.hide();
				if (callback) {
					callback(res)
				}
			} else {
				setTimeout(function () {
					self.startGetTxReceipt(hash, callback)
				}, 5000)
			}
		});
	}

	currentAccount(callback) {
		seropp.getAccountList(function (datas) {
			for (var i = 0; i < datas.length; i++) {
				if (datas[i].IsCurrent == undefined || datas[i].IsCurrent) {
					callback({
						pk: datas[i].PK,
						mainPKr: datas[i].MainPKr,
						name: datas[i].Name,
						index: i
					});
					break;
				}
			}
		});
	}

	accountDetails(pk, callback) {
		if (!pk) {
			return;
		}
		seropp.getAccountDetail(pk, function (item) {
			callback({ pk: item.PK, mainPKr: item.MainPKr, name: item.Name })
		});
	}

	accountList(callback) {
		seropp.getAccountList(function (data) {
			let accounts = [];
			data.forEach(function (item, index) {
				accounts.push({
					pk: item.PK,
					mainPKr: item.MainPKr,
					name: item.Name,
					IsCurrent: item.IsCurrent,
					index: index
				})
			});
			callback(accounts)
		});
	}

	isManager(mainPKr, callback) {
		let self = this;
		this.callMethod(contract, 'manager', mainPKr, [], function (ret) {
			self.getFullAddress([ret[0]], function (rets) {
				if (callback) {
					callback(rets.result[ret[0]] == mainPKr);
				}
			})
		});
	}

	isOwner(mainPKr, callback) {
		let self = this;
		this.callMethod(contract, 'owner', mainPKr, [], function (ret) {
			self.getFullAddress([ret[0]], function (rets) {
				if (callback) {
					callback(rets.result[ret[0]] == mainPKr);
				}
			})
		});
	}

	balanceOf(callback) {
		seropp.getInfo(function (info) {
			rpc.seroRpc(info.rpc, "dece_getBalance", [contract.address, "latest"], function (rets) {
				let balances = [];
				if (rets.result.tkn) {
					let map = new Map(Object.entries(rets.result.tkn));
					map.forEach((val, key) => {
						balances.push({ token: key, value: new BigNumber(val).dividedBy(1e18).toFixed(3) });
					})
				}
				if (callback) {
					callback(balances);
				}
			});
		});
	}

	hbankBalanceOf(callback) {
		seropp.getInfo(function (info) {
			rpc.seroRpc(info.rpc, "dece_getBalance", [hbank.address, "latest"], function (rets) {
				let balances = [];
				if (rets.result.tkn) {
					let map = new Map(Object.entries(rets.result.tkn));
					map.forEach((val, key) => {
						balances.push({ token: key, value: new BigNumber(val).dividedBy(1e18).toFixed(3) });
					})
				}
				if (callback) {
					callback(balances);
				}
			});
		});
	}

	pair(mainPKr, tokenA, tokenB, callback) {
		this.callMethod(contract, 'pair', mainPKr, [tokenA, tokenB], function (rets) {
			callback(rets[0]);
		});
	}

	pairList(mainPKr, callback) {
		this.callMethod(contract, 'pairList', mainPKr, [0, 100], function (rets) {
			callback(rets[0]);
		});
	}

	setFeeRate(pk, mainPKr, tokenA, tokenB, fee, callback) {
		this.executeMethod(contract, 'setFeeRate', pk, mainPKr, [tokenA, tokenB, fee], "DECE", 0, callback);
	}

	setPair(pk, mainPKr, tokenA, tokenB, price, callback) {
		this.executeMethod(contract, 'setPair', pk, mainPKr, [tokenA, tokenB, price], "DECE", 0, callback);
	}
	exchange(pk, mainPKr, tokenA, value, tokenB, callback) {
		this.executeMethod(contract, 'exchange', pk, mainPKr, [tokenA], tokenB, value, callback);
	}

	withdraw(pk, mainPKr, token, value, callback) {
		this.executeMethod(contract, 'withdraw', pk, mainPKr, [token, value], "DECE", 0, callback);
	}

	send(pk, mainPKr, token, value, callback) {
		this.executeMethod(contract, '', pk, mainPKr, [], token, value, callback);
	}









	WithdrawIsManager(pk, mainPKr, token, value, callback) {
		this.executeMethod(hbank, 'hbankWithdraw', pk, mainPKr, [token, value], "DECE", 0, callback);
	}

	hbankFinancing(pk, mainPKr, financeAddr, tokenStr, value, params, callback) {
		this.executeMethod(hbank, 'financing', pk, mainPKr, [financeAddr, tokenStr, value, params], "DECE", 0, callback)
	}

	hbankSend(pk, mainPKr, token, value, callback) {
		this.executeMethod(hbank, '', pk, mainPKr, [], token, value, callback);
	}

	hbankexchange(pk, mainPKr, tokenA, value, tokenB, callback) {
		this.executeMethod(hbank, 'exchange', pk, mainPKr, [tokenB, value, tokenA], "DECE", 0, callback);
	}

	hbankRecharge(pk, mainPKr, value, data, currency, callback) {

		this.executeMethod(hbank, 'recharge', pk, mainPKr, [data], currency, value, callback);
	}

	hbankWithDraw(pk, mainPKr, value, currency, callback) {
		this.executeMethod(hbank, 'withDraw', pk, mainPKr, [currency, value], "DECE", 0, callback);
	}

	hbankisManager(mainPKr, callback) {
		let self = this;
		this.callMethod(hbank, 'manager', mainPKr, [], function (ret) {
			self.getFullAddress([ret[0]], function (rets) {
				if (callback) {
					callback(rets.result[ret[0]] == mainPKr);
				}
			})
		});
	}

	hbankisOwner(mainPKr, callback) {
		let self = this;
		this.callMethod(hbank, 'owner', mainPKr, [], function (ret) {
			self.getFullAddress([ret[0]], function (rets) {
				if (callback) {
					callback(rets.result[ret[0]] == mainPKr);
				}
			})
		});
	}

	getBalances(mainPKr, callback) {
		let value = ["DECE", "DKRW", "DHAPY","HAPY","FPT"];
		this.callMethod(hbank, 'getBalances', mainPKr, [value], function (res) {
			callback(res.item);
		})
	}

	getRecords(mainPKr, cy, index, count, callback) {
		this.callMethod(hbank, 'getRecords', mainPKr, [cy, index, count], function (res) {
			callback(res);
		})
	}

	getUserInfoList(mainPKr, pageindex, pagecount, callback) {
		let self = this;

		self.callMethod(hbank, 'getUserInfoList', mainPKr, [pageindex, pagecount], function (res) {
			let pkrs = [];
			res.retuserInfo.forEach(each => {
				pkrs.push(each.owner);
			})
			self.getFullAddress(pkrs, function (rets) {
				res.retuserInfo.forEach(each => {
					each.owner = rets.result[each.owner];
				})
				callback(res.retuserInfo, res.len);
			})
		})
	}

	getCheckList(mainPKr, callback) {
		let self = this;
		this.callMethod(hbank, 'getCheckList', mainPKr, [], function (res) {
			let pkrs = [];
			res.retcheck.forEach(each => {
				pkrs.push(each.owner);
			})
			self.getFullAddress(pkrs, function (rets) {
				res.retcheck.forEach(each => {
					each.owner = rets.result[each.owner];
				})
				callback(res.retcheck);
			})
		})
	}

	getWithdrawList(mainPKr, pageindex, pagecount, callback) {
		let self = this;
		this.callMethod(hbank, 'getWithdrawList', mainPKr, [pageindex, pagecount], function (res) {
			let pkrs = [];
			res.retcheck.forEach(each => {
				pkrs.push(each.owner);
			})
			self.getFullAddress(pkrs, function (rets) {
				res.retcheck.forEach(each => {
					each.owner = rets.result[each.owner];
				})
				callback(res.retcheck, res.len);
			})
		})
	}

	getRegisterList(mainPKr, callback) {
		let self = this;
		this.callMethod(hbank, 'getRegisterList', mainPKr, [], function (res) {

			let pkrs = [];
			res.retuserInfo.forEach(each => {
				pkrs.push(each.owner);
			})
			self.getFullAddress(pkrs, function (rets) {
				res.retuserInfo.forEach(each => {
					each.owner = rets.result[each.owner];
				})
				callback(res.retuserInfo);
			})

		})
	}

	getInterestsList(mainPKr, callback) {
		let value = ["DECE", "DKRW", "DHAPY","HAPY","FPT"];
		this.callMethod(hbank, 'getInterestsList', mainPKr, [value], function (res) {
			callback(res.item);
		})
	}

	setInterest(pk, mainPKr, cy, iRate, callback) {
		this.executeMethod(hbank, 'setInterest', pk, mainPKr, [cy, iRate], "DECE", 0, callback)
	}

	register(pk, mainPKr, name, phone, email, code, callback) {
		this.executeMethod(hbank, 'register', pk, mainPKr, [name, phone, email, code], "DECE", 0, callback)
	}

	getUserInfo(mainPKr, callback) {
		this.callMethod(hbank, 'getUserInfo', mainPKr, [mainPKr], function (res) {
			callback(res);
		})
	}

	reviewUser(pk, mainPKr, keys, whether, callback) {
		this.executeMethod(hbank, 'checkUsers', pk, mainPKr, [keys, whether], "DECE", 0, callback);
	}

	review(pk, mainPKr, keys, whether, callback) {
		this.executeMethod(hbank, 'check', pk, mainPKr, [keys, whether], "DECE", 0, callback);
	}

	dailyTapIn(pk, mainPKr, callback) {
		this.executeMethod(dkrwdelegate, 'dailyTapIn', pk, mainPKr, [], "DECE", 0, function (data) {
			callback(data);
		})
	}

	doInvest(pk, mainPKr, refferCode, cy, vulue, callback) {
		this.executeMethod(dkrwdelegate, 'doInvest', pk, mainPKr, [refferCode], cy, vulue, function (res) {
			callback(res)
		});
	}

	queryTotalRevenue(mainPKr, callback) {
		this.callMethod(dkrwdelegate, 'queryTotalRevenue', mainPKr, [], function (data) {
			callback(data);
		})
	}

	queryUserRecommendRevenue(mainPKr, pageindex, pagecount, callback) {
		this.callMethod(dkrwdelegate, 'queryUserRecommendRevenue', mainPKr, [pageindex, pagecount], function (data) {
			callback(data);
		})
	}

	queryUserInvestment(mainPKr, pageindex, pagecount, callback) {
		this.callMethod(dkrwdelegate, 'queryUserInvestment', mainPKr, [pageindex, pagecount], function (data) {
			callback(data);
		})
	}

	dkrwFinancing(pk, mainPKr, data, value, callback) {
		this.executeMethod(dkrwdelegate, 'financing', pk, mainPKr, [data], "DKRW", value, callback)
	}

	dkrwDetail(mainPKr, callback) {
		this.callMethod(dkrw, 'details', mainPKr, [], function (res) {
			callback(res);
		})
	}

	dkrwwithdraw(pk, mainPKr, token, value, callback) {
		this.executeMethod(dkrwdelegate, 'withdraw', pk, mainPKr, [token, value], "DECE", 0, callback);
	}

	dkrwsend(pk, mainPKr, token, value, callback) {
		this.executeMethod(dkrwdelegate, '', pk, mainPKr, [], token, value, callback);
	}

	dkrwbalanceOf(callback) {
		seropp.getInfo(function (info) {
			rpc.seroRpc(info.rpc, "dece_getBalance", [dkrwdelegate.address, "latest"], function (rets) {
				let balances = [];
				if (rets.result.tkn) {
					let map = new Map(Object.entries(rets.result.tkn));
					console.log(map,">>>>>>>map")
					map.forEach((val, key) => {
						balances.push({ token: key, value: new BigNumber(val).dividedBy(1e18).toFixed(3) });
					})
				} else {
					balances.push({ token: "DHAPY", value: "0.00" });
				}
				if (callback) {
					callback(balances);
				}
			});
		});
	}

	callMethod(contract, _method, from, _args, callback) {
		let packData = contract.packData(_method, _args);
		let callParams = {
			from: from,
			to: contract.address,
			data: packData
		};

		seropp.getInfo(function (info) {
			rpc.seroRpc(info.rpc, "dece_call", [callParams, "latest"], function (rets) {
				let data = rets.result
				if (data !== "0x0") {
					let res = contract.unPackDataEx(_method, data);
					if (callback) {
						callback(res);
					}
				} else {
					callback("0x0");
				}
			});
		});
	}

	executeMethod(contract, _method, pk, mainPKr, args, tokenName, value, callback) {
		let packData = "0x";

		if ("" !== _method) {
			packData = contract.packData(_method, args);
		}

		let executeData = {
			from: pk,
			to: contract.address,
			value: "0x" + value.toString(16),
			data: packData,
			gasPrice: "0x" + new BigNumber("1000000000").toString(16),
			cy: tokenName
		};

		let estimateParam = {
			from: mainPKr,
			to: contract.address,
			value: "0x" + value.toString(16),
			data: packData,
			gasPrice: "0x" + new BigNumber("1000000000").toString(16),
			cy: tokenName
		};

		seropp.getInfo(function (info) {
			rpc.seroRpc(info.rpc, "dece_estimateGas", [estimateParam], function (ret) {
				if (ret.error) {
					Toast.fail("Failed to execute smart contract")
				} else {
					executeData["gas"] = "0x" + new BigNumber(ret.result).multipliedBy(2).toString(16);
					seropp.executeContract(executeData, function (res, error) {
						if (callback) {
							callback(res, error)
						}
					})
				}
			});
		});
	}
}

const abi = new Abi();
export default abi;