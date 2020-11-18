import seropp from 'sero-pp'
import serojs from "serojs";
import BigNumber from 'bignumber.js'
import { Toast } from "antd-mobile";
import i18n from '../i18n';
import { JsonRpc } from "./jsonrpc";

const rpc = new JsonRpc();

const config = {
    name: "HBank",
    contractAddress: "NQTmAG6oUJEhEntaqqjzEfiqMGTV6sTWooPTfK4GGeCHEoHhot7w7Bta8MLio4hbTCbtPBS7Fc8j34KjBz8jqTw",
    github: "https://github.com/dececash/hbank",
    author: "hbank",
    url: document.location.href,
    logo: document.location.protocol + '//' + document.location.host + '/logo.png',
    barColor: "#d2f8f8",
    navColor: "#d2f8f8",
    barMode: "dark",
    navMode: "light"
};

const abiJson = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"string","name":"token","type":"string"}],"name":"exchange","outputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"keys","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"manager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_start","type":"uint256"},{"internalType":"uint256","name":"_end","type":"uint256"}],"name":"pairList","outputs":[{"components":[{"internalType":"bytes32","name":"tokenA","type":"bytes32"},{"internalType":"bytes32","name":"tokenB","type":"bytes32"},{"internalType":"uint256","name":"price","type":"uint256"}],"internalType":"struct Swap.Pair[]","name":"rets","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"pairs","outputs":[{"internalType":"bytes32","name":"tokenA","type":"bytes32"},{"internalType":"bytes32","name":"tokenB","type":"bytes32"},{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_manager","type":"address"}],"name":"setManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"tokenA","type":"string"},{"internalType":"string","name":"tokenB","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"}],"name":"setPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"token","type":"string"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];


const contract = serojs.callContract(abiJson, config.contractAddress);

class Abi {

    constructor() {
        let self = this;
        self.init = new Promise(
            (resolve, reject) => {
                seropp.init(config, function (rest) {
                    if (rest === 'success') {
                        console.log("init", rest);
                        return resolve()
                    } else {
                        return reject(rest)
                    }

                })
                this.getPopupInfo();
            }
        )
    }

    initLanguage(callback) {
        seropp.getInfo(function (info) {
            console.log(info)
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
                if(callback) {
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
                if(callback) {
                    callback()
                }
            } else {
                setTimeout(function () {
                    self.startGetTxReceipt(hash, callback)
                }, 2000)
            }
        });
    }

    currentAccount(callback) {
        seropp.getAccountList(function (datas) {
            let account;

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
        let self = this;
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
                    name: item.Name
                })
            });
            callback(accounts)
        });
    }

    getFullAddress(pkrs, callback) {
        seropp.getInfo(function (info) {
            rpc.seroRpc(info.rpc, "dece_getFullAddress", [pkrs], function (rets) {
                callback(rets);
            });
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

    balanceOf(callback) {
        seropp.getInfo(function (info) {
            rpc.seroRpc(info.rpc, "dece_getBalance", [contract.address, "latest"], function (rets) {
                let balances = [];
                if(rets.result.tkn) {
                    let map = new Map(Object.entries(rets.result.tkn));
                    map.forEach((val, key) => {
                        balances.push({ token: key, value: new BigNumber(val).dividedBy(1e18).toFixed(3) });
                    })
                }
                if(callback) {
                    callback(balances);
                }
            });
        });
    }

    pairList(mainPKr, callback) {
        this.callMethod(contract, 'pairList', mainPKr, [0, 100], function (rets) {
            callback(rets[0]);
        });
    }

    setPrice(pk, mainPKr, tokenA, tokenB, price, callback) {
        this.executeMethod(contract, 'setPrice', pk, mainPKr, [tokenA, tokenB, price], "SERO", 0, callback);
    }
    exchange(pk, mainPKr, token, value, currency, callback) {
        this.executeMethod(contract, 'exchange', pk, mainPKr, [token], currency, value, callback);
    }

    withdraw(pk, mainPKr, token, value, callback) {
        this.executeMethod(contract, 'withdraw', pk, mainPKr, [token, value], "SERO", 0, callback);
    }

    send(pk, mainPKr, token, value, callback) {
        this.executeMethod(contract, '', pk, mainPKr, [], token, value, callback);
    }

    callMethod(contract, _method, from, _args, callback) {
        let that = this;
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
