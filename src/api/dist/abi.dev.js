"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _seroPp = _interopRequireDefault(require("sero-pp"));

var _serojs = _interopRequireDefault(require("serojs"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _antdMobile = require("antd-mobile");

var _i18n = _interopRequireDefault(require("../i18n"));

var _jsonrpc = require("./jsonrpc");

var _keccak = _interopRequireDefault(require("keccak256"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var rpc = new _jsonrpc.JsonRpc();
var config = {
  name: "HBank",
  contractAddress: "5LAcvXxv2uo4fHbskEWwZ8zTfrt37bPgj2fKWNzd3jLJLQE7cr9d6343bqay2ZiKs7f8k3bh5csDgxqJKpjo27gA",
  hbankAddress: "3A12BVv3CzQzQUvEoq7LWX3A7BL5nxyXEanAio5mj8Tw7yaddgdfjFZswyYnwC56c9yE23nminUj8EikkrVAJv1V",
  github: "https://github.com/dececash/hbank",
  author: "hbank",
  url: document.location.href,
  logo: document.location.protocol + '//' + document.location.host + '/logo.png',
  barColor: "#414691",
  navColor: "#414691",
  barMode: "dark",
  navMode: "light"
};
var abiJson = [{
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "previousOwner",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "newOwner",
    "type": "address"
  }],
  "name": "OwnershipTransferred",
  "type": "event"
}, {
  "inputs": [{
    "internalType": "string",
    "name": "tokenA",
    "type": "string"
  }, {
    "internalType": "string",
    "name": "tokenB",
    "type": "string"
  }],
  "name": "delPair",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "string",
    "name": "token",
    "type": "string"
  }],
  "name": "exchange",
  "outputs": [{
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "stateMutability": "payable",
  "type": "function"
}, {
  "inputs": [],
  "name": "keys",
  "outputs": [{
    "internalType": "bytes32",
    "name": "head",
    "type": "bytes32"
  }, {
    "internalType": "bytes32",
    "name": "tail",
    "type": "bytes32"
  }, {
    "internalType": "uint256",
    "name": "len",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "manager",
  "outputs": [{
    "internalType": "address",
    "name": "",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "owner",
  "outputs": [{
    "internalType": "address",
    "name": "",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "uint256",
    "name": "_start",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "_end",
    "type": "uint256"
  }],
  "name": "pairList",
  "outputs": [{
    "components": [{
      "internalType": "bytes32",
      "name": "tokenA",
      "type": "bytes32"
    }, {
      "internalType": "bytes32",
      "name": "tokenB",
      "type": "bytes32"
    }, {
      "internalType": "uint256",
      "name": "price",
      "type": "uint256"
    }, {
      "internalType": "uint256",
      "name": "feeRate",
      "type": "uint256"
    }],
    "internalType": "struct Swap.Pair[]",
    "name": "rets",
    "type": "tuple[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "",
    "type": "bytes32"
  }],
  "name": "pairs",
  "outputs": [{
    "internalType": "bytes32",
    "name": "tokenA",
    "type": "bytes32"
  }, {
    "internalType": "bytes32",
    "name": "tokenB",
    "type": "bytes32"
  }, {
    "internalType": "uint256",
    "name": "price",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "feeRate",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "string",
    "name": "tokenA",
    "type": "string"
  }, {
    "internalType": "string",
    "name": "tokenB",
    "type": "string"
  }, {
    "internalType": "uint256",
    "name": "feeRate",
    "type": "uint256"
  }],
  "name": "setFeeRate",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "_manager",
    "type": "address"
  }],
  "name": "setManager",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "string",
    "name": "tokenA",
    "type": "string"
  }, {
    "internalType": "string",
    "name": "tokenB",
    "type": "string"
  }, {
    "internalType": "uint256",
    "name": "price",
    "type": "uint256"
  }],
  "name": "setPair",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "newOwner",
    "type": "address"
  }],
  "name": "transferOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "string",
    "name": "token",
    "type": "string"
  }, {
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "withdraw",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "stateMutability": "payable",
  "type": "receive"
}];

