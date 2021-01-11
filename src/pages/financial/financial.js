/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, Button } from 'antd-mobile';
import Nav from '../../component/nav'
import BigNumber from 'bignumber.js'
import i18n from '../../i18n';
import logo from '../../images/logo.png'
import abi from '../../api/abi';

const Web3EthAbi = require('web3-eth-abi');
const bs58 = require('bs58')

class Financial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
        }
    }
    componentWillMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        self.setState({
            account: obj
        })
    }

    hbankFinancing = (financeAddr, tokenStr, value, useraddress, detail) => {
        let self = this;
        self.addressTranslation(financeAddr, function (financeAddrres) {
            abi.getShortAddress(useraddress, function (data) {
                let arr = [];
                arr[0] = data.result
                arr[1] = detail;
                let params = Web3EthAbi.encodeParameters(['address', 'string'], arr);
                abi.hbankFinancing(self.state.account.pk, self.state.account.mainPKr, financeAddrres, tokenStr, value, params, function (res) {
                    console.log(res)
                })
            })
        })
    }

    addressTranslation = (financeAddr, callback) => {
        let bytes = bs58.decode(financeAddr).toString('hex') + '0000000000000000000000000000000000000000000000000000000000000000';
        callback(bs58.encode(Buffer.from(bytes, 'hex')))
    }

    render() {
        return (
            <Nav selectedTab="3">
                <div className="tabcontent">
                    <Flex className="header">
                        <Flex.Item className="tabcontent-box">
                            <img src={logo} alt="logo" />
                            <p className='title'>
                                DeFi{i18n.t("assetmanagement")}
                            </p>
                        </Flex.Item>
                    </Flex>
                </div>
                <div className="content">
                    {/* <Button onClick={() => this.hbankFinancing('5ef4Wu3CgBjy5hNWv4qxRRbRs47NkP6ZXUB3D8whrbcxRLLmz77UsKYVbdyBjJasLXiG8HUKNocJorQVnmAd8p1K', 'DKRW', new BigNumber(12e21).toString(), this.state.account.mainPKr, 'iS6nMFMbwZY')}>测试</Button> */}
                </div>
            </Nav>
        )
    }
}

export default Financial;
