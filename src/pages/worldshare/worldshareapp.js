/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex } from 'antd-mobile';
import Nav from '../../component/nav'
import './worldshare.css';
import i18n from '../../i18n';
import logo from '../../images/logo.png'


class Worldshareapp extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentWillMount() {


    }

    render() {
        return (
            <Nav selectedTab="3">
                <div className="tabcontent">
                    <Flex className="header">
                        <Flex.Item className="tabcontent-box">
                            <img className="logo" src={logo} alt="logo" />
                            <p className='title'>
                                DeFi{i18n.t("assetmanagement")}
                            </p>
                        </Flex.Item>
                    </Flex>
                </div>
                <div>
                    
                </div>
            </Nav>
        )
    }
}

export default Worldshareapp;
