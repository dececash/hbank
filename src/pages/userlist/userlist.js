/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, WhiteSpace, List, Checkbox, Button, Toast } from 'antd-mobile';
import Nav from '../../component/nav';
import logo from '../../images/logo.png';
import './userlist.css';
import abi from '../../api/abi';

const CheckboxItem = Checkbox.CheckboxItem;


class Userlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            userlist: [],
        }
    }

    componentWillMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        self.getUsers(obj.mainPKr);
        self.setState({
            account: obj
        })
    }

    getUsers(mainPKr) {
        let self = this;
        abi.getRegisterList(mainPKr, function (res) {
            let arr = [];
            for (let i = 0; i < res.length; i++) {
                console.log(res[i], ">>>>>>>>>")
                let codestr = res[i].info.code.substring(2, 42);
                console.log(res[i].info.code);
                console.log(codestr);
                let j = self.hexCharCodeToStr(res[i].info.code).length - 1;

                while (self.hexCharCodeToStr(res[i].info.code)[j] !== '.') {
                    j--;
                }
                let imgtype =self.hexCharCodeToStr(res[i].info.code).substring(j, self.hexCharCodeToStr(res[i].info.code).length);
                console.log(imgtype);
                let obj = {
                    i: 0,
                    code: "",
                    email: "",
                    name: "",
                    phone: "",
                    imgurl: "",
                    imgurlone: "",
                    checked: ""
                }
                obj.i = i;
                obj.code = res[i].info.code;
                obj.email = res[i].info.email;
                obj.name = res[i].info.name;
                obj.phone = res[i].info.phone;
                obj.owner = res[i].owner;
                obj.imgurl = 'https://13.124.240.238/images/' + codestr + '_0'+imgtype;
                obj.imgurlone = 'https://13.124.240.238/images/' + codestr + '_1'+imgtype;
                obj.key = res[i].owner;
                obj.checked = false;
                console.log(obj)
                arr.push(obj);
            }
            self.setState({
                userlist: arr
            })
            console.log(arr, "wan")
        })
    }

    onChange = (val) => {
        let self = this;
        let arr = self.state.userlist;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].i === val) {
                arr[i].checked = !arr[i].checked;
            }
        }
        console.log(arr, ">>>>>>>>>>")
        this.setState({
            datalist: arr
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

    getReview(whether) {
        let self = this;
        let keys = [];
        let arr = self.state.userlist;
        console.log(arr)
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].checked) {
                keys.push(arr[i].key)
            }
        }
        console.log(keys, whether)
        if (keys.length > 0) {
            abi.reviewUser(self.state.account.pk, self.state.account.mainPKr, keys, whether, function (hash, err) {
                console.log(hash, ">>>>>>>>", err);
                if (err) {
                    Toast.fail(err);
                } else {
                    abi.startGetTxReceipt(hash, function () {
                        self.getUsers(self.state.account.mainPKr);
                    });
                }
            });
        }
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
                                注册审核
                            </p>
                        </Flex.Item>
                    </Flex>
                    <div className="content">

                        <div className="mytabbox">
                            <div className="mytabboxs">
                                <List className="mytabbox-item">
                                    {self.state.userlist.map(item => (
                                        <CheckboxItem checked={item.checked} key={item.i} onChange={() => this.onChange(item.i)}>
                                            <Flex>
                                                <Flex.Item>用户名：{item.name}</Flex.Item>
                                            </Flex>
                                            <Flex>
                                                <Flex.Item>电话：{item.phone}</Flex.Item>
                                            </Flex>
                                            <Flex>
                                                <Flex.Item>邮箱：{item.email}</Flex.Item>
                                            </Flex>
                                            <Flex className="textover">
                                                <Flex.Item>钱包地址：{item.owner}</Flex.Item>
                                            </Flex>
                                            <Flex>
                                                <Flex.Item>省份证正面：
                                                    {/* {item.code} */}
                                                </Flex.Item>
                                            </Flex>
                                            <div className="IDcard IDimg">
                                                <img src={item.imgurl} />
                                            </div>
                                            <Flex>
                                                <Flex.Item>省份证反面
                                                    {/* ：{item.code} */}
                                                </Flex.Item>
                                            </Flex>
                                            <div className="IDcard IDimg">
                                                <img src={item.imgurlone} />
                                            </div>

                                            <WhiteSpace size="sm" />

                                        </CheckboxItem>
                                    ))}
                                </List>
                                <WhiteSpace size="sm" />
                                {
                                    self.state.userlist.length > 0 ? <div>
                                        <Flex>
                                            <Flex.Item>
                                                <Button type="primary" size='small' onClick={() => this.getReview(true)}>通过</Button>
                                            </Flex.Item>
                                            <Flex.Item>
                                                <Button size='small' onClick={() => this.getReview(false)}>不通过</Button>
                                            </Flex.Item>
                                        </Flex>
                                    </div> : <div className="center">没有审核记录</div>
                                }
                            </div>
                        </div>
                    </div>
                    <WhiteSpace size="sm" />
                </div>
            </Nav>
        )
    }
}

export default Userlist;