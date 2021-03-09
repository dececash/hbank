/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import Nav from '../../component/nav'
import i18n from '../../i18n'
import { WingBlank, WhiteSpace, List, Flex, Modal, InputItem, Toast } from 'antd-mobile';
import BigNumber from 'bignumber.js'
import abi from '../../api/abi.js'
import { bytes32ToToken, showPK, trimNumber } from "../../api/common";
import logo from '../../images/logo.png'
import './home.css'

import swap_icon from '../../icons/swap.png';
// import swaped_icon from '../../icons/swaped.png';


const operation = Modal.operation;
const alert = Modal.alert;
class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            account: {},
            pairs: [],
            retValue: 0,
            isManager: false,
            isOwner: false,
            balances: [],
            changeType: {
                value: 0,
                label: `${i18n.t("Localaccount")}`
            },
            choosedata: [
                { value: 0, label: `${i18n.t("Localaccount")}` },
                { value: 1, label: `${i18n.t("BankAccount")}` },
            ]
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
        self.setState({ account: obj });
        self.getIsManager(obj.mainPKr);
        self.getIsOwner(obj.mainPKr)
        self.fetchInfo(obj.mainPKr);
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    getIsOwner(mainPKr) {
        let self = this;
        abi.isOwner(mainPKr, function (res) {
            self.setState({
                isOwner: res
            })
        })
    }

    getIsManager(mainPKr) {
        let self = this;
        abi.isManager(mainPKr, function (res) {
            if (res) {
                abi.balanceOf(function (balances) {
                    self.setState({ balances: balances });
                })
            }
            self.setState({
                isManager: res
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
                                text: <span key={index}>{account.name + ":" + showPK(account.pk)}</span>, onPress: () => {
                                    self.getIsManager(account.mainPKr);
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

    changeType() {
        let self = this;
        let actions = [];
        self.state.choosedata.forEach(function (item, index) {
            actions.push(
                {
                    text: <span key={index}>{item.label}</span>, onPress: () => {
                        self.setState({ changeType: item });
                    }
                }
            );
        });
        operation(actions);
    }

    render() {
        let self = this;
        let pairs = this.state.pairs.map((each, index) => {
            let tokenA = bytes32ToToken(each.tokenA);
            let tokenB = bytes32ToToken(each.tokenB);
            if (!tokenA || !tokenB) {
                return;
            }
            if (new BigNumber(each.price).isZero()) {
                return;
            }
            let price = new BigNumber(each.price).div(1e9).toFixed(9);
            if (each.flag) {
                tokenA = bytes32ToToken(each.tokenB);
                tokenB = bytes32ToToken(each.tokenA);
                price = new BigNumber(1e9).div(each.price).toFixed(9);
            }
            price = trimNumber(price, 9);
            return (
                <List.Item key={index}>
                    <Flex style={{ textAlign: 'center' }}>
                        <Flex.Item>
                            {tokenA}
                        </Flex.Item>
                        <Flex.Item>
                            <img src={swap_icon} />
                        </Flex.Item>
                        <Flex.Item>{tokenB}</Flex.Item>
                        <Flex.Item>
                            {price}
                        </Flex.Item>
                        <Flex.Item>
                            <span className="exchange" onClick={() => {
                                alert('', <div>
                                    <div>
                                        <InputItem
                                            value={price} disabled={true}
                                        >Price</InputItem>
                                        <InputItem
                                            placeholder="amount" ref={el => this.sendInputRef = el}
                                            onChange={(value) => {
                                                this.retInputRef.value = new BigNumber(value * Number(price)).toFixed(6);
                                            }}>{tokenA}</InputItem>
                                        <div className="am-list-item am-input-item am-list-item-middle">
                                            <div className="am-list-line">
                                                <div className="am-input-label am-input-label-5">{tokenB}</div>
                                                <div className="am-input-control">
                                                    <input disabled placeholder="amount"
                                                        ref={el => this.retInputRef = el} type="text" value="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>, [
                                    { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                    {
                                        text: `${i18n.t("confirm")}`, onPress: () => {
                                            let value = new BigNumber(this.sendInputRef.state.value).multipliedBy(1e18);
                                            abi.hbankexchange(this.state.account.pk, this.state.account.mainPKr, tokenB, value.toFixed(0), tokenA, function (hash, err) {
                                                if (err) {
                                                    Toast.fail(err);
                                                } else {
                                                    abi.startGetTxReceipt(hash, function (data) {
                                                        self.getIsManager(self.state.account.mainPKr);
                                                        self.fetchInfo(self.state.account.mainPKr);
                                                    });
                                                }
                                            });
                                        }
                                    },
                                ])
                            }}>{i18n.t("exchange")}</span>
                        </Flex.Item>
                    </Flex>
                </List.Item>
            )
        });
        return (
            <WingBlank>
                <Nav selectedTab="2">
                    <div className="tabcontent">
                        <Flex className="header">
                            <Flex.Item className="tabcontent-box">
                                <img className="logo" src={logo} alt="logo" />
                                <p className='title'>
                                    {i18n.t("assetexchange")}
                                </p>
                            </Flex.Item>
                        </Flex>
                        <WhiteSpace />
                        <WhiteSpace />
                        <WhiteSpace />
                        <List className="tabcontent-box">
                            {pairs}
                        </List>
                    </div>
                </Nav>
            </WingBlank>
        )
    }
}

export default Home;