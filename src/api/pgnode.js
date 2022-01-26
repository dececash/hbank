import axios from "axios";
import keccak256 from "keccak256";
// const baseUrl = 'http://localhost:3100';
const baseUrl = 'https://ginkgobank.dece.cash/pgnode';

class PGNode {

    post(method, data, callback) {
        axios({
            method: 'post',
            url: baseUrl + '/' + method,
            data: data
        }).then(function (response) {
            let ret = response.data;

            if (ret.code == "200") {
                callback(null, ret.data);
            } else {
                callback(ret.message, null);
            }

        }).catch(function (error) {
            callback(error, null);
        });
    }

    get(method, query, callback) {
        axios({
            method: 'get',
            url: baseUrl + '/' + method + "?" + query,
        }).then(function (response) {
            let ret = response.data;
            // console.log(method, response.data);
            if (ret.code == "200") {
                callback(null, ret.data);
            } else {
                callback(ret.message, null);
            }
        }).catch(function (error) {
            callback(error, null);
        });
    }

    register(data, callback) {
        this.post("register", data, callback);
    }

    getUserInfo(pkr,callback) {
        this.get("getUserInfo", "pkr=" + pkr, function (err, info) {
            console.log(err, info, "getUserInfo")
            if (err) {
                // return null
                callback(null);
            } else {
                // return info.vaccnt.account
                callback(info.vaccnt.account,info.vaccnt.bankName,);
            }
        });
    }

    getRechargeList(account, pageIndex, pageCount, callback) {
        this.get("getRechargeList",
            'account=' + account + '&pageIndex=' + pageIndex + '&pageCount=' + pageCount,
            function (err, list) {
                if (err) {
                    callback([]);
                } else {
                    callback(list);
                }
            }
        );
    }

    transfer(data, callback) {
        this.post("transfer", data, callback);
    }

    getTransferStatus(itemId, callback) {
        this.get("transferStatus",
            "itemId=" + itemId,
            function (err, ret) {
                callback(ret.status);
            });
    }

    saveTransfer( pkr, amount, time, itemId, sign, callback) {

        let data = {
            "pkr": pkr,
            "amount": amount,
            "time": time,
            "itemId": itemId,
            "sign": sign,
        }

        this.post("saveTransfer",data, function(err, ret) {
            if(err) {
                callback(false);
            } else {
                callback(true);
            }
        });

    }

    retry(day, callback) {
        this.post("notify", {
            day: day
        }, callback);
    }
}

const pgnode = new PGNode();
export default pgnode;