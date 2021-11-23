/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, Modal, Toast, Card, InputItem, Button, WhiteSpace } from 'antd-mobile';
import BigNumber from 'bignumber.js'
import i18n from '../../i18n'
import abi from '../../api/abi';
import Nav from '../../component/nav'
import logo from '../../images/logo.png';
import './regular.less';
const alert = Modal.alert;

class Regular extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            balance: {
                value: 0
            },
            index: 0,
            classManager: false
        }
    }

    componentWillMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        self.getBalance();
        self.setState({
            account: obj
        })
    }

    getBalance() {
        let self = this;
        abi.fixedprodBalance(function (res) {
            if (res[0] != undefined) {
                self.setState({
                    balance: res[0]
                })
            }
        })
    }

    send(token, value) {
        let self = this;
        abi.fixedprodsend(this.state.account.pk, this.state.account.mainPKr, token, value, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                    self.getBalance()
                });
            }
        });
    }

    withdraw(token, value) {
        let self = this;
        abi.fixedprodwithdraw(this.state.account.pk, this.state.account.mainPKr, token, value, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                    self.getBalance()
                });
            }
        });
    }

    setRate(rate) {
        let self = this;
        abi.classSetRate(this.state.account.pk, this.state.account.mainPKr, "DECE", rate, self.state.index, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                });
            }
        });
    }

    isClassManager(mainPKr) {
        let self = this;
        abi.classisManager(mainPKr, function (res) {
            self.setState({
                classManager: res[0]
            })
        })
    }

    render() {
        let self = this;
        return (
            <Nav selectedTab="5">
                <div className="tabcontent">
                    <Flex className="header">
                        <Flex.Item className="tabcontent-box">
                            <img className="logo" src={logo} alt="logo" />
                            <p className='title'>
                                {i18n.t("Regularmanagement")}
                            </p>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace />
                    <WhiteSpace />
                    <div className="content">
                        <Flex>
                            <Flex.Item className="tabcontent-box">
                                <div>
                                    <Card >
                                        <Card.Header
                                            title="DECE"
                                            thumb="/static/media/DECE.a13a904b.png"
                                            extra={<span>{self.state.balance.value}</span>}
                                        />
                                        <Card.Body>
                                            <Flex style={{ textAlign: 'center' }}>
                                                <Flex.Item>
                                                    <Button size="small" onClick={() => {
                                                        alert(<span>{i18n.t("Recharge")}</span>, <div>
                                                            <div>
                                                                <InputItem
                                                                    value={self.state.balance.token}
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
                                                                    value={self.state.balance.token}
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
                                                {
                                                    self.state.classManager ? <Flex.Item>
                                                        <Button size="small" onClick={() => {
                                                            alert(<span>{i18n.t("Setinterest")}</span>, <div>
                                                                <div>
                                                                    <div style={{ display: "flex", padding: "3px" }}>
                                                                        <div style={{ flex: "2" }}>
                                                                            <p style={{ fontSize: "17px", color: "#000", textAlign: "left", paddingLeft: "15px", margin: "0px" }}>Class:</p>
                                                                        </div>
                                                                        <div style={{ flex: "3" }}>
                                                                            <select style={{ width: "100%" }} onChange={(event) => {
                                                                                // console.log(event.target.value)
                                                                                self.setState({
                                                                                    index: event.target.value
                                                                                })
                                                                            }}>
                                                                                <option value="0">0-1{i18n.t("Months")}</option>
                                                                                <option value="1">0-3{i18n.t("Months")}</option>
                                                                                <option value="2">3-6{i18n.t("Months")}</option>
                                                                                <option value="3">6-9{i18n.t("Months")}</option>
                                                                                <option value="4">9-12{i18n.t("Months")}</option>
                                                                                <option value="5">12{i18n.t("Months")}-</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <InputItem placeholder="value" extra="%" ref={el => this.valueInputRef = el}>VALUE:</InputItem>
                                                                </div>
                                                            </div>, [
                                                                { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                                                {
                                                                    text: `${i18n.t("confirm")}`, onPress: () => {
                                                                        let value = 0;
                                                                        if (parseFloat(this.valueInputRef.state.value) > 0) {
                                                                            value = this.valueInputRef.state.value * 100 + 32768;
                                                                        } else {
                                                                            value = this.valueInputRef.state.value * 100;
                                                                        }
                                                                        self.setRate(Math.abs(value))
                                                                    }
                                                                },
                                                            ])
                                                        }}>{i18n.t("Setinterest")}</Button>
                                                    </Flex.Item> : <></>
                                                }
                                                
                                            </Flex>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </Flex.Item>
                        </Flex>
                    </div>
                </div>
            </Nav>
        )
    }
}

export default Regular;