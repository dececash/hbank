import seropp from 'sero-pp'
import serojs from "serojs";
import BigNumber from 'bignumber.js'
import { Toast } from "antd-mobile";
import i18n from '../i18n';
import { JsonRpc } from "./jsonrpc";
import keccak256 from "keccak256";
const rpc = new JsonRpc();

const config = {
	name: "HBank",
	contractAddress: "3vyRevcNrinP9ciw8LeJKPwQ61QvYZNxnDk325qHUzxtRd49guPzoL643KvFeSLW8Q4QGkgm2rit9YTfr83e3bXU",
	hbankAddress: "2vPa2BeMt5jiJiEnnU2fq7P8Yckvvf18NryH6rQnyQiK4gkPfPMiUaJybtp9rDvYhXNd1AKXTHSvVxRgqBcnnV9D",
	github: "https://github.com/dececash/hbank",
	author: "hbank",
	url: document.location.href,
	logo: document.location.protocol + '//' + document.location.host + '/logo.png',
	barColor: "#414691",
	navColor: "#414691",
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
		"stateMutability": "nonpayable",
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
		"name": "keys",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
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

const hbankjson = [
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
				"name": "pageindex",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pagecount",
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
		"name": "setHswap",
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

const hbank = serojs.callContract(hbankjson, config.hbankAddress);

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
					IsCurrent: item.IsCurrent
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
		let value = ["DECE", "DKRW"];
		this.callMethod(hbank, 'getBalances', mainPKr, [value], function (res) {
			callback(res.item);
		})
	}

	getRecords(mainPKr, cy, index, count, callback) {
		this.callMethod(hbank, 'getRecords', mainPKr, [cy, index, count], function (res) {
			callback(res);
		})
	}

	getUserInfoList(mainPKr,pageindex,pagecount, callback) {
		let self = this;

		self.callMethod(hbank, 'getUserInfoList', mainPKr, [pageindex,pagecount], function (res) {
			let pkrs = [];
			res.retuserInfo.forEach(each => {
				pkrs.push(each.owner);
			})
			self.getFullAddress(pkrs, function (rets) {
				res.retuserInfo.forEach(each => {
					each.owner = rets.result[each.owner];
				})
				callback(res.retuserInfo,res.len);
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
		let value = ["DECE", "DKRW"];
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

	callMethod(contract, _method, from, _args, callback) {
		let packData = contract.packData(_method, _args);
		let callParams = {
			from: from,
			to: contract.address,
			data: packData
		};
		console.log(_method, "callParams", callParams)
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
		console.log(_method, args);
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

		console.log(estimateParam, "estimateParam")
		seropp.getInfo(function (info) {
			rpc.seroRpc(info.rpc, "dece_estimateGas", [estimateParam], function (ret) {
				if (ret.error) {
					Toast.fail("Failed to execute smart contract")
				} else {
					executeData["gas"] = ret.result;
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