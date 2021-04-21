/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, WhiteSpace, Card, InputItem, Button, Modal, Toast } from 'antd-mobile';
import i18n from '../../i18n'
import BigNumber from 'bignumber.js'
import abi from '../../api/abi';
import Nav from '../../component/nav'
import logo from '../../images/logo.png';
import {DHAPY} from "../../images/cyicon/index"



const alert = Modal.alert;
class Rechange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            DHapyNum: 0
        }
    }

    componentDidMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        self.getBalance()
        self.setState({
            account: obj
        })
    }


    getBalance() {
        let self = this;

        abi.dkrwbalanceOf(function (res) {
            self.setState({
                DHapyNum: res[0].value
            })
        })
    }

    send(token, value) {
        let self = this;
        abi.dkrwsend(this.state.account.pk, this.state.account.mainPKr, token, value, function (hash, err) {
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
        abi.dkrwwithdraw(this.state.account.pk, this.state.account.mainPKr, token, value, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                    self.getBalance()
                });
            }
        });
    }

    render() {
        let self = this;
        return (
            <Nav selectedTab="4">
                <div className="tabcontent">
                    <Flex className="header">
                        <Flex.Item className="tabcontent-box">
                            <img className="logo" src={logo} alt="logo" />
                            <p className='title'>
                                {i18n.t("Rechargemanagement")}
                            </p>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace />
                    <WhiteSpace />
                    <div className="content">
                        <Card >
                            <Card.Header
                                title="DHAPY"
                                thumb={DHAPY}
                                extra={this.state.DHapyNum}
                            />
                            <Card.Body>
                                <Flex style={{ textAlign: 'center' }}>
                                    <Flex.Item>
                                        <Button size="small" onClick={() => {
                                            alert(<span>{i18n.t("Recharge")}</span>, <div>
                                                <div>
                                                    <InputItem
                                                        placeholder="value"
                                                        ref={el => this.valueInputRef = el}>VALUE:</InputItem>
                                                </div>
                                            </div>, [
                                                { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                                {
                                                    text: `${i18n.t("confirm")}`, onPress: () => {
                                                        let token = "DHAPY";
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
                                                        placeholder="value"
                                                        ref={el => this.valueInputRef = el}>VALUE:</InputItem>
                                                </div>
                                            </div>, [
                                                { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                                {
                                                    text: `${i18n.t("confirm")}`, onPress: () => {
                                                        let token = "DHAPY";
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
                </div>
            </Nav>
        )
    }
}

export default Rechange;