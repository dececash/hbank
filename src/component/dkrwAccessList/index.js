import React, { Component } from 'react';
import { Flex, List, Toast, WhiteSpace, Modal,Icon  } from 'antd-mobile';
import i18n from '../../i18n';
import pgnode from '../../api/pgnode';
import './index.css';
import abi from '../../api/abi';
import BigNumber from 'bignumber.js';
import dateTime from 'date-and-time';
import { values } from 'underscore';
const { keccak256 ,encodePacked} = require("web3-utils");


const alert = Modal.alert;

export class RechareItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pk: this.props.pk,
            mainPKr: this.props.mainPKr,
            isManager: this.props.isManager,
            item: this.props.item,
            status: 0
        }
    }
 
    componentDidMount(){
        let self = this;
        abi.brigeRechargeAudited(this.state.mainPKr, this.state.item.trxId, function(ret) {
            self.setState({status:ret[0]});
        });
    }

    showUserInfo(trxId, account, amount) {
        let self = this;
        abi.dkrwAccessAccountToAddrs(self.state.mainPKr, account, function(shortAddress) {
            abi.getFullAddress([shortAddress], function(ret) {
                let userPKr = ret.result[shortAddress];
                abi.getUserInfo(userPKr, function (res) {
                    const depositModal= alert(<div>{i18n.t("Depositreview")} <Icon style={{height:"16px",position:"relative",float:"right"}} type="cross-circle" onClick={()=>{ depositModal.close()}} /></div>, <List className="mytabbox-item">
                        <Flex>
                            <Flex.Item>
                                {i18n.t("username")}:{res[0].name}
                            </Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item>
                                {i18n.t("phone")}:{res[0].phone}
                            </Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item>
                                {i18n.t("mail")}:{res[0].email}
                            </Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item>
                                {i18n.t("status")}:{res[0].state==2?"ok":"err"}
                            </Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item>
                                mainpkr:{userPKr}
                            </Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item>
                                account:{account}
                            </Flex.Item>
                        </Flex>
                        <WhiteSpace size="sm" />
                    </List>, [
                            { text: `${i18n.t("Fail")}`, onPress: () => {
                                self.auditingRechareg(trxId,account,amount,false);
                            } },
                            { text: `${i18n.t("Pass")}`, onPress: () =>{
                                self.auditingRechareg(trxId,account,amount,true);
                            }}
                    ])
                })
        })
    })}

    auditingRechareg(trxId, account, amount, flag) {
        let self = this;
        amount = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18)).toString();
        console.log(trxId)
        abi.dkrwAccessAuditingRechareg(self.state.pk, self.state.mainPKr, trxId, account, amount, flag, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                    abi.brigeRechargeAudited(self.state.mainPKr, trxId, function (ret) {
                        self.setState({
                            status: ret[0]
                        });
                    });
                });
            }
        })
    }

    render() {
        let self = this;
        let data = this.state.item;
        let status = this.state.status;
        let opHtml = "";
        if(status == 2) {
            // opHtml = "审核未通过";
            opHtml = `${i18n.t("Auditfailed")}`;
        } else if(status == 1) {
            // opHtml ="已充值";
            opHtml =`${i18n.t("Recharged")}`;
        } else {
            if(self.state.isManager) {
                opHtml = <p className="dkrw-btn" onClick={()=>{ self.showUserInfo(data.trxId, data.account, data.amount); }}>
                        {/* 审核 */}
                     {i18n.t("dedicated")}  
                    </p>
            } else {
                // opHtml ="未审核"
                opHtml =`${i18n.t("brigeUnreviewed")}`;
            }
        }
        
        return (
            <div className="list-item" key={data.trxId}>
                <div className="dkrw-amount">
                    <p>{data.amount}</p>
                </div>
                <div className="dkrw-time">
                    <p>
                        {
                            data.createTime?.slice(0, 10)+"  " + data.createTime?.slice(data.createTime.length - 13,data.createTime.length - 5)
                        }
                        
                    </p>
                </div>
               
                <div className="dkrw-state">
                    {opHtml}
                </div>
            </div>
        )
    }
}