var contract = _serojs["default"].callContract(abiJson, config.contractAddress);

var hbankjson = [{
  "inputs": [{
    "internalType": "address",
    "name": "_swap",
    "type": "address"
  }],
  "stateMutability": "nonpayable",
  "type": "constructor"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "previousOwner",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "newOwner",
    "type": "address"
  }],
  "name": "OwnershipTransferred",
  "type": "event"
}, {
  "inputs": [{
    "internalType": "bytes32[]",
    "name": "keys",
    "type": "bytes32[]"
  }, {
    "internalType": "bool",
    "name": "flag",
    "type": "bool"
  }],
  "name": "check",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address[]",
    "name": "users",
    "type": "address[]"
  }, {
    "internalType": "bool",
    "name": "flag",
    "type": "bool"
  }],
  "name": "checkUsers",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "string",
    "name": "_tokenA",
    "type": "string"
  }, {
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }, {
    "internalType": "string",
    "name": "_tokenB",
    "type": "string"
  }],
  "name": "exchange",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "financeAddr",
    "type": "address"
  }, {
    "internalType": "string",
    "name": "tokenStr",
    "type": "string"
  }, {
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "params",
    "type": "bytes"
  }],
  "name": "financing",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32[]",
    "name": "currencys",
    "type": "bytes32[]"
  }],
  "name": "getBalances",
  "outputs": [{
    "components": [{
      "internalType": "string",
      "name": "cy",
      "type": "string"
    }, {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }, {
      "internalType": "uint256",
      "name": "lasttime",
      "type": "uint256"
    }],
    "internalType": "struct Hbank.RetAsset[]",
    "name": "item",
    "type": "tuple[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getCheckList",
  "outputs": [{
    "components": [{
      "internalType": "bytes32",
      "name": "key",
      "type": "bytes32"
    }, {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    }, {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }, {
      "internalType": "uint256",
      "name": "time",
      "type": "uint256"
    }, {
      "internalType": "string",
      "name": "currency",
      "type": "string"
    }],
    "internalType": "struct Hbank.RetCheck[]",
    "name": "retcheck",
    "type": "tuple[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32[]",
    "name": "currencys",
    "type": "bytes32[]"
  }],
  "name": "getInterestsList",
  "outputs": [{
    "components": [{
      "internalType": "string",
      "name": "cy",
      "type": "string"
    }, {
      "internalType": "uint256",
      "name": "iRate",
      "type": "uint256"
    }],
    "internalType": "struct Hbank.RetInterest[]",
    "name": "item",
    "type": "tuple[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "string",
    "name": "currency",
    "type": "string"
  }, {
    "internalType": "uint256",
    "name": "index",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "count",
    "type": "uint256"
  }],
  "name": "getRecords",
  "outputs": [{
    "internalType": "uint256",
    "name": "len",
    "type": "uint256"
  }, {
    "components": [{
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }, {
      "internalType": "uint256",
      "name": "time",
      "type": "uint256"
    }, {
      "internalType": "enum Hbank.RType",
      "name": "rType",
      "type": "uint8"
    }],
    "internalType": "struct Hbank.Record[]",
    "name": "list",
    "type": "tuple[]"
  }, {
    "internalType": "uint256[]",
    "name": "statusList",
    "type": "uint256[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getRegisterList",
  "outputs": [{
    "components": [{
      "components": [{
        "internalType": "string",
        "name": "name",
        "type": "string"
      }, {
        "internalType": "string",
        "name": "phone",
        "type": "string"
      }, {
        "internalType": "string",
        "name": "email",
        "type": "string"
      }, {
        "internalType": "bytes32",
        "name": "code",
        "type": "bytes32"
      }, {
        "internalType": "enum Hbank.STate",
        "name": "state",
        "type": "uint8"
      }],
      "internalType": "struct Hbank.UserInfo",
      "name": "info",
      "type": "tuple"
    }, {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    }],
    "internalType": "struct Hbank.RetuserInfo[]",
    "name": "retuserInfo",
    "type": "tuple[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "UserAddress",
    "type": "address"
  }],
  "name": "getUserInfo",
  "outputs": [{
    "components": [{
      "internalType": "string",
      "name": "name",
      "type": "string"
    }, {
      "internalType": "string",
      "name": "phone",
      "type": "string"
    }, {
      "internalType": "string",
      "name": "email",
      "type": "string"
    }, {
      "internalType": "bytes32",
      "name": "code",
      "type": "bytes32"
    }, {
      "internalType": "enum Hbank.STate",
      "name": "state",
      "type": "uint8"
    }],
    "internalType": "struct Hbank.UserInfo",
    "name": "",
    "type": "tuple"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "string",
    "name": "token",
    "type": "string"
  }, {
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "hbankWithdraw",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "",
    "type": "bytes32"
  }, {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "name": "interests",
  "outputs": [{
    "internalType": "uint256",
    "name": "time",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "iRate",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "manager",
  "outputs": [{
    "internalType": "address",
    "name": "",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "userAddress",
    "type": "address"
  }, {
    "internalType": "string",
    "name": "name",
    "type": "string"
  }, {
    "internalType": "string",
    "name": "phone",
    "type": "string"
  }, {
    "internalType": "string",
    "name": "email",
    "type": "string"
  }],
  "name": "modifyInformation",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "owner",
  "outputs": [{
    "internalType": "address",
    "name": "",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }],
  "name": "recharge",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "string",
    "name": "name",
    "type": "string"
  }, {
    "internalType": "string",
    "name": "phone",
    "type": "string"
  }, {
    "internalType": "string",
    "name": "email",
    "type": "string"
  }, {
    "internalType": "bytes32",
    "name": "code",
    "type": "bytes32"
  }],
  "name": "register",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "string",
    "name": "currency",
    "type": "string"
  }, {
    "internalType": "uint256",
    "name": "iRate",
    "type": "uint256"
  }],
  "name": "setInterest",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "_manager",
    "type": "address"
  }],
  "name": "setManager",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "newOwner",
    "type": "address"
  }],
  "name": "transferOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "string",
    "name": "currency",
    "type": "string"
  }, {
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "withDraw",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "stateMutability": "payable",
  "type": "receive"
}];

