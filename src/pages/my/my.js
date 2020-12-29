/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex } from 'antd-mobile';
import { Link } from 'react-router-dom';
import abi from '../../api/abi';
import Nav from '../../component/nav'
import logo from '../../images/logo.png';
import './my.css';

class My extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            isManager: false,
        }
    }
    componentDidMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        self.getIsManager(obj.mainPKr);
        self.setState({
            account: obj
        })
    }

    getIsManager(mainPKr) {
        let self = this;
        abi.hbankisManager(mainPKr, function (res) {
            self.setState({
                isManager: res
            })
        })
    }

    

    render() {
        let self = this;
        return (
            <Nav selectedTab="4">
                <div className="tabcontent">
                    <Flex className="header">
                        <Flex.Item className="tabcontent-box">
                            <img src={logo} alt="logo" />
                            <p className='title'>
                                个人中心
                            </p>
                        </Flex.Item>
                    </Flex>
                    <div className="content">
                        <div className="listItem">
                            <Flex>
                                <Flex.Item>
                                    <span className="assetstitle">联系客服</span>
                                </Flex.Item>
                            </Flex>
                        </div>
                        <Link to={{ pathname: `/register` }} >
                            <div className="listItem">
                                <Flex>
                                    <Flex.Item>
                                        <span className="assetstitle">注册KYC</span>
                                    </Flex.Item>
                                </Flex>
                            </div>
                        </Link>
                        {
                            self.state.isManager ? <div><Link to={{ pathname: `/withdrawlist` }} >
                                <div className="listItem">
                                    <Flex>
                                        <Flex.Item>
                                            <span className="assetstitle">提现审核列表</span>
                                        </Flex.Item>
                                    </Flex>
                                </div>
                            </Link>

                                <Link to={{ pathname: `/userlist` }} >
                                    <div className="listItem">
                                        <Flex>
                                            <Flex.Item>
                                                <span className="assetstitle">注册审核列表</span>
                                            </Flex.Item>
                                        </Flex>
                                    </div>
                                </Link>
                                <Link to={{ pathname: `/bank` }} >
                                    <div className="listItem">
                                        <Flex>
                                            <Flex.Item>
                                                <span className="assetstitle">兑换管理</span>
                                            </Flex.Item>
                                        </Flex>
                                    </div>
                                </Link>
                                <Link to={{ pathname: `/ratesetting` }} >
                                    <div className="listItem">
                                        <Flex>
                                            <Flex.Item>
                                                <span className="assetstitle">银行管理</span>
                                            </Flex.Item>
                                        </Flex>
                                    </div>
                                </Link>
                            </div> : <div></div>

                        }

                        <div className="listItem">
                            <Flex>
                                <Flex.Item>
                                    <span className="assetstitle">关于HANPYBANK</span>
                                </Flex.Item>
                            </Flex>
                        </div>

                    </div>
                </div>
            </Nav>
        )
    }
}

export default My;