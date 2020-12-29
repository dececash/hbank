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
import logo from '../../images/logo.png'

/**
 *
 */

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
        self.getBalanceOf();
    }

    getBalanceOf() {
        let self = this;
        abi.balanceOf(function (res) {
            console.log(res, ">>>>>>>>>>");
            let arr = [];

            for (let i = 0; i < res.length; i++) {
                let obj = {
                    token: "",
                    value: 0,
                    url: ""
                }
                obj.token = res[i].token;
                obj.value = res[i].value;
                /**
                 *Upload image name with a
                 */
                obj.url = 'https://13.124.240.238/images/a' + res[i].token + '_0.png';
                arr.push(obj);
            }
            console.log(arr);
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
                    self.getBalanceOf();
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
                    self.getBalanceOf();
                });
            }
        });
    }
    setPair(tokenA, tokenB, price) {
        abi.setPair(this.state.account.pk, this.state.account.mainPKr, tokenA, tokenB, price, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                });
            }
        });
    }
    setFeeRate(tokenA, tokenB, fee) {
        abi.setFeeRate(this.state.account.pk, this.state.account.mainPKr, tokenA, tokenB, fee, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                });
            }
        });
    }
    render() {
        let self = this;
        return (

            <WingBlank>
                <Nav selectedTab="4">
                    <div className="tabcontent">
                        <Flex className="header">
                            <Flex.Item className="tabcontent-box">
                                <img src={logo} alt="logo" />
                                <p className='title'>
                                    兑换管理
                                </p>
                            </Flex.Item>
                        </Flex>
                        <WhiteSpace />
                        <WhiteSpace />
                        <WhiteSpace />
                        <WhiteSpace />
                        <Flex>
                            <Flex.Item className="tabcontent-box">
                                {
                                    self.state.dataList.map((item, key) => {
                                        return (
                                            <div>
                                                <Card>
                                                    <Card.Header
                                                        title={item.token}
                                                        thumb={item.url}
                                                        extra={<span>余额：{item.value}</span>}
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
                                                                }}>充值</Button>
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
                                                                }}>提现</Button>
                                                            </Flex.Item>
                                                        </Flex>
                                                        <WhiteSpace />
                                                        <Flex style={{ textAlign: 'center' }}>
                                                            <Flex.Item>
                                                                <Button size="small" onClick={() => {
                                                                    alert("", <div>
                                                                        <div>
                                                                            <InputItem
                                                                                value={item.token}
                                                                                disabled
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
                                                                }}>设置价格</Button>
                                                            </Flex.Item>
                                                            <Flex.Item>
                                                                <Button size="small" onClick={() => {
                                                                    alert("", <div>
                                                                        <div>
                                                                            <InputItem
                                                                                value={item.token}
                                                                                disabled
                                                                                ref={el => this.tokenAInputRef = el}>TOKENA:</InputItem>
                                                                            <InputItem
                                                                                placeholder="tokenB"
                                                                                ref={el => this.tokenBInputRef = el} onChange={() => {

                                                                                }}>TOKENB:</InputItem>
                                                                            <InputItem
                                                                                placeholder="fee"
                                                                                ref={el => this.feeInputRef = el}>Fee:</InputItem>
                                                                        </div>
                                                                    </div>, [
                                                                        { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                                                        {
                                                                            text: `${i18n.t("confirm")}`, onPress: () => {
                                                                                let tokenA = this.tokenAInputRef.state.value.trim();
                                                                                let tokenB = this.tokenBInputRef.state.value.trim();
                                                                                let fee = new BigNumber(this.feeInputRef.state.value).toFixed(0);
                                                                                self.setFeeRate(tokenA, tokenB, fee)
                                                                            }
                                                                        },
                                                                    ])
                                                                }}>设置费率</Button>
                                                            </Flex.Item>
                                                        </Flex>
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