var hbank = _serojs["default"].callContract(hbankjson, config.hbankAddress);

var Abi =
/*#__PURE__*/
function () {
  function Abi() {
    var _this = this;

    _classCallCheck(this, Abi);

    var self = this;
    self.init = new Promise(function (resolve, reject) {
      _seroPp["default"].init(config, function (rest) {
        if (rest === 'success') {
          return resolve();
        } else {
          return reject(rest);
        }
      });

      _this.getPopupInfo();
    });
  }

  _createClass(Abi, [{
    key: "hash",
    value: function hash(data, callback) {
      callback((0, _keccak["default"])(data).toString('hex'));
    }
  }, {
    key: "getFullAddress",
    value: function getFullAddress(pkrs, callback) {
      _seroPp["default"].getInfo(function (info) {
        rpc.seroRpc(info.rpc, "dece_getFullAddress", [pkrs], function (rets) {
          callback(rets);
        });
      });
    }
  }, {
    key: "initLanguage",
    value: function initLanguage(callback) {
      _seroPp["default"].getInfo(function (info) {
        callback(info.language);
      });
    }
  }, {
    key: "getPopupInfo",
    value: function getPopupInfo() {
      _seroPp["default"].getInfo(function (info) {
        localStorage.setItem("language", info.language);

        _i18n["default"].changeLanguage(info.language)["catch"]();
      });
    }
  }, {
    key: "getTransactionReceipt",
    value: function getTransactionReceipt(txHash, callback) {
      _seroPp["default"].getInfo(function (info) {
        rpc.seroRpc(info.rpc, "dece_getTransactionReceipt", [txHash], function (rest) {
          if (callback) {
            callback(rest);
          }
        });
      });
    }
  }, {
    key: "startGetTxReceipt",
    value: function startGetTxReceipt(hash, callback) {
      var self = this;

      _antdMobile.Toast.loading("Loading...", 60);

      this.getTransactionReceipt(hash, function (res) {
        if (res && res.result) {
          _antdMobile.Toast.hide();

          if (callback) {
            callback(res);
          }
        } else {
          setTimeout(function () {
            self.startGetTxReceipt(hash, callback);
          }, 5000);
        }
      });
    }
  }, {
    key: "currentAccount",
    value: function currentAccount(callback) {
      _seroPp["default"].getAccountList(function (datas) {
        for (var i = 0; i < datas.length; i++) {
          if (datas[i].IsCurrent == undefined || datas[i].IsCurrent) {
            callback({
              pk: datas[i].PK,
              mainPKr: datas[i].MainPKr,
              name: datas[i].Name
            });
            break;
          }
        }
      });
    }
  }, {
    key: "accountDetails",
    value: function accountDetails(pk, callback) {
      if (!pk) {
        return;
      }

      _seroPp["default"].getAccountDetail(pk, function (item) {
        callback({
          pk: item.PK,
          mainPKr: item.MainPKr,
          name: item.Name
        });
      });
    }
  }, {
    key: "accountList",
    value: function accountList(callback) {
      _seroPp["default"].getAccountList(function (data) {
        var accounts = [];
        data.forEach(function (item, index) {
          accounts.push({
            pk: item.PK,
            mainPKr: item.MainPKr,
            name: item.Name,
            IsCurrent: item.IsCurrent
          });
        });
        callback(accounts);
      });
    }
  }, {
    key: "isManager",
    value: function isManager(mainPKr, callback) {
      var self = this;
      this.callMethod(contract, 'manager', mainPKr, [], function (ret) {
        console.log(ret);
        self.getFullAddress([ret[0]], function (rets) {
          if (callback) {
            callback(rets.result[ret[0]] == mainPKr);
          }
        });
      });
    }
  }, {
    key: "balanceOf",
    value: function balanceOf(callback) {
      _seroPp["default"].getInfo(function (info) {
        rpc.seroRpc(info.rpc, "dece_getBalance", [contract.address, "latest"], function (rets) {
          var balances = [];

          if (rets.result.tkn) {
            var map = new Map(Object.entries(rets.result.tkn));
            map.forEach(function (val, key) {
              balances.push({
                token: key,
                value: new _bignumber["default"](val).dividedBy(1e18).toFixed(3)
              });
            });
          }

          if (callback) {
            callback(balances);
          }
        });
      });
    }
  }, {
    key: "hbankBalanceOf",
    value: function hbankBalanceOf(callback) {
      _seroPp["default"].getInfo(function (info) {
        rpc.seroRpc(info.rpc, "dece_getBalance", [hbank.address, "latest"], function (rets) {
          var balances = [];

          if (rets.result.tkn) {
            var map = new Map(Object.entries(rets.result.tkn));
            map.forEach(function (val, key) {
              balances.push({
                token: key,
                value: new _bignumber["default"](val).dividedBy(1e18).toFixed(3)
              });
            });
          }

          if (callback) {
            callback(balances);
          }
        });
      });
    }
  }, {
    key: "pair",
    value: function pair(mainPKr, tokenA, tokenB, callback) {
      this.callMethod(contract, 'pair', mainPKr, [tokenA, tokenB], function (rets) {
        callback(rets[0]);
      });
    }
  }, {
    key: "pairList",
    value: function pairList(mainPKr, callback) {
      this.callMethod(contract, 'pairList', mainPKr, [0, 100], function (rets) {
        callback(rets[0]);
      });
    }
  }, {
    key: "setFeeRate",
    value: function setFeeRate(pk, mainPKr, tokenA, tokenB, fee, callback) {
      this.executeMethod(contract, 'setFeeRate', pk, mainPKr, [tokenA, tokenB, fee], "DECE", 0, callback);
    }
  }, {
    key: "setPair",
    value: function setPair(pk, mainPKr, tokenA, tokenB, price, callback) {
      this.executeMethod(contract, 'setPair', pk, mainPKr, [tokenA, tokenB, price], "DECE", 0, callback);
    }
  }, {
    key: "exchange",
    value: function exchange(pk, mainPKr, tokenA, value, tokenB, callback) {
      this.executeMethod(contract, 'exchange', pk, mainPKr, [tokenA], tokenB, value, callback);
    }
  }, {
    key: "withdraw",
    value: function withdraw(pk, mainPKr, token, value, callback) {
      this.executeMethod(contract, 'withdraw', pk, mainPKr, [token, value], "DECE", 0, callback);
    }
  }, {
    key: "send",
    value: function send(pk, mainPKr, token, value, callback) {
      this.executeMethod(contract, '', pk, mainPKr, [], token, value, callback);
    }
  }, {
    key: "WithdrawIsManager",
    value: function WithdrawIsManager(pk, mainPKr, token, value, callback) {
      this.executeMethod(hbank, 'hbankWithdraw', pk, mainPKr, [token, value], "DECE", 0, callback);
    }
  }, {
    key: "hbankSend",
    value: function hbankSend(pk, mainPKr, token, value, callback) {
      console.log(pk, mainPKr, token, value);
      this.executeMethod(hbank, '', pk, mainPKr, [], token, value, callback);
    }
  }, {
    key: "hbankexchange",
    value: function hbankexchange(pk, mainPKr, tokenA, value, tokenB, callback) {
      this.executeMethod(hbank, 'exchange', pk, mainPKr, [tokenB, value, tokenA], "DECE", 0, callback);
    }
  }, {
    key: "hbankRecharge",
    value: function hbankRecharge(pk, mainPKr, value, currency, callback) {
      var data = "";
      this.executeMethod(hbank, 'recharge', pk, mainPKr, [data], currency, value, callback);
    }
  }, {
    key: "hbankWithDraw",
    value: function hbankWithDraw(pk, mainPKr, value, currency, callback) {
      this.executeMethod(hbank, 'withDraw', pk, mainPKr, [currency, value], "DECE", 0, callback);
    }
  }, {
    key: "hbankisManager",
    value: function hbankisManager(mainPKr, callback) {
      var self = this;
      this.callMethod(hbank, 'manager', mainPKr, [], function (ret) {
        self.getFullAddress([ret[0]], function (rets) {
          if (callback) {
            callback(rets.result[ret[0]] == mainPKr);
          }
        });
      });
    }
  }, {
    key: "getBalances",
    value: function getBalances(mainPKr, callback) {
      var value = ["DECE", "D_BTC", "POFID", "GAO"];
      this.callMethod(hbank, 'getBalances', mainPKr, [value], function (res) {
        callback(res.item);
      });
    }
  }, {
    key: "getRecords",
    value: function getRecords(mainPKr, cy, index, count, callback) {
      this.callMethod(hbank, 'getRecords', mainPKr, [cy, index, count], function (res) {
        callback(res);
      });
    }
  }, {
    key: "getCheckList",
    value: function getCheckList(mainPKr, callback) {
      var self = this;
      this.callMethod(hbank, 'getCheckList', mainPKr, [], function (res) {
        console.log(res);
        var pkrs = [];
        res.retcheck.forEach(function (each) {
          pkrs.push(each.owner);
        });
        self.getFullAddress(pkrs, function (rets) {
          res.retcheck.forEach(function (each) {
            each.owner = rets.result[each.owner];
          });
          callback(res.retcheck);
        });
      });
    }
  }, {
    key: "getRegisterList",
    value: function getRegisterList(mainPKr, callback) {
      var self = this;
      this.callMethod(hbank, 'getRegisterList', mainPKr, [], function (res) {
        var pkrs = [];
        res.retuserInfo.forEach(function (each) {
          pkrs.push(each.owner);
        });
        self.getFullAddress(pkrs, function (rets) {
          res.retuserInfo.forEach(function (each) {
            each.owner = rets.result[each.owner];
          });
          callback(res.retuserInfo);
        });
      });
    }
  }, {
    key: "getInterestsList",
    value: function getInterestsList(mainPKr, callback) {
      var value = ["DECE", "D_BTC", "POFID", "GAO"];
      this.callMethod(hbank, 'getInterestsList', mainPKr, [value], function (res) {
        callback(res.item);
      });
    }
  }, {
    key: "setInterest",
    value: function setInterest(pk, mainPKr, cy, iRate, callback) {
      this.executeMethod(hbank, 'setInterest', pk, mainPKr, [cy, iRate], "DECE", 0, callback);
    }
  }, {
    key: "register",
    value: function register(pk, mainPKr, name, phone, email, code, callback) {
      this.executeMethod(hbank, 'register', pk, mainPKr, [name, phone, email, code], "DECE", 0, callback);
    }
  }, {
    key: "getUserInfo",
    value: function getUserInfo(mainPKr, callback) {
      this.callMethod(hbank, 'getUserInfo', mainPKr, [mainPKr], function (res) {
        callback(res);
      });
    }
  }, {
    key: "reviewUser",
    value: function reviewUser(pk, mainPKr, keys, whether, callback) {
      this.executeMethod(hbank, 'checkUsers', pk, mainPKr, [keys, whether], "DECE", 0, callback);
    }
  }, {
    key: "review",
    value: function review(pk, mainPKr, keys, whether, callback) {
      this.executeMethod(hbank, 'check', pk, mainPKr, [keys, whether], "DECE", 0, callback);
    }
  }, {
    key: "callMethod",
    value: function callMethod(contract, _method, from, _args, callback) {
      var packData = contract.packData(_method, _args);
      var callParams = {
        from: from,
        to: contract.address,
        data: packData
      };
      console.log(_method, "callParams", callParams);

      _seroPp["default"].getInfo(function (info) {
        rpc.seroRpc(info.rpc, "dece_call", [callParams, "latest"], function (rets) {
          var data = rets.result;
          console.log(_method, rets);

          if (data !== "0x0") {
            var res = contract.unPackDataEx(_method, data);

            if (callback) {
              callback(res);
            }
          } else {
            callback("0x0");
          }
        });
      });
    }
  }, {
    key: "executeMethod",
    value: function executeMethod(contract, _method, pk, mainPKr, args, tokenName, value, callback) {
      console.log(_method, args);
      var packData = "0x";

      if ("" !== _method) {
        packData = contract.packData(_method, args);
      }

      var executeData = {
        from: pk,
        to: contract.address,
        value: "0x" + value.toString(16),
        data: packData,
        gasPrice: "0x" + new _bignumber["default"]("1000000000").toString(16),
        cy: tokenName
      };
      var estimateParam = {
        from: mainPKr,
        to: contract.address,
        value: "0x" + value.toString(16),
        data: packData,
        gasPrice: "0x" + new _bignumber["default"]("1000000000").toString(16),
        cy: tokenName
      };

      _seroPp["default"].getInfo(function (info) {
        rpc.seroRpc(info.rpc, "dece_estimateGas", [estimateParam], function (ret) {
          if (ret.error) {
            _antdMobile.Toast.fail("Failed to execute smart contract");
          } else {
            executeData["gas"] = ret.result;

            _seroPp["default"].executeContract(executeData, function (res, error) {
              if (callback) {
                callback(res, error);
              }
            });
          }
        });
      });
    }
  }]);

  return Abi;
}();

var abi = new Abi();
var _default = abi;
exports["default"] = _default;