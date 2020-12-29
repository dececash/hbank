/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, WhiteSpace, Modal, Button, InputItem, Toast, } from 'antd-mobile';
import Nav from '../../component/nav'

import './assets.css'
import { showPK } from "../../api/common";
import i18n from '../../i18n'
import abi from '../../api/abi';

import logo from '../../images/logo.png';
import BigNumber from 'bignumber.js';
const alert = Modal.alert;
const operation = Modal.operation;

// const Web3EthAbi = require('web3-eth-abi');
// console.log(Web3EthAbi.encodeParameters(['address', 'uint256'], ["0x27e700b45719dbf69f4a7f762a5e6c31e5c7fcb0",6] ))

class Assets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            datalist: []
        }
    }
    fetchInfo(mainPKr) {
        if (!mainPKr && this.state.account) {
            mainPKr = this.state.account.mainPKr;
        }
        let self = this;
        abi.pairList(mainPKr, function (pairs) {
            self.setState({ pairs: pairs });
        })

    }
    componentDidMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));


        if (obj == null) {
            abi.currentAccount(function (account) {
                self.getBalances(account.mainPKr);
                sessionStorage.setItem('account', JSON.stringify(account))
                self.setState({ account: account });
            });
        } else {
            self.getBalances(obj.mainPKr);
            self.setState({ account: obj });
        }
    }

    goPage = (uri) => {
        window.location.href = uri;
    }

    getBalances(mainPKr) {
        let self = this;
        abi.getBalances(mainPKr, function (res) {
            let arr = [];
            for (let i = 0; i < res.length; i++) {
                let obj = {
                    token: "",
                    value: 0,
                    url: ""
                }
                obj.token = res[i].cy;
                obj.value = new BigNumber(res[i].value).div(10 ** 18).toNumber().toFixed(3);
                obj.url = 'https://13.124.240.238/images/a' + res[i].cy + '_0.png';
                arr.push(obj);
            }
            self.setState({
                datalist: arr
            })
        })
    }

    changAccount() {
        let self = this;
        abi.init
            .then(() => {
                abi.accountList(function (accounts) {
                    let actions = [];
                    accounts.forEach(function (account, index) {
                        actions.push(
                            {
                                text: <span>{account.name + ":" + showPK(account.pk)}</span>, onPress: () => {
                                    self.getBalances(account.mainPKr);
                                    self.setState({
                                        account: account
                                    })
                                    sessionStorage.setItem('account', JSON.stringify(account));
                                }
                            }
                        );
                    });
                    operation(actions);
                });
            })
    }

    render() {
        let self = this;
        return (
            <Nav selectedTab="1">
                <div className="tabcontent">
                    <Flex className="header">
                        <Flex.Item className="tabcontent-box">
                            <img src={logo} alt="logo" />
                            <p className='title'>
                                数字资产银行
                            </p>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace />
                    <Flex className="changAccount tabcontent-box" style={{ textAlign: 'center' }}>
                        <Flex.Item
                            className="changAccount-name">{i18n.t("Currentaccount")}：{this.state.account.name}</Flex.Item>
                        <Flex.Item>
                            <a onClick={() => {
                                this.changAccount();
                            }}>{i18n.t("Switchaccount")}</a>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace />
                    <div className="content">

                        {
                            self.state.datalist.map((item, index) => {
                                return (

                                    <div className="listItem" key={index}>
                                        <Flex>
                                            <Flex.Item>
                                                <Flex>
                                                    <img className="assetsimg" src={item.url} alt="" />
                                                    <span className="assetstitle" >{item.token}</span>
                                                </Flex>
                                            </Flex.Item>
                                            <Flex.Item className="assetsbox">
                                                <Flex.Item className="amounttitle">余额</Flex.Item>
                                                <Flex.Item className="amount">{item.value}</Flex.Item>
                                            </Flex.Item>
                                        </Flex>
                                        <WhiteSpace />
                                        <Flex>
                                            <Flex.Item>
                                                <Button size="small" onClick={() => {
                                                    alert('充值', <div>
                                                        <InputItem
                                                            placeholder="amount"
                                                            ref={el => self.sendInputRef = el}
                                                            onChange={(value) => {
                                                            }}
                                                        >{item.token}</InputItem>
                                                    </div>, [
                                                        { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                                        {
                                                            text: `${i18n.t("confirm")}`, onPress: () => {
                                                                let value = new BigNumber(self.sendInputRef.state.value).multipliedBy(1e18);
                                                                abi.hbankRecharge(self.state.account.pk, self.state.account.mainPKr, value, item.token, function (hash, err) {
                                                                    if (err) {
                                                                        Toast.fail(err);
                                                                    } else {
                                                                        abi.startGetTxReceipt(hash, function () {
                                                                            self.getBalances(self.state.account.mainPKr)
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        },
                                                    ])
                                                }}>充值</Button>
                                            </Flex.Item>
                                            <Flex.Item>
                                                <Button size="small" onClick={() => {
                                                    alert('提现', <div>
                                                        <InputItem
                                                            placeholder="amount"
                                                            ref={el => self.sendInputRef = el}
                                                            onChange={(value) => {
                                                                console.log(value);
                                                            }}
                                                        >{item.token}</InputItem>
                                                    </div>, [
                                                        { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                                        {
                                                            text: `${i18n.t("confirm")}`, onPress: () => {
                                                                let value = new BigNumber(self.sendInputRef.state.value).multipliedBy(1e18).toFixed(0);
                                                                abi.hbankWithDraw(self.state.account.pk, self.state.account.mainPKr, value, item.token, function (hash, err) {
                                                                    if (err) {
                                                                        Toast.fail(err);
                                                                    } else {
                                                                        abi.startGetTxReceipt(hash, function () {
                                                                            self.getBalances(self.state.account.mainPKr)
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        },
                                                    ])
                                                }}>提现</Button>
                                            </Flex.Item>
                                            <Flex.Item>
                                                <Link to={{ pathname: `/assetsdetail`, state: { cy: item.token, account: this.state.account } }} >
                                                    <Button size="small">查看明细</Button>
                                                </Link>
                                            </Flex.Item>
                                        </Flex>
                                    </div>

                                )
                            })
                        }

                    </div>
                </div>
            </Nav>
        )
    }
}

export default Assets;