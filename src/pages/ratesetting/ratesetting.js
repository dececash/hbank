/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, List, InputItem, Modal, WhiteSpace, Toast, Card, Button } from 'antd-mobile';
import Nav from '../../component/nav';
import i18n from '../../i18n';
import BigNumber from 'bignumber.js'
import logo from '../../images/logo.png';
import './ratesetting.css';
import abi from '../../api/abi';
const alert = Modal.alert;


class Ratesetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            interestslist: [],
            dataList: []
        }
    }

    componentWillMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        self.getInterestsList(obj.mainPKr);
        self.getBalanceOf();
        self.setState({
            account: obj
        })

    }

    getBalanceOf() {
        let self = this;
        abi.getInterestsList(self.state.account.mainPKr, function (res) {
            console.log(res, "1111111111111>>>>>>>>>>");
            let arr = [];
            for (let i = 0; i < res.length; i++) {
                let obj = {
                    token: "",
                    value: 0,
                    url: "",
                    iRate: 0
                }
                obj.iRate = res[i].iRate / 10;
                obj.token = res[i].cy;
                /**
                 *Upload image name with a
                 */
                obj.url = 'https://13.124.240.238/images/a' + res[i].cy + '_0.png';
                arr.push(obj);
            }

            abi.hbankBalanceOf(function (data) {
                console.log(data, "SISIS")
                if (data != "") {
                    for (let j = 0; j < data.length; j++) {
                        for (let k = 0; k < arr.length; k++) {
                            if (data[j].token == arr[k].token) {
                                arr[k].value = data[j].value
                            }
                        }
                    }
                }

                self.setState({
                    dataList: arr
                })
            })
        })
    }

    getInterestsList(mainPKr) {
        let self = this;
        abi.getInterestsList(mainPKr, function (res) {
            self.setState({
                interestslist: res
            })
        })
    }

    hbankSend(pk, mainPKr, value, cy) {
        let self = this;
        abi.hbankSend(pk, mainPKr, cy, value, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                    self.getBalanceOf();
                });
            }
        });
    }

    WithdrawIsManager(pk, mainPKr, value, cy) {
        let self = this;
        abi.WithdrawIsManager(pk, mainPKr, cy, value, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                    self.getBalanceOf();
                });
            }
        });
    }

    setInterest(pk, mainPKr, cy, value) {
        let self = this;
        abi.setInterest(pk, mainPKr, cy, value * 10, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                    self.getBalanceOf();
                });
            }
        })
    }

    render() {
        let self = this;
        const Item = List.Item;

        return (
            <Nav selectedTab="4">
                <div className="tabcontent">
                    <Flex className="header">
                        <Flex.Item className="tabcontent-box">
                            <img src={logo} alt="logo" />
                            <p className='title'>
                                银行管理
                            </p>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace size="sm" />
                    <WhiteSpace size="sm" />
                    <WhiteSpace size="sm" />
                    <div className="content">
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
                                                                <span>当前日利率：{item.iRate}%</span>
                                                            </Flex.Item>
                                                            <Flex.Item>
                                                                <Button size="small" onClick={() => {
                                                                    alert("", <div>
                                                                        <div>
                                                                            <InputItem
                                                                                value={item.token}
                                                                                disabled
                                                                                ref={el => this.tokenInputRef = el}>TOKEN:</InputItem>
                                                                            <InputItem
                                                                                placeholder={item.iRate}
                                                                                extra="%"
                                                                                ref={el => this.feeInputRef = el}>Fee:</InputItem>
                                                                        </div>
                                                                    </div>, [
                                                                        { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                                                        {
                                                                            text: `${i18n.t("confirm")}`, onPress: () => {
                                                                                let token = this.tokenInputRef.state.value.trim();
                                                                                let fee = this.feeInputRef.state.value;
                                                                                self.setInterest(self.state.account.pk, self.state.account.mainPKr, token, fee)
                                                                            }
                                                                        },
                                                                    ])
                                                                }}>设置利率</Button>
                                                            </Flex.Item>
                                                        </Flex>
                                                        <WhiteSpace />
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
                                                                                self.hbankSend(self.state.account.pk, self.state.account.mainPKr, value, token);
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
                                                                                self.WithdrawIsManager(self.state.account.pk, self.state.account.mainPKr, value, token);
                                                                            }
                                                                        },
                                                                    ])
                                                                }}>提现</Button>
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
                    <WhiteSpace size="sm" />

                </div>
            </Nav>
        )
    }
}

export default Ratesetting;