/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, Toast } from 'antd-mobile';
import { Link } from 'react-router-dom';
import i18n from '../../i18n'
import abi from '../../api/abi';
import Nav from '../../component/nav'
import logo from '../../images/logo.png';
import fixedprod from '../../images/fixedprod.png'
import './fixedprod.less';

class Material extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            isKYC: true
        }
    }

    componentWillMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));

        self.getUserInfo(obj.mainPKr);
        self.setState({
            account: obj
        })

    }
    getUserInfo = (mainPKr) => {
        let self = this;
        abi.getUserInfo(mainPKr, function (res) {
            if (res[0].state === "2") {
                self.setState({
                    isKYC: true
                })
            } else {
                self.setState({
                    isKYC: false
                })
            }
        })
    }
    goCommodity(url) {
        let self = this;
        if (self.state.isKYC) {
            this.props.history.push(url);
        } else {
            Toast.info(`${i18n.t("PleaseregisterKYCfirst")}!`)
        }
    }

    render() {
        let self = this;
        return (
            <Nav selectedTab="4">
                <div className="tabcontent">
                    <Flex className="header">
                        <Flex.Item className="tabcontent-box">
                            <img className="logo" src={logo} alt="logo" />
                            {/* <p className='title'>
                                {i18n.t("Personalcenter")}
                            </p> */}
                        </Flex.Item>
                    </Flex>
                    <div className="content">
                        <div className="financial">
                            <div className="financial-box">
                                <div className="financial-header">
                                    <p>생활이 되는 맞춤형 커스터디 (1호)</p>
                                </div>
                                <div className="fixedprod-contet">
                                    <Link to={{ pathname: `/home` }} >  <img src={fixedprod} /> </Link>
                                </div>
                                <div className="financial-mindle">
                                    <p>DECE Chain 커스터디 참여로</p>
                                    <p>코인도 받고, 이자도 받자!</p>
                                    <p className="financial-rate">연 20%</p>
                                    <p>DECE Chain 커스터디 참여로</p>
                                    <p>코인도 받고, 이자도 받자!</p>
                                    <p className="financial-date">2021.07.01-2021.07.10</p>
                                </div>
                                <div className="financial-info">
                                    <div onClick={() => { self.goCommodity("/fixedproddetail") }}>
                                        <p><span>*</span>DECE Chain Custody {i18n.t("Application")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Nav>
        )
    }
}

export default Material;