export  class WithDrawItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pk: this.props.pk,
            mainPKr: this.props.mainPKr,
            isManager: this.props.isManager,
            item: this.props.item,
            userPKr: "",
            status: 0,
            amount: 0
        }
    }

    componentDidMount() {
        let self = this;
        let item = this.state.item.item;
        abi.getFullAddress([item.owner], function (ret) {
            let userPKr = ret.result[item.owner];
            let amount = new BigNumber(item.amount).div(10 ** 18).toNumber();
            self.setState({
                userPKr: userPKr,
                amount: amount
            });

            pgnode.getTransferStatus(self.state.item.auditingId, function (status) {
                self.setState({
                    status: status
                });
            });
        });
    }

     

    showUserInfo(id,amount,time,type) {
        let self = this;
       
        var kycInfo = new Promise(function (resolve, reject) {
            abi.getUserInfo(self.state.userPKr, function (res) {
                resolve(res[0]) ;
            })
        });

        var pgInfo = new Promise((resolve,reject)=>{
            pgnode.getUserInfo(self.state.userPKr, function(user) {
                resolve(user) 
             })
        });

        Promise.all([kycInfo, pgInfo]).then(function (res) {

            // console.log(res,">>");
            let titleHtml= "";
            let operationHtml="";
            if(type==0){
                // titleHtml="取款审核" 
                titleHtml=`${i18n.t("Withdrawalreviewm")}`
                operationHtml=[
                    { text: `${i18n.t("Fail")}`, onPress: () => {
                        self.auditingWithdraw(self.state.userPKr,id,false);
                    } },
                    { text: `${i18n.t("Pass")}`, onPress: () =>{
                        self.auditingWithdraw(self.state.userPKr,id,true);
                    }}
                ]
            }else{
                // titleHtml="打款审核" 
                titleHtml=`${i18n.t("Paymentreview")}`
                operationHtml=[
                    { text: `${i18n.t("cancel")}`, onPress: () => {
                    } },
                    { text: `${i18n.t("confirm")}`, onPress: () =>{
                        self.transfer(self.state.userPKr,self.state.amount,time,id)
                    }}
                ]
            }
            const withdrawModal = alert(<div>{titleHtml} <Icon style={{height:"16px",position:"relative",float:"right"}} type="cross-circle" onClick={()=>{ withdrawModal.close()}} /></div>
            , <List className="mytabbox-item">
                <Flex>
                    <Flex.Item>{i18n.t("username")}:{res[0].name}</Flex.Item>
                </Flex>
                <Flex>
                    <Flex.Item>{i18n.t("phone")}:{res[0].phone}</Flex.Item>
                </Flex>
                <Flex>
                    <Flex.Item>{i18n.t("mail")}:{res[0].email}</Flex.Item>
                </Flex>
                <Flex>
                    <Flex.Item>
                        {i18n.t("status")}:{res[0].state==2?"ok":"err"}
                    </Flex.Item>
                </Flex>
                <Flex>
                    <Flex.Item>mainpkr：{self.state.userPKr}</Flex.Item>
                </Flex>
                <Flex>
                    <Flex.Item>account：{res[1]}</Flex.Item>
                </Flex>
                <WhiteSpace size="sm" />
            </List>,operationHtml)})
    }

    auditingWithdraw(userPKr, id, flag) {
        let self = this;
        let item = this.state.item.item;
        let itemId = this.state.item.auditingId;
        let amount = new BigNumber(item.amount).div(10 ** 18).toNumber();
        let hash = keccak256(encodePacked(userPKr, itemId, amount, item.createTime));
        // console.log(hash,'hash')
        abi.sign(self.state.pk, self.state.mainPKr, hash, function (sign) {
            // console.log(sign,"sign")
            pgnode.saveTransfer(userPKr, amount, item.createTime, itemId, sign, function (success) {
                if (success) {
                    abi.dkrwAccessAuditingWithdraw(self.state.pk, userPKr, [id], flag, function (hash, err) {
                        console.log(`dkrwAccessAuditingWithdraw`, hash, err)
                        if (err) {
                            Toast.fail(err);
                        } else {
                            abi.startGetTxReceipt(hash, function () {
                                self.props.parent.init(self.state.mainPKr)
                            });
                        }
                    })
                } else {
                    Toast.fail("failed");
                }
            });
        })
    }

    genTTrackId(userId, itemId, amount, time) {
        let hash = keccak256(abi.encodeParameters(["string", "uint", "uint", "uint"], [userId, itemId, amount, time]));
        return "T" + time + hash.slice(2, 9)
    }

    transfer(userPKr, id) {
        let self = this ;
        pgnode.transfer({"pkr":userPKr, "itemId": id}, function (err, ret) {
            if (err) {
                Toast.fail(JSON.stringify(err));
            } else {
                Toast.success("success");
                self.props.parent.init(self.state.mainPKr)
            }
        })
    }

    render() {
        let self = this;
        let data = this.state.item;
        let statusHtml="";
        if(data.item.status == 0) {
            if(self.state.isManager) {
                statusHtml = <p  className="dkrw-btn" onClick={ ()=>{
                        self.showUserInfo(data.auditingId,data.item.amount,data.item.createTime,0)
                    }
                }>
                    {/* 未审核 */}
                    {i18n.t("brigeUnreviewed")}
                </p>
            } else {
                // statusHtml = "未审核";
                statusHtml = `${i18n.t("brigeUnreviewed")}`;
            }
        } else if(data.item.status == 2) {
            // statusHtml = "审核未通过";
            statusHtml = `${i18n.t("Auditfailed")}`;
        } else if(data.item.status == 1) {
            if(this.state.status == 1) {
                // statusHtml = "已打款";
                statusHtml = `${i18n.t("Paid")}`;
            } else if(this.state.status == 0) {
                if(self.state.isManager) {
                    statusHtml = <p  className="dkrw-btn"  onClick={ ()=>{
                        self.showUserInfo(data.auditingId,data.item.amount,data.item.createTime,1)
                        }
                    }>
                        {/* 打款 */}
                        {i18n.t("Makemoney")}
                    </p>
                }
            } else if(this.state.status == 2){
                // statusHtml = "打款失败";
                statusHtml = `${i18n.t("Paymentfailed")}`;
            }
        }
        return (
            <div className="list-item" key={data.trxId}>
                <div className="dkrw-amount">
                    <p>{ new BigNumber(data.item.amount).div(10 ** 18).toNumber().toFixed(2, 1) } </p>
                </div>
                <div className="dkrw-time">
                    <p>{dateTime.format(new Date(data.item.createTime*1000), 'YYYY-MM-DD HH:mm:ss')} </p>
                </div>
                <div className="dkrw-state ">
                    { statusHtml }
                </div>
            </div>
        )
    }
}