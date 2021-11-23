import seropp from 'sero-pp'
import serojs from "serojs";
import BigNumber from 'bignumber.js'
import {
	Toast
} from "antd-mobile";
import i18n from '../i18n';
import { JsonRpc } from "./jsonrpc";
import keccak256 from "keccak256";
import {
	dkrwJson,
	abiJson,
	hbankJson,
	dkrwdelegateJson,
	iclassJson,
	kycJson,
	fixedprodJson,
	dkrwBrigeJson
} from './abijson';
import base58 from 'bs58';


const Web3EthAbi = require('web3-eth-abi');
const bs58 = require('bs58');
const rpc = new JsonRpc();
const ed25519 = require('ed25519-wasm-pro');

const config = {
	name: " WS BANK",

	contractAddress: "5sDcSj6m1NL1ho5jczaFf1zYHG1yymW6WW1SsxxDnud92mrgjNDRZFGdNKDK15rJ3PC9Ca2HyWBgdi5YuLCX8yYc",
	hbankAddress: "2LaPfgdkTzWPxy6o2e81PFpU5oBAZdy58eE1ScdHGeeov9oxaAmBybJ8C2DBH8o7fKSjPgR25gTC7zDnGehymj4V",
	dkrwdelegateAddress: "5sWtPb2ap1ABpHYM1uBEEMVLJgaYmRVLaxik9u83JUoiUubzmSKB5HwRhm2SKAuGzL7eE2gcTYMENuTJ5sqgy34k",
	dkrwAddress: "48jaTaWHnoGivTRMdZHEUuDktA4hkL68qaJF5P1za52HQymezdtaJdmZTWJs1fuZmzbpW7sU3sUYGjW9hBwDcrEo",
	iclassAddress: "7kQ4X5WruzD1ukRkcRWWdawHqLUQBuwyEmSHsk25oRAozwefNdTEh3MC9ZY7waEh2tHFHDV4DNxsnMMsh6cAGQz",
	fixedprodAddress: "sujKP6EL4fgGz4hvhroyD9KBWkkBKwE9pqnA18udcvHdeKEEVjDL2VYXixQDKT8sEoQN16WAcdJDsF1q8nU7URf",
	kycaddress: "4iaZ8dYDxbJ2G1qHwwM1cskkSpPnpCPkwG1KEASLM1HWLZdcvZ5FHqunJcPzQhZfVTzXSoSDmcyLQvPdwA13Eg71",

	dkrwBrigeAddress: "3MjQztAi7Jw1N28PzJGou4Mc88ur5h26YyrtfUoyRNhi1PYhd7KDw7LYtZRmd5CDvLRYaxRy4iW2b9TYTVoT7Zoi",


	github: "https://github.com/dececash/hbank",
	author: "WS BANK",
	url: document.location.href,
	logo: document.location.protocol + '//' + document.location.host + '/logo.png',
	barColor: "#cf4b04",
	navColor: "#cf4b04",
	barMode: "dark",
	navMode: "light"
};

const contract = serojs.callContract(abiJson, config.contractAddress);

const hbank = serojs.callContract(hbankJson, config.hbankAddress);

const dkrwdelegate = serojs.callContract(dkrwdelegateJson, config.dkrwdelegateAddress);

const dkrw = serojs.callContract(dkrwJson, config.dkrwAddress)

const iclass = serojs.callContract(iclassJson, config.iclassAddress);

const fixedprod = serojs.callContract(fixedprodJson, config.fixedprodAddress);

const kyc = serojs.callContract(kycJson, config.kycaddress);

const dkrwBrige = serojs.callContract(dkrwBrigeJson, config.dkrwBrigeAddress);

