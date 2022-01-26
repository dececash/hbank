/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import Nav from '../../component/nav'
import i18n from '../../i18n'
import { WingBlank, WhiteSpace, Flex, Modal, InputItem, Toast, Card, Button } from 'antd-mobile';
import BigNumber from 'bignumber.js'
import abi from '../../api/abi.js'
import logo from '../../images/logo.png';

import {DECE,DKRW,DHAPY,FPT,HAPY,PFID,PUNIT} from '../../images/cyicon/index';
import { bytes32ToToken } from "../../api/common";


const alert = Modal.alert;
class Bank extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: {},
            balances: [],
            dataList: []
        }
    }

    componentDidMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        self.setState({ account: obj });
        self.getList(obj.mainPKr);
    }

    getList(mainPKr) {
        let self = this;
        abi.pairList(mainPKr, function (data) {
            // console.log(data,">>>>>>>>>>");
            let arr = [];
            if (data != []) {
                for (let i = 0; i < data.length; i++) {
                    arr.push(bytes32ToToken(data[i].tokenA));
                    arr.push(bytes32ToToken(data[i].tokenB));
                }
            }
            let arrimg = [];

            if (Array.from(new Set(arr)) != []) {
                for (let i = 0; i < Array.from(new Set(arr)).length; i++) {
                    let obj = {
                        token: "",
                        value: '0.000',
                        url: DECE
                    }
                    obj.token = Array.from(new Set(arr))[i];
                    if (Array.from(new Set(arr))[i] == "DECE") {
                        obj.url = DECE;
                    } else if (Array.from(new Set(arr))[i] == "DKRW") {
                        obj.url = DKRW;
                    } else if (Array.from(new Set(arr))[i] == "DHAPY") {
                        obj.url = DHAPY;
                    } else if (Array.from(new Set(arr))[i] == "FPT") {
                        obj.url = FPT;
                    } else if (Array.from(new Set(arr))[i] == "HAPY") {
                        obj.url = HAPY;
                    } else if (Array.from(new Set(arr))[i] == "PFID") {
                        obj.url = PFID;
                    } else if (Array.from(new Set(arr))[i] == "PUNIT") {
                        obj.url = PUNIT;
                    }
                    arrimg.push(obj);
                }
            }

            self.getBalanceOf(arrimg);
        })
    }
    getBalanceOf(arr) {
        let self = this;
        abi.balanceOf(function (res) {
            if (res != []) {
                for (let i = 0; i < res.length; i++) {
                    for (let j = 0; j < arr.length; j++) {
                        if (res[i].token == arr[j].token) {
                            arr[j].value = res[i].value
                        }
                    }
                }
            }
            self.setState({
                dataList: arr
            })
        })
    }

    send(token, value) {
        let self = this;
        abi.send(this.state.account.pk, this.state.account.mainPKr, token, value, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                    self.getList(self.state.account.mainPKr);
                });
            }
        });
    }

    withdraw(token, value) {
        let self = this;
        abi.withdraw(this.state.account.pk, this.state.account.mainPKr, token, value, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                    self.getList(self.state.account.mainPKr);
                });
            }
        });
    }

    setPair(tokenA, tokenB, price) {
        let self = this;

        abi.setPair(this.state.account.pk, this.state.account.mainPKr, tokenA, tokenB, price, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                    self.getList(self.state.account.mainPKr);
                });
            }
        });
    }
    setFeeRate(tokenA, tokenB, fee) {
        let self = this;
        abi.setFeeRate(this.state.account.pk, this.state.account.mainPKr, tokenA, tokenB, fee, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                    self.getList(self.state.account.mainPKr);
                });
            }
        });
    }
    render() {
        let self = this;
        return (
            <WingBlank>
                <Nav selectedTab="5">
                    <div className="tabcontent">
                        <Flex className="header">
                            <Flex.Item className="tabcontent-box">
                                <img className="logo" src={logo} alt="logo" />
                                <p className='title'>
                                    {i18n.t("Exchangemanagement")}
                                </p>
                            </Flex.Item>
                        </Flex>
                        <WhiteSpace />
                        <WhiteSpace />
                        <Flex>
                            <Flex.Item className="tabcontent-box">
                                <Flex style={{ textAlign: 'center' }}>
                                    <Flex.Item>
                                        <Button size="small" onClick={() => {
                                            alert("", <div>
                                                <div>
                                                    <InputItem
                                                        placeholder="tokenA"
                                                        ref={el => this.tokenAInputRef = el}>TOKENA:</InputItem>
                                                    <InputItem
                                                        placeholder="tokenB"
                                                        ref={el => this.tokenBInputRef = el} onChange={() => {

                                                        }}>TOKENB:</InputItem>
                                                    <InputItem
                                                        placeholder="price"
                                                        ref={el => this.priceInputRef = el}>Price:</InputItem>
                                                </div>
                                            </div>, [
                                                { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                                {
                                                    text: `${i18n.t("confirm")}`, onPress: () => {
                                                        let tokenA = this.tokenAInputRef.state.value.trim();
                                                        let tokenB = this.tokenBInputRef.state.value.trim();
                                                        let price = new BigNumber(this.priceInputRef.state.value).multipliedBy(1e9).toFixed(0);
                                                        self.setPair(tokenA, tokenB, price);
                                                    }
                                                },
                                            ])
                                        }}>{i18n.t("SetPrice")}</Button>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <Button size="small" onClick={() => {
                                            alert("", <div>
                                                <div>
                                                    <InputItem
                                                        placeholder="tokenA"
                                                        ref={el => this.tokenAInputRef = el}>TOKENA:</InputItem>
                                                    <InputItem
                                                        placeholder="tokenB"
                                                        ref={el => this.tokenBInputRef = el} onChange={() => {

                                                        }}>TOKENB:</InputItem>
                                                    <InputItem
                                                        placeholder="fee"
                                                        extra="%"
                                                        ref={el => this.feeInputRef = el}>Fee:</InputItem>
                                                </div>
                                            </div>, [
                                                { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                                {
                                                    text: `${i18n.t("confirm")}`, onPress: () => {
                                                        let tokenA = this.tokenAInputRef.state.value.trim();
                                                        let tokenB = this.tokenBInputRef.state.value.trim();
                                                        let fee = new BigNumber(this.feeInputRef.state.value).multipliedBy(100).toFixed(0);
                                                        self.setFeeRate(tokenA, tokenB, fee)
                                                    }
                                                },
                                            ])
                                        }}>{i18n.t("SetRate")}</Button>
                                    </Flex.Item>
                                </Flex>
                            </Flex.Item>
                        </Flex>
                        <WhiteSpace />
                        <WhiteSpace />
                        <Flex>
                            <Flex.Item className="tabcontent-box">
                                {
                                    self.state.dataList.map((item, key) => {
                                        return (
                                            <div>
                                                <Card key={key}>
                                                    <Card.Header
                                                        title={item.token}
                                                        thumb={item.url}
                                                        extra={<span>{item.value}</span>}
                                                    />
                                                    <Card.Body>
                                                        <Flex style={{ textAlign: 'center' }}>
                                                            <Flex.Item>
                                                                <Button size="small" onClick={() => {
                                                                    alert(<span>{i18n.t("Recharge")}</span>, <div>
                                                                        <div>
                                                                            <InputItem
                                                                                value={item.token}
                                                                                disabled
                                                                                ref={el => this.tokenInputRef = el}>TOKEN:</InputItem>
                                                                            <InputItem
                                                                                placeholder="value"
                                                                                ref={el => this.valueInputRef = el}>VALUE:</InputItem>
                                                                        </div>
                                                                    </div>, [
                                                                        { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                                                        {
                                                                            text: `${i18n.t("confirm")}`, onPress: () => {
                                                                                let token = this.tokenInputRef.state.value.trim();
                                                                                let value = new BigNumber(this.valueInputRef.state.value).multipliedBy(1e18);
                                                                                self.send(token, value);
                                                                            }
                                                                        },
                                                                    ])
                                                                }}>{i18n.t("Recharge")}</Button>
                                                            </Flex.Item>
                                                            <Flex.Item>
                                                                <Button size="small" onClick={() => {
                                                                    alert(<span>{i18n.t("withdraw")}</span>, <div>
                                                                        <div>
                                                                            <InputItem
                                                                                value={item.token}
                                                                                disabled
                                                                                ref={el => this.tokenInputRef = el}>TOKEN:</InputItem>
                                                                            <InputItem
                                                                                placeholder="value"
                                                                                ref={el => this.valueInputRef = el}>VALUE:</InputItem>
                                                                        </div>
                                                                    </div>, [
                                                                        { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                                                        {
                                                                            text: `${i18n.t("confirm")}`, onPress: () => {
                                                                                let token = this.tokenInputRef.state.value.trim();
                                                                                let value = new BigNumber(this.valueInputRef.state.value).multipliedBy(1e18).toFixed(0);
                                                                                self.withdraw(token, value);
                                                                            }
                                                                        },
                                                                    ])
                                                                }}>{i18n.t("withdraw")}</Button>
                                                            </Flex.Item>
                                                        </Flex>
                                                        <WhiteSpace />

                                                    </Card.Body>
                                                </Card>
                                                <WhiteSpace />
                                            </div>
                                        )
                                    })
                                }
                            </Flex.Item>
                        </Flex>
                        <WhiteSpace />
                    </div>
                </Nav>
            </WingBlank>
        )
    }
}

export default Bank;

