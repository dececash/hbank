/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { TabBar } from 'antd-mobile';


export default class nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullScreen: true,
        };
    }
    goPage = (uri) => {
        console.log(this.props)
        window.location.href = uri
    }

    renderContent(pageText) {
        return (
            <div >
                {this.props.children}
            </div>
        );
    }

    render() {
        return (
            <div style={{ minHeight: document.documentElement.clientHeight, maxHeight: document.documentElement.clientHeight }}>
                <TabBar
                    unselectedTintColor="#ffffff"
                    tintColor="#33A3F4"
                    barTintColor="#414691"
                >
                    <TabBar.Item
                        title="资产"
                        key="Life"
                        icon={<div style={{
                            width: '32px',
                            height: '32px',
                            background: 'url(https://13.124.240.238/images/test/assets.png) center center /  31px 31px no-repeat'
                        }}
                        />
                        }
                        selectedIcon={<div style={{
                            width: '32px',
                            height: '32px',
                            background: 'url(https://13.124.240.238/images/test/assetsed.png)center center /  31px 31px no-repeat'
                        }}
                        />
                        }
                        selected={this.props.selectedTab === '1'}
                        onPress={() => {
                            this.goPage("#/assets")
                        }}
                        data-seed="logId"
                    >
                        {this.renderContent('Life')}
                    </TabBar.Item>
                    <TabBar.Item
                        icon={
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: 'url(https://13.124.240.238/images/test/exchange.png) center center /  31px 31px no-repeat'
                            }}
                            />
                        }
                        selectedIcon={
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: 'url(https://13.124.240.238/images/test/exchangeed.png) center center /  31px 31px no-repeat'
                            }}
                            />
                        }
                        title="兑换"
                        key="Koubei"
                        selected={this.props.selectedTab === '2'}
                        onPress={() => {
                            this.goPage("#/home")
                        }}
                        data-seed="logId1"
                    >
                        {this.renderContent('Koubei')}
                    </TabBar.Item>
                    <TabBar.Item
                        icon={
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: 'url(https://13.124.240.238/images/test/financial.png) center center /  31px 31px no-repeat'
                            }}
                            />
                        }
                        selectedIcon={
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: 'url(https://13.124.240.238/images/test/financialed.png) center center /  31px 31px no-repeat'
                            }}
                            />
                        }
                        title="理财"
                        key="financial"
                        selected={this.props.selectedTab === '3'}
                        onPress={() => {
                            this.goPage("#/financial")
                        }}
                    >
                        {this.renderContent('financial')}
                    </TabBar.Item>

                    <TabBar.Item
                        icon={
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: 'url(https://13.124.240.238/images/test/my.png) center center /  31px 31px no-repeat'
                            }}
                            />
                        }
                        selectedIcon={
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: 'url(https://13.124.240.238/images/test/myed.png) center center /  31px 31px no-repeat'
                            }}
                            />
                        }
                        title="我的"
                        key="my"
                        selected={this.props.selectedTab === '4'}
                        onPress={() => {
                            this.goPage("#/my")
                        }}
                    >
                        {this.renderContent('My')}
                    </TabBar.Item>
                </TabBar>
            </div>
        );
    }
}