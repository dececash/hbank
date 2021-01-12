/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, WhiteSpace } from 'antd-mobile';
import { Link } from 'react-router-dom';
import i18n from '../../i18n'
import abi from '../../api/abi';
import Nav from '../../component/nav'
import logo from '../../images/logo.png';
import './my.css';

class My extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            HbankisManager: false,
            isManager: false,
            Kycstate: false
        }
    }
    componentDidMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        self.getHbankIsManager(obj.mainPKr);
        self.getIsManager(obj.mainPKr);
        self.getUser(obj.mainPKr);
        self.setState({
            account: obj
        })
    }

    getUser(mainPKr) {
        let self = this;
        abi.getUserInfo(mainPKr, function (res) {
            if (res[0].state === "2") {
                self.setState({
                    Kycstate: true
                })
            }
        })
    }

    getIsManager(mainPKr) {
        let self = this;
        abi.isOwner(mainPKr, function (res) {
            abi.isManager(mainPKr, function (data) {

                if (res || data) {
                    self.setState({
                        isManager: true
                    })
                }
            })
        })
    }

    getHbankIsManager(mainPKr) {
        let self = this;

        abi.hbankisOwner(mainPKr, function (res) {
            abi.hbankisManager(mainPKr, function (data) {
                if (res || data) {
                    self.setState({
                        HbankisManager: true
                    })
                }
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
                                {i18n.t("Personalcenter")}
                            </p>
                        </Flex.Item>
                    </Flex>
                    <div className="content">
                        <div className="listItem">
                            <Flex>
                                <Flex.Item>
                                    <span className="assetstitle">
                                        {i18n.t("CustomerService")}
                                    </span>
                                </Flex.Item>
                            </Flex>
                        </div>
                        {
                            self.state.Kycstate ? <Link to={{ pathname: `/register` }} >
                                <div className="listItem">
                                    <Flex>
                                        <Flex.Item>
                                            <span className="assetstitle">{i18n.t("View")}KYC</span>
                                        </Flex.Item>
                                    </Flex>
                                </div>
                            </Link> : <Link to={{ pathname: `/register` }} >
                                    <div className="listItem">
                                        <Flex>
                                            <Flex.Item>
                                                <span className="assetstitle">{i18n.t("register")}KYC</span>
                                            </Flex.Item>
                                        </Flex>
                                    </div>
                                </Link>
                        }
                        {
                            self.state.HbankisManager ? <div><Link to={{ pathname: `/withdrawlist` }} >
                                <div className="listItem">
                                    <Flex>
                                        <Flex.Item>
                                            <span className="assetstitle">{i18n.t("Withdrawalreviewlist")}</span>
                                        </Flex.Item>
                                    </Flex>
                                </div>
                            </Link>
                                <Link to={{ pathname: `/userlist` }} >
                                    <div className="listItem">
                                        <Flex>
                                            <Flex.Item>
                                                <span className="assetstitle">{i18n.t("Registrationauditlist")}</span>
                                            </Flex.Item>
                                        </Flex>
                                    </div>
                                </Link>

                                <Link to={{ pathname: `/ratesetting` }} >
                                    <div className="listItem">
                                        <Flex>
                                            <Flex.Item>
                                                <span className="assetstitle">{i18n.t("Bankmanagement")}</span>
                                            </Flex.Item>
                                        </Flex>
                                    </div>
                                </Link>
                            </div> : <div></div>
                        }
                        {
                            self.state.isManager ? <div> <Link to={{ pathname: `/bank` }} >
                                <div className="listItem">
                                    <Flex>
                                        <Flex.Item>
                                            <span className="assetstitle">{i18n.t("Exchangemanagement")}</span>
                                        </Flex.Item>
                                    </Flex>
                                </div>
                            </Link></div> : <div></div>
                        }
                        <div className="listItem">
                            <Flex>
                                <Flex.Item>
                                    <span className="assetstitle" onClick={() => {
                                        window.open("http://www.newsharekorea.com")
                                    }}>{i18n.t("about")}HAPYBANKEX</span>
                                </Flex.Item>
                            </Flex>
                        </div>
                        <WhiteSpace />
                    </div>
                </div>
            </Nav>
        )
    }
}

export default My;