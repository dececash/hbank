/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, ListView } from 'antd-mobile';
import Nav from '../../component/nav'
import './worldshare.css';
import abi from '../../api/abi';
import BigNumber from 'bignumber.js';
import i18n from '../../i18n';

function MyBody(props) {
    return (
        <div className="am-list-body my-body">
            <span style={{ display: 'none' }}>you can custom body wrap element</span>
            {props.children}
        </div>
    );
}
class Recommendlist extends Component {
    constructor(props) {
        super(props);
        const getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID][rowID];
        };

        const dataSource = new ListView.DataSource({
            getRowData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            dataSource,
            isLoading: true,
            height: document.documentElement.clientHeight * 3 / 4,
            account: {},
            datalist: [],
            pagestart: 1000000,
            pagecount: 10,
        }
    }
    onEndReached = (event) => {
        let self = this;
        if (self.state.isLoading && !self.state.hasMore) {
            return;
        }
        console.log(event)
        self.setState({ isLoading: true });
        self.queryUserRecommendRevenue(self.state.account.mainPKr, self.state.pagestart, self.state.pagecount + 10, function (res) {
            console.log(res)
            self.setState({
                dataSource: self.state.dataSource.cloneWithRows(res),
                isLoading: false,
                pagecount: self.state.pagecount + 10
            });
        });
        self.setState({ isLoading: true });
    }
    componentWillMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        self.queryUserRecommendRevenue(obj.mainPKr, self.state.pagestart, self.state.pagecount, function (res) {
            self.setState({
                dataSource: self.state.dataSource.cloneWithRows(res),
                isLoading: false,
                account: obj
            });
        });
    }

    queryUserRecommendRevenue(mainPKr, pagestart, pagecount, callback) {
        let self = this;
        let arr = [];
        abi.queryUserRecommendRevenue(mainPKr, pagestart, pagecount, function (res) {
            console.log(res);
            let list = res[0];
            for (let i = 0; i < list.length; i++) {
                let obj = {};
                obj.rewardAmount = new BigNumber(list[i].rewardAmount).dividedBy(10 ** 18).toFixed(2, 1);
                obj.rewardTime = self.formatTime(list[i].rewardTime * 1000, 'Y.M.D h:m');
                obj.refferCode = list[i].uname;
                arr.push(obj)
            }
            console.log(arr)
            callback(arr)
        })
    }

    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n;
    }

    formatTime(number, format) {
        let time = new Date(number)
        let newArr = [];
        let formatArr = ['Y', 'M', 'D', 'h', 'm', 's'];
        newArr.push(time.getFullYear());
        newArr.push(this.formatNumber(time.getMonth() + 1));
        newArr.push(this.formatNumber(time.getDate()));
        newArr.push(this.formatNumber(time.getHours()));
        newArr.push(this.formatNumber(time.getMinutes()));
        newArr.push(this.formatNumber(time.getSeconds()));
        for (let i in newArr) {
            format = format.replace(formatArr[i], newArr[i]);
        }
        return format;
    }

    render() {
        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#F5F5F9',
                    height: 8,
                    borderTop: '1px solid #ECECED',
                    borderBottom: '1px solid #ECECED',
                }}
            />
        );
        
        const row = (item, sectionID, rowID) => {
            return (
                <div key={rowID}>
                    <div>
                        <div style={{ lineHeight: 1 }}>
                            <Flex className="item">
                                <Flex.Item className="center">
                                    {item.rewardAmount}
                                </Flex.Item>
                                <Flex.Item className="center">
                                    {item.rewardTime}
                                </Flex.Item>
                                <Flex.Item className="center">
                                    {item.refferCode}
                                </Flex.Item>
                            </Flex>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <Nav selectedTab="3">
                <div className="tabcontent">
                    <Flex className="detailheader">
                        <Flex.Item className="headertitle">{this.state.cy}{i18n.t("Recommendedincome")}</Flex.Item>
                    </Flex>
                </div>
                <Flex className="item" style={{ marginBottom: "10px", position: "relative", top: '50px' }} >
                    <Flex.Item className="center">
                        <span>{i18n.t("Referralreward")}</span>
                    </Flex.Item>
                    <Flex.Item className="center">
                        <span>{i18n.t("Rewardtime")}</span>
                    </Flex.Item>
                    <Flex.Item className="center">
                        <span>{i18n.t("Registrationcode")}</span>
                    </Flex.Item>
                </Flex>
                <div className="detailcontent">
                    <div className="detailcontent-box">
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}
                            renderFooter={() => (<div style={{ paddingBottom: 25, textAlign: 'center' }}>
                                {this.state.isLoading ? `${i18n.t("Nomoredata")}` + '...' : `${i18n.t("Nomoredata")}`}
                            </div>)}
                            renderBodyComponent={() => <MyBody />}
                            renderRow={row}
                            renderSeparator={separator}
                            style={{
                                height: this.state.height,
                                overflow: 'auto',
                            }}
                            onScroll={() => { console.log('scroll'); }}
                            scrollRenderAheadDistance={10}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={10}
                        />
                    </div>
                </div>
            </Nav>
        )
    }
}

export default Recommendlist;
