/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, ListView } from 'antd-mobile';
import BigNumber from 'bignumber.js'
import Nav from '../../component/nav'
import './assetsdetail.css'
import abi from '../../api/abi.js'

function MyBody(props) {
    return (
        <div className="am-list-body my-body">
            <span style={{ display: 'none' }}>you can custom body wrap element</span>
            {props.children}
        </div>
    );
}

class Assetsdetail extends Component {
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
            cy: "",
            account: {},
            datalist: [],
            len: 40000000,
            count: 10,
            profitday: 0
        }
    }

    onEndReached = (event) => {
        let self = this;
        if (self.state.isLoading && !self.state.hasMore) {
            return;
        }
        self.setState({ isLoading: true });
        self.getData(self.state.account.mainPKr, self.state.cy, self.state.len, self.state.count + 10, function (res, profitday) {
            self.setState({
                profitday: profitday,
                dataSource: self.state.dataSource.cloneWithRows(res),
                isLoading: false
            });
        });
    }

    componentWillMount() {
        let self = this;
        let cy = this.props.location.state.cy;
        let account = this.props.location.state.account;
        self.setState({
            cy: cy,
            account: account
        });
        self.getData(account.mainPKr, cy, self.state.len, self.state.count, function (res, profitday,isLoading) {
            self.setState({
                profitday: profitday,
                dataSource: self.state.dataSource.cloneWithRows(res),
                isLoading: isLoading
            });
        });
    }
    getData(mainPKr, cy, len, count, callback) {
        let self = this;
        let arr = [];
        abi.getRecords(mainPKr, cy, len, count, function (res) {
            console.log(res)
            if(res.len=="0"){
                callback([], 0,false)
            }else{
                for (let i = 0; i < res.list.length; i++) {
                    if (i >= 1) {
                        let obj = {
                            type: 0,
                            time: "",
                            value: "",
                            state: 0
                        }
                        obj.state = res.statusList[i];
                        obj.type = res.list[i].rType;
                        obj.time = self.formatTime(res.list[i].time * 1000, 'Y.M.D h:m');
                        obj.value = new BigNumber(res.list[i].value).dividedBy(10 ** 18).toFixed(2);
                        arr.push(obj);
                    }
                }
                callback(arr, new BigNumber(res.list[0].value).dividedBy(10 ** 18).toFixed(2),false)
            }
           
        })
    }

    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n;
    }

    formatTime(number, format) {
        let time = new Date(number)
        let newArr = []
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
                    <div >
                        <div style={{ lineHeight: 1 }}>
                            <Flex className="item">
                                <Flex.Item className="center">
                                    {
                                        item.type == 1 ? <span>充值</span> : <span>
                                            {
                                                item.type == 2 ? <span>
                                                    {
                                                        item.state == 1 ? <span>提现审核中</span> : <span> {
                                                            item.state == 2 ? <span>提现审核失败</span> : <span>提现</span>
                                                        }</span>
                                                    }
                                                </span> : <span>{
                                                    item.type == 3 ? <span>收益</span> : <span>{
                                                        item.type == 4 ? <span>卖出</span> : <span>买入</span>
                                                    }</span>
                                                }</span>
                                            }
                                        </span>
                                    }
                                </Flex.Item>
                                <Flex.Item className="center detailnum">
                                    {
                                        item.type == 1 || item.type == 3 || item.type == 5 ? <span>+</span> : <span>
                                            {
                                                item.state == 3 ? <span></span> : <span>-</span>
                                            }
                                        </span>
                                    }
                                    {item.value}
                                </Flex.Item>
                                <Flex.Item className="center">{item.time}</Flex.Item>
                            </Flex>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <Nav selectedTab="1">
                <div className="tabcontent">
                    <Flex className="detailheader">
                        <Flex.Item className="headertitle">{this.state.cy}余额明细</Flex.Item>
                    </Flex>
                    <Flex className="item" style={{ marginBottom: "10px", position: "relative", top: '50px' }} >
                        <Flex.Item className="center">
                            <span>今日预计收益</span>
                        </Flex.Item>
                        <Flex.Item className="center detailnum">
                            {this.state.profitday}
                        </Flex.Item>
                    </Flex>
                    <div className="detailcontent">

                        <div className="detailcontent-box">
                            <ListView
                                ref={el => this.lv = el}
                                dataSource={this.state.dataSource}
                                renderFooter={() => (<div style={{ paddingBottom: 25, textAlign: 'center' }}>
                                    {this.state.isLoading ? '加载更多...' : '没有数据了'}
                                </div>)}
                                renderBodyComponent={() => <MyBody />}
                                renderRow={row}
                                renderSeparator={separator}
                                style={{
                                    height: this.state.height,
                                    overflow: 'auto',
                                }}
                                onScroll={() => { console.log('scroll'); }}
                                scrollRenderAheadDistance={400}
                                onEndReached={this.onEndReached}
                                onEndReachedThreshold={10}
                            />
                        </div>
                    </div>
                </div>
            </Nav>
        )
    }
}

export default Assetsdetail;