const proxyAddr = bs58.encode(Buffer.from(bs58.decode(config.fixedprodAddress).toString('hex') +
	'0000000000000000000000000000000000000000000000000000000000000000', 'hex'))
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
				// console.log(rets)
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
					// console.log(datas[i].Balance.get("DKRW"))
					callback({
						pk: datas[i].PK,
						mainPKr: datas[i].MainPKr,
						name: datas[i].Name,
						dkrwAmount: datas[i].Balance.get("DKRW") || 0,
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
			callback({
				pk: item.PK,
				mainPKr: item.MainPKr,
				name: item.Name,
				balance : item.Balance.get("DKRW") || 0,
			});
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
					index: index,
					dkrwAmount: item.Balance.get("DKRW") || 0,
				})
			});
			callback(accounts)
		});
	}
	/**
	 * contract
	 */
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
						balances.push({
							token: key,
							value: new BigNumber(val).dividedBy(1e18).toFixed(3)
						});
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
						balances.push({
							token: key,
							value: new BigNumber(val).dividedBy(1e18).toFixed(3)
						});
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

	/**
	 * hbank
	 */
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
		let value = ["DECE", "DKRW", "DHAPY", "HAPY", "FPT", "PFID", "PUNIT"];
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
		let value = ["DECE", "DKRW", "DHAPY", "HAPY", "FPT", "PFID", "PUNIT"];
		this.callMethod(hbank, 'getInterestsList', mainPKr, [value], function (res) {
			callback(res.item);
		})
	}

	setInterest(pk, mainPKr, cy, iRate, callback) {
		this.executeMethod(hbank, 'setInterest', pk, mainPKr, [cy, iRate], "DECE", 0, callback)
	}

	register(pk, mainPKr, name, phone, email, code, callback) {
		// console.log(pk, mainPKr, name, phone, email, code,"register")
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

	getkyc(mainPKr, pageindex, pagecount, callback) {
		let self = this;
		self.callMethod(kyc, 'getUserInfoList', mainPKr, [pageindex, pagecount], function (res) {
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

	dkrwwithdraw(pk, mainPKr, token, value, callback) {
		this.executeMethod(dkrwdelegate, 'withdraw', pk, mainPKr, [token, value], "DECE", 0, callback);
	}

	dkrwsend(pk, mainPKr, token, value, callback) {
		this.executeMethod(dkrwdelegate, '', pk, mainPKr, [], token, value, callback);
	}

	dkrwDetail(mainPKr, callback) {
		this.callMethod(dkrw, 'details', mainPKr, [], function (res) {
			callback(res);
		})
	}

	dkrwbalanceOf(callback) {
		seropp.getInfo(function (info) {
			rpc.seroRpc(info.rpc, "dece_getBalance", [dkrwdelegate.address, "latest"], function (rets) {
				let balances = [];
				console.log(rets, "bal")
				if (rets.result.tkn) {
					let map = new Map(Object.entries(rets.result.tkn));
					map.forEach((val, key) => {
						balances.push({
							token: key,
							value: new BigNumber(val).dividedBy(1e18).toFixed(3)
						});
					})
				} else {
					balances.push({
						token: "DHAPY",
						value: "0.00"
					});
				}
				if (callback) {
					callback(balances);
				}
			});
		});
	}

	classGetClassRate(mainPKr, cy, nDay, callback) {
		this.callMethod(iclass, 'getClassRate', mainPKr, [cy, nDay], function (res) {
			let obj = res;
			callback(obj)
		})
	}

	classSetRate(pk, mainPKr, cy, rate, index, callback) {
		this.executeMethod(iclass, "setRate", pk, mainPKr, [cy, rate, index], "DECE", 0, callback)
	}

	classisManager(mainPKr, callback) {
		let self = this;
		self.callMethod(iclass, 'manager', mainPKr, [mainPKr], function (ret) {
			let obj = ret;
			callback(obj)
		});
	}

	fixedprodDeposit(pk, mainPKr, value, currency, callback) {
		// console.log(fixedprod.address, pk, mainPKr, value, currency, ">>>>>>>>>>")
		this.executeMethod(fixedprod, 'deposit', pk, mainPKr, [], currency, value, callback);
	}

	fixedprodFinancing(pk, mainPKr, value, depositcy, paycy, callback) {
		let self = this;
		self.getShortAddress(mainPKr, function (res) {
			let params = Web3EthAbi.encodeParameters(['address', 'string'], [res.result, "DECE"]);
			self.executeMethod(hbank, "financing", pk, mainPKr, [proxyAddr, paycy, value.toString(10), params], "DECE", "0", callback)
		})
	}

	fixedprodProdList(mainPKr, index, count, currency, callback) {
		this.callMethod(fixedprod, 'prodList', mainPKr, [index, count, currency, mainPKr], function (res) {
			callback(res);
		});
	}

	fixedprodWithdraw(pk, mainPKr, index, callback) {
		this.executeMethod(fixedprod, 'withdraw', pk, mainPKr, [index], "DECE", 0, callback);
	}

	fixedprodBalance(callback) {
		let self = this;
		seropp.getInfo(function (info) {
			rpc.seroRpc(info.rpc, "dece_getBalance", [fixedprod.address, "latest"], function (rets) {
				let balances = [];
				if (rets.result.tkn) {
					let map = new Map(Object.entries(rets.result.tkn));
					map.forEach((val, key) => {
						balances.push({
							token: key,
							value: new BigNumber(val).dividedBy(1e18).toFixed(3)
						});
					})
				}
				if (callback) {
					callback(balances);
				}
			});
		});
	}

	fixedprodsend(pk, mainPKr, token, value, callback) {
		this.executeMethod(fixedprod, '', pk, mainPKr, [], token, value, callback);
	}

	fixedprodwithdraw(pk, mainPKr, token, value, callback) {
		this.executeMethod(fixedprod, 'managerWithdraw', pk, mainPKr, [token, value], "DECE", 0, callback);
	}

	fixedprodisManager(mainPKr, callback) {
		let self = this;
		self.callMethod(fixedprod, 'manager', mainPKr, [mainPKr], function (ret) {
			let obj = ret;
			callback(obj)
		});
	}

	dkrweAccessBalance(callback) {
		let self = this;
		seropp.getInfo(function (info) {
			rpc.seroRpc(info.rpc, "dece_getBalance", [dkrwBrige.address, "latest"], function (rets) {
				let balances = [];
				if (rets.result.tkn) {
					let map = new Map(Object.entries(rets.result.tkn));
					map.forEach((val, key) => {
						balances.push({
							token: key,
							value: new BigNumber(val).dividedBy(1e18).toFixed(3)
						});
					})
				}
				if (callback) {
					callback(balances);
				}
			});
		});
	}

	dkrweAccessisManager(mainPKr, callback) {
		let self = this;
		self.callMethod(dkrwBrige, 'manager', mainPKr, [], function (ret) {
			self.getFullAddress([ret[0]], function (rets) {
				if (callback) {
					callback(rets.result[ret[0]] == mainPKr);
				}
			})
		});
	}

	dkrwAccessAccountToAddrs(mainPKr, account, callback) {
		let self = this;
		self.callMethod(dkrwBrige, 'accountToAddrs', mainPKr, [account], function (res) {
			callback(res[0]);
		});
	}

	brigeRechargeAudited(mainPKr, trxId, callback) {
		let self = this;
		self.callMethod(dkrwBrige, 'rechargeAudited', mainPKr, [trxId], function (res) {
			callback(res);
		});
	}

	brigeRegisister(pk, mainPKr, userId, callback) {
		this.executeMethod(dkrwBrige, 'register', pk, mainPKr, [userId], "DECE", 0, callback);
	}

	dkrwaccess(pk, mainPKr, trxId, userId, token, amount, flag, callback) {
		this.executeMethod(dkrwBrige, 'auditing', pk, mainPKr, [trxId, userId, token, amount, flag], "DECE", 0, callback);
	}

	dkrwAccessRecharge(pk, mainPKr, value, currency, callback) {
		this.executeMethod(dkrwBrige, 'dkrwRecharge', pk, mainPKr, [], currency, value, callback);
	}

	dkrwAccessWithdraw(pk, mainPKr, value, token, callback) {
		this.executeMethod(dkrwBrige, 'dkrwWithdraw', pk, mainPKr, [value.toString()], "DECE", 0, callback);
	}

	dkrwAccessUserwithdraw(pk, mainPKr, token, value, callback) {
		this.executeMethod(dkrwBrige, 'withdraw', pk, mainPKr, [], token, value, callback);
	}

	brigeWithDrawList(mainPKr, pageIndex, pageCount, owner, callback) {
		let self = this;
		if (owner) {
			self.callMethod(dkrwBrige, 'getRecordsByUser', mainPKr, [pageIndex, pageCount, owner], function (res) {
				callback(res[0]);
			});
		} else {
			self.callMethod(dkrwBrige, 'getRecords', mainPKr, [pageIndex, pageCount], function (res) {
				callback(res[0]);
			});
		}
	}

	brigeLockedBalance(mainPKr, callback) {
		let self = this;
		self.callMethod(dkrwBrige, 'lockedBalance', mainPKr, [mainPKr], function (res) {
			callback(res);
		});
	}

	dkrwAccessAuditingRechareg(pk, mainPKr, trxId, account, amount, flag, callback) {
		// console.log("dkrwAccessAuditingRechareg",  trxId, account, amount, flag);
		this.executeMethod(dkrwBrige, 'auditingRechareg', pk, mainPKr, [trxId, account, amount, flag], "DECE", 0, callback);
	}

	dkrwAccessAuditingWithdraw(pk, mainPKr, list, flag, callback) {
		this.executeMethod(dkrwBrige, 'auditingWithdraw', pk, mainPKr, [list, flag], "DECE", 0, callback);
	}

	// pkrEncrypt(pkr, data, callback) {
	//     seropp.pkrEncrypt({pkr: pkr, data: data}, callback)
	// }

	pkrDecrypt(pk, data, callback) {
	    seropp.pkrDecrypt({pk: pk, data: data}, callback)
	}

	sign(pk, pkr, msgHash, callback) {
		let datas = bs58.decode(pk).slice(20,52);
		console.log(`datas`, datas,msgHash)
		seropp.pkrCrypto({pk: pk, pkr: pkr, data: datas}, function(ret, err) {
			let seed = Buffer.from(ret, 'hex');
			let keys = ed25519.createKeyPair(seed);
			let signature = ed25519.sign(new Uint8Array(msgHash.slice(2,msgHash.length)),keys.publicKey, keys.secretKey);
			// console.log("result", ed25519.verify(signature, new Uint8Array(seed), keys.publicKey),keys.publicKey);
			callback(signature);
		});
	}

	publicKey(pk, pkr, callback) {
		let datas = bs58.decode(pk).slice(20,52);
		seropp.pkrCrypto({pk: pk, pkr: pkr, data: datas}, function(ret) {
			let seed = Buffer.from(ret, 'hex');
			let keys = ed25519.createKeyPair(seed);
			
			callback("0x"+Buffer.from(keys.publicKey).toString('hex'));
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