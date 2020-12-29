/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex } from 'antd-mobile';
import Nav from '../../component/nav'
import logo from '../../images/logo.png'

class Financial extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <Nav selectedTab="3">
                <div className="tabcontent">
                    <Flex className="header">
                        <Flex.Item className="tabcontent-box">
                            <img src={logo} alt="logo" />
                            <p className='title'>
                                DeFi数字资产理财
                            </p>
                        </Flex.Item>
                    </Flex>
                </div>
            </Nav>
        )
    }
}


export default Financial;