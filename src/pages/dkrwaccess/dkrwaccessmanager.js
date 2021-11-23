/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex,Card, Toast, Button, WhiteSpace, InputItem, Modal, Tabs,Icon  } from 'antd-mobile';
import BigNumber from 'bignumber.js';
import i18n from '../../i18n';
import Nav from '../../component/nav';
import logo from '../../images/logo.png';
import abi from '../../api/abi';
import {RechareItem, WithDrawItem} from '../../component/dkrwAccessList';
import {DKRW} from '../../images/cyicon/index';
import pgnode from '../../api/pgnode';
const alert = Modal.alert;

const tabs2 = [
    { title: `${i18n.t("Depositreview")}`, sub: '0' },
    { title: `${i18n.t("Withdrawalreviewm")}`, sub: '1' },
];

class DkrwAccessManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account : JSON.parse(sessionStorage.getItem('account')),
            dkrwAmount:0,
            withdrawList: [],
            rechargeList:[],
            pageIndex:0,
            pageCount:10,
            showType:0,
            owner:"",
            publicKey:"",
        }
    }

    init(mainPKr) {
        if(!mainPKr) {
            mainPKr = this.state.account.mainPKr;
        }
        let self = this;
        if(this.state.showType == 0) {
            
            if(self.state.owner!=""){
                pgnode.getRechargeList(self.state.owner,self.state.pageIndex,self.state.pageCount, function(list){
                    self.setState({rechargeList:list})
                })
            }else{
                pgnode.getRechargeList("",self.state.pageIndex,self.state.pageCount, function(list){
                    self.setState({rechargeList:list})
                })
            }
        } else { 
            if(self.state.owner!=""){
                abi.brigeWithDrawList(mainPKr, self.state.pageIndex, self.state.pageCount, self.state.owner, function (list) {
                    // console.log(list)
                    self.setState({
                        withdrawList: list
                    })
                });
            }else{
                abi.brigeWithDrawList(mainPKr, self.state.pageIndex, self.state.pageCount, null, function (list) {
                    // console.log(list)
                    self.setState({
                        withdrawList: list
                    })
                });
            }
        }
    }

    componentDidMount() {
        // console.log("DkrwAccessManager");

        let self = this;
        self.getBalanceOf();
        this.init(this.state.account.mainPKr);
        this.getPublicKey(this.state.account.pk,this.state.account.mainPKr)
    }

    getPublicKey(pk,mainPKr){
        let self =this;
        abi.publicKey(pk,mainPKr,function(res){
            console.log(res,"publicKey")
            self.setState({
                publicKey:res
            })
        })
    }

    getBalanceOf(){
        let self=this;
        abi.dkrweAccessBalance(function(res){
            self.setState({dkrwAmount:res[0].value})
        })
    }
    
    tabChange=(e)=>{
        let self = this;
        this.setState({showType:this.state.showType^1, pageIndex:0}, function() {
            self.init();
        });
    }

    prvePage() {
        if (this.state.pageIndex == 0) {
            return;
        }

        this.setState({
            pageIndex: this.state.pageIndex - 1
        }, function () {
            this.init();
        })
    }

    nextPage() {
        this.setState({
            pageIndex: this.state.pageIndex + 1
        }, function () {
            this.init();
        })
    }
    

    render() {
        let self = this;
        let rechargeItems = self.state.rechargeList.map((data,index) => (
            <RechareItem key={data.trxId} pk={self.state.account.pk} mainPKr={self.state.account.mainPKr}
                isManager={true} item={data} parent={self}
            />
        ))

        let withDrawItems;
        if(this.state.showType == 1) {
            withDrawItems = self.state.withdrawList.map((data,index) => (
                <WithDrawItem key={data.auditingId} pk={self.state.account.pk} mainPKr={self.state.account.mainPKr}
                isManager={true} item={data} parent={self} /> 
            ))
        }

        return (
            <Nav selectedTab="5">
                <div className="tabcontent">
                    <Flex className="header">
                        <Flex.Item className="tabcontent-box">
                            <img className="logo" src={logo} alt="logo" />
                            <p className='title'>
                                {i18n.t("WithdrawalReview")}
                            </p>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace/>
                    <div className="content">
                        <div>
                            <Card>
                                <Card.Header
                                    title="DKRW"
                                    thumb={DKRW}
                                    extra={<span>{self.state.dkrwAmount}</span>}
                                />
                                    <Card.Body>
                                        <Flex style={{ textAlign: 'center' }}>
                                            <Flex.Item>
                                                <Button size="small" onClick={() => { alert(<span>{i18n.t("Recharge")}</span>, <div>
                                                    <div>
                                                        <InputItem value="DKRW" disabled ref={el => this.tokenInputRef = el}>TOKEN:</InputItem>
                                                        <InputItem placeholder="value" ref={el => this.valueInputRef = el}>VALUE:</InputItem>
                                                    </div>
                                                    </div>, [
                                                    { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                                    {
                                                        text: `${i18n.t("confirm")}`, onPress: () => {
                                                            let value = new BigNumber(self.valueInputRef.state.value).multipliedBy(1e18);
                                                            abi.dkrwAccessRecharge(self.state.account.pk, self.state.account.mainPKr, value,"DKRW", function (hash, err) {
                                                                if (err) {
                                                                    Toast.fail(err);
                                                                } else {
                                                                    abi.startGetTxReceipt(hash, function () {
                                                                        self.getBalances();
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    },
                                                ])
                                            }}>{i18n.t("Recharge")}</Button>
                                        </Flex.Item>
                                        <Flex.Item>
                                            <Button size="small" onClick={() => { alert(<span>{i18n.t("withdraw")}</span>, <div>
                                            <div>
                                                <InputItem  value="DKRW" disabled ref={el => this.tokenInputRef = el}>TOKEN:</InputItem>
                                                <InputItem placeholder="value" ref={el => this.valueInputRef = el}>VALUE:</InputItem>
                                            </div>
                                            </div>, [{ text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                                {
                                                    text: `${i18n.t("confirm")}`, onPress: () => {
                                                    let value = new BigNumber(self.valueInputRef.state.value).multipliedBy(1e18);
                                                    abi.dkrwAccessWithdraw(self.state.account.pk, self.state.account.mainPKr, value,"DKRW",function(hash, err) {
                                                            if (err) {
                                                                Toast.fail(err);
                                                            } else {
                                                                abi.startGetTxReceipt(hash, function () {
                                                                    self.getBalances();
                                                                });
                                                            }
                                                        });
                                                    }
                                                },])
                                        }}>{i18n.t("withdraw")}</Button>
                                        </Flex.Item>
                                    </Flex>
                                <WhiteSpace />
                                </Card.Body>
                            </Card>
                            <WhiteSpace/>
                            <WhiteSpace/>
                            <InputItem
                                placeholder={i18n.t("WalletAddress")}
                                ref={el => this.MainPkrFocusInst = el}
                                clear
                                extra={<div><Icon type="search" size='xs' /></div>}
                                onExtraClick={() =>{

                                    self.setState({
                                        owner:self.MainPkrFocusInst.state.value
                                    },function(){
                                        self.init();
                                    })

                                    // self.init(self.MainPkrFocusInst.state.value);
                                    // abi.pkrDecrypt(self.state.account.pk,"qazwsxedc",function(res){
                                    //     console.log(res,self.state.account.pk,"pkrDecrypt")
                                    // })

                                    // let data = Buffer.from("12345678");
                                    // abi.pkrCrypto(self.state.account.pk, self.state.account.mainPKr,data ,function(rr){
                                    //     console.log("pkrCrypto", rr)
                                    //     abi.pkrCrypto(self.state.account.pk, self.state.account.mainPKr, rr,function(rr1){
                                    //         console.log("pkrCrypto", Buffer.from(rr1.slice(2), 'hex').toString())
                                    //     })
                                    // });

                                    // if(self.MainPkrFocusInst.state.value==""){
                                    //     console.log(1);
                                    // }else{
                                    //     console.log(2)
                                    // }
                                }
                            }
                            ></InputItem> 
                           
                            <div className="mytabboxs">
                                <WhiteSpace  />
                                <Tabs tabs={tabs2}
                                    initialPage={0}
                                    animated={false}
                                    useOnPan={false}
                                    renderTab={tab => <span>{tab.title}</span>}
                                    onChange={(e)=>{self.tabChange(e)}}
                                >
                                    <div style={{ alignItems: 'center', justifyContent: 'center', minHeight: '150px', backgroundColor: '#fff' }}>
                                        <div className="dkrw-template">
                                            <div className="dkrw-item">
                                                <div className="content">
                                                    <div className="tab-item">
                                                        <div className="dkrw-amount">
                                                            <p>
                                                                {/* 数量 */}
                                                                {i18n.t("quantity")}
                                                            </p>
                                                        </div>
                                                        <div className="dkrw-time">
                                                            <p>
                                                                {/* 时间 */}
                                                                {i18n.t("time")}
                                                            </p>
                                                        </div>
                                                        <div className="dkrw-state">
                                                            <p>
                                                                {/* 状态 */}
                                                                {i18n.t("status")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="list">{rechargeItems}</div>
                                                    <div className="operation-item">
                                                        <div className="left-icon">
                                                            <p onClick={()=>{this.prvePage()}}>
                                                                {/* 上一页 */}
                                                                {i18n.t("Prev")}
                                                            </p>
                                                        </div>
                                                        <div className="operation-content">
                                                        </div>
                                                        <div className="right-icon">
                                                            <p onClick={()=>{this.nextPage()}}>
                                                                {/* 下一页 */}
                                                                {i18n.t("Next")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ alignItems: 'center', justifyContent: 'center', minHeight: '150px', backgroundColor: '#fff' }}>
                                        <div className="dkrw-template">
                                            <div className="dkrw-item">
                                                <div className="content">
                                                    <div className="tab-item">
                                                        <div className="dkrw-amount">
                                                            <p>
                                                                {/* 数量 */}
                                                                {i18n.t("quantity")}
                                                            </p>
                                                        </div>
                                                        <div className="dkrw-time">
                                                            <p>
                                                                {/* 时间 */}
                                                                {i18n.t("time")}
                                                            </p>
                                                        </div>
                                                        <div className="dkrw-state">
                                                            <p>
                                                                {/* 状态 */}
                                                                {i18n.t("status")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="list">{ withDrawItems} </div>
                                                    <div className="operation-item">
                                                        <div className="left-icon">
                                                            <p onClick={()=>{this.prvePage()}}>
                                                                {/* 上一页 */}
                                                                {i18n.t("Prev")}
                                                            </p>
                                                        </div>
                                                        <div className="operation-content">
                                                        </div>
                                                        <div className="right-icon">
                                                            <p onClick={()=>{this.nextPage()}}>
                                                                {/* 下一页 */}
                                                                {i18n.t("Next")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                    <WhiteSpace size="lg" />
                    <div className= "publickey">
                        <p>{self.state.publicKey}</p>
                    </div>
                    <WhiteSpace size="lg" />

                </div>
            </Nav>
        )
    }
}

export default DkrwAccessManager;