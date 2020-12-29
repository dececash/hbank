/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, List, Toast, Checkbox, Button, WhiteSpace, Modal } from 'antd-mobile';
import BigNumber from 'bignumber.js';

import Nav from '../../component/nav';
import logo from '../../images/logo.png';
import './withdrawlist.css';
import abi from '../../api/abi';
// const alert = Modal.alert;
const CheckboxItem = Checkbox.CheckboxItem;

class Withdrawlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            datalist: [],
            showmodal: false,
            username: "",
            useremail: "",
            userphone: "",
            userimgurl: "",
            userimgurlone: "",
            userstate: "",
        }
    }

    componentWillMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        self.getData(obj.mainPKr);
        self.setState({
            account: obj
        })
    }

    getreview(whether) {
        let self = this;
        let keys = [];
        let arr = self.state.datalist;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].checked) {
                keys.push(arr[i].key)
            }
        }
        if (keys.length > 0) {
            abi.review(self.state.account.pk, self.state.account.mainPKr, keys, whether, function (hash, err) {
                console.log(hash, ">>>>>>>>", err);
                if (err) {
                    Toast.fail(err);
                } else {
                    abi.startGetTxReceipt(hash, function () {
                        self.getData(self.state.account.mainPKr);
                    });
                }
            });
        }
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

    getData(mainPKr) {
        let self = this;
        abi.getCheckList(mainPKr, function (res) {
            let arr = [];
            console.log(res, ">>>>>>>>>>>>>>>>>>>>>")
            for (let i = 0; i < res.length; i++) {
                let obj = {
                    i: 0,
                    currency: "",
                    owner: "",
                    time: "",
                    value: "",
                    key: "",
                    checked: ""
                }
                obj.i = i;
                obj.currency = res[i].currency;
                obj.owner = res[i].owner;
                obj.time = self.formatTime(res[i].time * 1000, 'Y.M.D h:m');
                obj.value = new BigNumber(res[i].value).dividedBy(10 ** 18).toString();
                obj.key = res[i].key;
                obj.checked = false;
                arr.push(obj);
            }
            self.setState({
                datalist: arr
            })
        })
    }

    onChange = (val) => {
        let self = this;
        let arr = self.state.datalist;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].i === val) {
                arr[i].checked = !arr[i].checked;
            }
        }
        this.setState({
            datalist: arr
        })
    }

    getUser(mainPKr) {
        let self = this;
        abi.getUserInfo(mainPKr, function (res) {
            let codestr = res[0].code.substring(2, 42);
            let j = self.hexCharCodeToStr(res[0].code).length - 1;
            while (self.hexCharCodeToStr(res[0].code)[j] !== '.') {
                j--;
            }
            let imgtype = self.hexCharCodeToStr(res[0].code).substring(j, self.hexCharCodeToStr(res[0].code).length);
            self.setState({
                username: res[0].name,
                useremail: res[0].email,
                userphone: res[0].phone,
                userimgurl: 'https://13.124.240.238/images/' + codestr + '_0' + imgtype,
                userimgurlone: 'https://13.124.240.238/images/' + codestr + '_1' + imgtype,
                userstate: "",
                showmodal: true
            })
        })
    }

    hexCharCodeToStr = (hexCharCodeStr) => {
        var trimedStr = hexCharCodeStr.trim();
        var rawStr =
            trimedStr.substr(0, 2).toLowerCase() === "0x"
                ?
                trimedStr.substr(2)
                :
                trimedStr;
        var len = rawStr.length;
        if (len % 2 !== 0) {
            return "";
        }
        var curCharCode;
        var resultStr = [];
        for (var i = 0; i < len; i = i + 2) {
            curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
            resultStr.push(String.fromCharCode(curCharCode));
        }
        return resultStr.join("");
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
                                提现审核
                            </p>
                        </Flex.Item>
                    </Flex>
                    <div className="content">
                        <div className="mytabbox">
                            <div className="mytabboxs">
                                <List className="mytabbox-item">
                                    {self.state.datalist.map(item => (
                                        <CheckboxItem checked={item.checked} key={item.i} onChange={() => this.onChange(item.i)}>
                                            <Flex>
                                                <Flex.Item>币名：{item.currency}</Flex.Item>
                                            </Flex>
                                            <Flex>
                                                <Flex.Item>金额：{item.value}</Flex.Item>
                                            </Flex>
                                            <Flex>
                                                <Flex.Item>时间：{item.time}</Flex.Item>
                                            </Flex>
                                            <Flex className="textover">
                                                <Flex.Item onClick={() => self.getUser(item.owner)}>钱包地址：{item.owner}</Flex.Item>
                                            </Flex>
                                            <WhiteSpace size="sm" />

                                        </CheckboxItem>
                                    ))}
                                </List>
                                <WhiteSpace size="sm" />
                                {
                                    self.state.datalist.length > 0 ? <div>
                                        <Flex>
                                            <Flex.Item>
                                                <Button type='primary' onClick={() => this.getreview(true)}>通过</Button>
                                            </Flex.Item>
                                            <Flex.Item>
                                                <Button onClick={() => this.getreview(false)}>不通过</Button>
                                            </Flex.Item>
                                        </Flex>
                                    </div> : <div className="center">没有审核记录</div>
                                }
                                <Modal
                                    visible={this.state.showmodal}
                                    transparent
                                    maskClosable={false}
                                    title="用户信息"
                                    footer={[{
                                        text: '关闭', onPress: () => {
                                            self.setState({
                                                showmodal: false
                                            })
                                        }
                                    }]}
                                >
                                    <div>
                                        <List className="mytabbox-item">
                                            <Flex>
                                                <Flex.Item>用户名：{self.state.username}</Flex.Item>
                                            </Flex>
                                            <Flex>
                                                <Flex.Item>电话：{self.state.userphone}</Flex.Item>
                                            </Flex>
                                            <Flex>
                                                <Flex.Item>邮箱：{self.state.useremail}</Flex.Item>
                                            </Flex>
                                            <Flex>
                                                <Flex.Item>省份证正面：</Flex.Item>
                                            </Flex>
                                            <div className="IDcard IDimg">
                                                <img src={self.state.userimgurl} />
                                            </div>
                                            <Flex>
                                                <Flex.Item>省份证反面</Flex.Item>
                                            </Flex>
                                            <div className="IDcard IDimg">
                                                <img src={self.state.userimgurlone} />
                                            </div>
                                            <WhiteSpace size="sm" />
                                        </List>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </div>
                    <WhiteSpace size="sm" />
                </div>
            </Nav>
        )
    }
}

export default Withdrawlist;