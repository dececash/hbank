import React, {Component} from 'react';
import './App.css';

import {WingBlank, WhiteSpace, List, Flex, Modal, InputItem} from 'antd-mobile';
import abi from './component/abi.js'
import {bytes32ToToken, showPK} from "./component/common";
import BigNumber from 'bignumber.js'

import swap_icon from './icons/swap.png'

const operation = Modal.operation;
const alert = Modal.alert;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: {},
            pairs: [],
            retValue: 0,
            isManager: false,
            balances: [],
        }

    }

    fetchInfo(mainPKr) {
        if (!mainPKr && this.state.account) {
            mainPKr = this.state.account.mainPKr;
        }

        let self = this;
        abi.pairList(mainPKr, function (pairs) {
            self.setState({pairs: pairs});
        })
    }

    componentDidMount() {
        let self = this;
        abi.init
            .then(() => {
                if (self.state.account.mainPKr) {
                    self.fetchInfo(self.state.account.mainPKr);
                } else {
                    abi.currentAccount(function (account) {
                        abi.isManager(account.mainPKr, function (isManager) {
                            self.setState({account: account, isManager: isManager});
                            if (isManager) {
                                abi.balanceOf(function (balances) {
                                    self.setState({balances: balances});
                                })
                            }
                            self.fetchInfo(account.mainPKr);
                        })

                    });
                }
                self.timer = setInterval(function () {
                    self.fetchInfo();
                }, 20000);
            });
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
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
                                    abi.isManager(account.mainPKr, function (isManager) {
                                        self.setState({account: account, isManager: isManager});
                                        if (isManager) {
                                            abi.balanceOf(function (balances) {
                                                self.setState({balances: balances});
                                            })
                                        }
                                    })
                                }
                            }
                        );
                    });
                    operation(actions);
                });
            })
    }

    render() {
        let balances;

        let isManager = this.state.isManager;
        if (isManager) {
            console.log(this.state.balances)
            balances = this.state.balances.map(each => {
                return <List.Item>
                    <Flex style={{textAlign: "center"}}>
                        <Flex.Item>{each.token}</Flex.Item>
                        <Flex.Item>{each.value}</Flex.Item>
                    </Flex>
                </List.Item>
            })
        }
        let pairs = this.state.pairs.map((each, index) => {
            let tokenA = bytes32ToToken(each.tokenA);
            let tokenB = bytes32ToToken(each.tokenB);
            let price = new BigNumber(each.price).div(1e9).toFixed(6);
            if (each.flag) {
                tokenA = bytes32ToToken(each.tokenB);
                tokenB = bytes32ToToken(each.tokenA);
                price = new BigNumber(1e9).div(each.price).toFixed(6);
            }
            return (
                <List.Item>
                    <Flex style={{textAlign:'center'}}>
                        <Flex.Item>
                            {tokenA}
                        </Flex.Item>
                        <Flex.Item><a onClick={() => {
                            let pairs = this.state.pairs;
                            pairs[index].flag = !pairs[index].flag;
                            this.setState({pairs: pairs});
                        }}><img src={swap_icon}/></a></Flex.Item>
                        <Flex.Item>{tokenB}</Flex.Item>
                        <Flex.Item>
                            {price}
                        </Flex.Item>
                        <Flex.Item>
                            <span onClick={() => {
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
                                                           ref={el => this.retInputRef = el} type="text" value=""/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>, [
                                    {text: 'Cancel', onPress: () => console.log('cancel')},
                                    {
                                        text: 'Ok', onPress: () => {
                                            let value = new BigNumber(this.sendInputRef.state.value).multipliedBy(1e18);
                                            abi.exchange(this.state.account.pk, this.state.account.mainPKr, tokenB, value, tokenA, function () {

                                            })
                                        }
                                    },
                                ])
                            }}>兑换</span>
                        </Flex.Item>
                    </Flex>
                </List.Item>
            )
        });
        return (
            <WingBlank>
                <Flex>
                    <Flex.Item>{this.state.account.name}</Flex.Item>
                    <Flex.Item>
                        <a onClick={() => {
                            this.changAccount();
                        }}>切换账号</a>
                    </Flex.Item>
                </Flex>
                <WhiteSpace/>
                {
                    isManager && <List renderHeader={() => {
                        return (
                            <Flex style={{textAlign: 'center'}}>
                                <Flex.Item><a onClick={() => {
                                    alert(<span>充值</span>, <div>
                                        <div>
                                            <InputItem
                                                placeholder="token"
                                                ref={el => this.tokenInputRef = el}>TOKEN:</InputItem>
                                            <InputItem
                                                placeholder="value"
                                                ref={el => this.valueInputRef = el}>VALUE:</InputItem>
                                        </div>
                                    </div>, [
                                        {text: 'Cancel', onPress: () => console.log('cancel')},
                                        {
                                            text: 'Ok', onPress: () => {
                                                let token = this.tokenInputRef.state.value.trim();
                                                let value = new BigNumber(this.valueInputRef.state.value).multipliedBy(1e18);
                                                abi.send(this.state.account.pk, this.state.account.mainPKr, token, value);
                                            }
                                        },
                                    ])
                                }}>充值 </a></Flex.Item>
                                <Flex.Item><a onClick={() => {
                                    alert(<span>提现</span>, <div>
                                        <div>
                                            <InputItem
                                                placeholder="token"
                                                ref={el => this.tokenInputRef = el}>TOKEN:</InputItem>
                                            <InputItem
                                                placeholder="value"
                                                ref={el => this.valueInputRef = el}>VALUE:</InputItem>
                                        </div>
                                    </div>, [
                                        {text: 'Cancel', onPress: () => console.log('cancel')},
                                        {
                                            text: 'Ok', onPress: () => {
                                                let token = this.tokenInputRef.state.value.trim();
                                                let value = new BigNumber(this.valueInputRef.state.value).multipliedBy(1e18).toFixed(0);
                                                abi.withdraw(this.state.account.pk, this.state.account.mainPKr, token, value);
                                            }
                                        },
                                    ])
                                }}>提现</a></Flex.Item>
                                <Flex.Item><a onClick={() => {
                                    alert("", <div>
                                        <div>
                                            <InputItem
                                                placeholder="tokenA"
                                                ref={el => this.tokenAInputRef = el}>TOKENA:</InputItem>
                                            <InputItem
                                                placeholder="tokenB"
                                                ref={el => this.tokenBInputRef = el}>TOKENB:</InputItem>
                                            <InputItem
                                                placeholder="price"
                                                ref={el => this.priceInputRef = el}>TOKENB:</InputItem>
                                        </div>
                                    </div>, [
                                        {text: 'Cancel', onPress: () => console.log('cancel')},
                                        {
                                            text: 'Ok', onPress: () => {
                                                let tokenA = this.tokenAInputRef.state.value.trim();
                                                let tokenB = this.tokenBInputRef.state.value.trim();
                                                let price = new BigNumber(this.priceInputRef.state.value).multipliedBy(1e9).toFixed(0);
                                                abi.setPrice(this.state.account.pk, this.state.account.mainPKr, tokenA, tokenB, price);
                                            }
                                        },
                                    ])
                                }}>
                                    设置
                                </a></Flex.Item>
                            </Flex>
                        )

                    }}>
                        {balances}
                    </List>
                }
                <WhiteSpace/>
                <List renderHeader={() => {
                    return <Flex>
                        <Flex.Item>FROM</Flex.Item>
                        <Flex.Item></Flex.Item>
                        <Flex.Item>TO</Flex.Item>
                        <Flex.Item>
                            价格
                        </Flex.Item>
                        <Flex.Item></Flex.Item>
                    </Flex>
                }}>
                    {pairs}
                </List>
            </WingBlank>
        )
    }
}

export default App;
