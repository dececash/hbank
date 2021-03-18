/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, List, Toast, Checkbox, Button, WhiteSpace, TextareaItem, Modal, Pagination, Tabs } from 'antd-mobile';
import BigNumber from 'bignumber.js';
import i18n from '../../i18n'
import Nav from '../../component/nav';
import logo from '../../images/logo.png';
import './withdrawlist.css';
import abi from '../../api/abi';
const CheckboxItem = Checkbox.CheckboxItem;
const tabs2 = [
    { title: `${i18n.t("Auditlist")}`, sub: '1' },
    { title: `${i18n.t("WithdrawalList")}`, sub: '2' },
];
class Withdrawlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            datalist: [],
            Withdrawlist: [],
            WithdrawlistState: true,
            pageIndex: 0,
            pageCount: 10,
            len: 0,
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
        self.getWithdrawList(obj.mainPKr, 0, self.state.pageCount)
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
            for (let i = 0; i < res.length; i++) {
                let obj = {}
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

    getWithdrawList(mainPKr, pageIndex, pageCount) {
        let self = this;
        abi.getWithdrawList(mainPKr, pageIndex, pageCount, function (res, len) {
            if (len == 0) {//eslint-disable-line
                self.setState({
                    WithdrawlistState: false
                })
            }
            let pageNum = Math.ceil(len / self.state.pageCount) - 1;
            let arr = [];
            for (let i = 0; i < res.length; i++) {
                let obj = {}
                obj.i = i;
                obj.currency = res[i].currency;
                obj.owner = res[i].owner;
                obj.time = self.formatTime(res[i].time * 1000, 'Y.M.D h:m');
                obj.status = res[i].status;
                obj.value = new BigNumber(res[i].value).dividedBy(10 ** 18).toString();
                obj.key = res[i].key;
                if (obj.status == "0") {//eslint-disable-line
                    arr.push(obj);
                }
            }

            self.setState({
                Withdrawlist: arr,
                len: pageNum,
                pageIndex: pageIndex,
            })
            Toast.hide()
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
        Toast.loading("Loading...", 5)
        abi.getUserInfo(mainPKr, function (res) {
            let codestr = res[0].code.substring(2, res[0].code.length);
            console.log(res, ">>>>>>")
            self.setState({
                username: res[0].name,
                useremail: res[0].email,
                userphone: res[0].phone,
                userimgurl: 'https://ginkgobank.dece.cash/images/' + codestr + '_0.png',
                userimgurlone: 'https://ginkgobank.dece.cash/images/' + codestr + '_1.png',
                userstate: "",
                showmodal: true
            })
        })
    }
    goToPage = (index) => {
        let self = this;
        let pageIndex = self.state.pageIndex + index;
        if (pageIndex >= 0 && pageIndex <= self.state.len) {
            Toast.loading("Loading...", 60)
            self.getWithdrawList(self.state.account.mainPKr, pageIndex, self.state.pageCount);
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
                            <p className='title'>
                                {i18n.t("WithdrawalReview")}
                            </p>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace size="sm" />
                    <WhiteSpace size="sm" />
                    <div className="content">
                        <div>
                            <div className="mytabboxs">
                                <WhiteSpace size="sm" />
                                <WhiteSpace size="sm" />
                                <Tabs tabs={tabs2}
                                    initialPage={0}
                                    animated={false}
                                    useOnPan={false}
                                    renderTab={tab => <span>{tab.title}</span>
                                    }
                                    onTabClick={console.log("111")}
                                >
                                    <div style={{ alignItems: 'center', justifyContent: 'center', minHeight: '150px', backgroundColor: '#fff' }}>
                                        <List className="mytabbox-item  listaddress">
                                            {self.state.datalist.map(item => (
                                                <CheckboxItem checked={item.checked} key={item.i} onChange={() => this.onChange(item.i)}>
                                                    <Flex>
                                                        <Flex.Item>{i18n.t("CoinName")}：{item.currency}</Flex.Item>
                                                    </Flex>
                                                    <Flex>
                                                        <Flex.Item>{i18n.t("Amount")}：{item.value}</Flex.Item>
                                                    </Flex>
                                                    <Flex>
                                                        <Flex.Item>{i18n.t("time")}：{item.time}</Flex.Item>
                                                    </Flex>
                                                    <Flex>
                                                        <Flex.Item>
                                                            {i18n.t("WalletAddress")}：
                                                        </Flex.Item>
                                                    </Flex>
                                                    <Flex>
                                                        <Flex.Item onClick={() => self.getUser(item.owner)}>
                                                            <TextareaItem
                                                                value={item.owner}
                                                                data-seed="logId"
                                                                editable={true}
                                                                disabled={true}
                                                                autoHeight
                                                            />
                                                        </Flex.Item>
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
                                                        <Button size='small' type='primary' onClick={() => this.getreview(true)}>{i18n.t("Pass")}</Button>
                                                    </Flex.Item>
                                                    <Flex.Item>
                                                        <Button size='small' onClick={() => this.getreview(false)}>{i18n.t("Fail")}</Button>
                                                    </Flex.Item>
                                                </Flex>
                                            </div> : <div className="center">{i18n.t("NoAuditRecord")}</div>
                                        }
                                        <WhiteSpace size="sm" />
                                        <WhiteSpace size="sm" />
                                        <WhiteSpace size="sm" />
                                    </div>


                                    <div style={{ alignItems: 'center', justifyContent: 'center', minHeight: '150px', backgroundColor: '#fff' }}>
                                        {self.state.Withdrawlist.map(item => (
                                            <List className="mytabbox-item">

                                                <div key={item.i} >
                                                    <WhiteSpace size="sm" />
                                                    <Flex>
                                                        <Flex.Item>{i18n.t("CoinName")}：{item.currency}</Flex.Item>
                                                    </Flex>
                                                    <WhiteSpace size="sm" />

                                                    <Flex>
                                                        <Flex.Item>{i18n.t("Amount")}：{item.value}</Flex.Item>
                                                    </Flex>
                                                    <WhiteSpace size="sm" />

                                                    <Flex>
                                                        <Flex.Item>{i18n.t("time")}：<span style={{ wordWrap: "break-word" }}>{item.time}</span></Flex.Item>
                                                    </Flex>
                                                    <WhiteSpace size="sm" />

                                                    <Flex>
                                                        <Flex.Item>{i18n.t("status")}：<span>{item.status == '0' ? <span>{i18n.t("passed")}</span> : <span>{i18n.t("notpass")}</span>}</span></Flex.Item>
                                                    </Flex>
                                                    <WhiteSpace size="sm" />

                                                    <Flex className="textover">
                                                        <Flex.Item onClick={() => self.getUser(item.owner)}>{i18n.t("WalletAddress")}：{item.owner}</Flex.Item>
                                                    </Flex>
                                                    <WhiteSpace size="sm" />
                                                </div>
                                            </List>
                                        ))}

                                        <WhiteSpace size="sm" />
                                        <Flex>
                                            <Pagination
                                                total={self.state.len + 1}
                                                className="custom-pagination-with-icon"
                                                current={self.state.pageIndex + 1}
                                                locale={{
                                                    prevText: (<Button type="primary" size='small' onClick={() => this.goToPage(-1)}>{i18n.t("Prev")}</Button>),
                                                    nextText: (<Button type="primary" size='small' onClick={() => this.goToPage(1)}>{i18n.t("Next")}</Button>),
                                                }}
                                            />
                                        </Flex>
                                        <WhiteSpace size="sm" />
                                        <WhiteSpace size="sm" />
                                    </div>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                    <WhiteSpace size="sm" />
                    <WhiteSpace size="sm" />
                    <WhiteSpace size="sm" />
                </div>

                <Modal
                    visible={this.state.showmodal}
                    transparent
                    maskClosable={false}
                    title={i18n.t("UserInfo")}
                    footer={[{
                        text: `${i18n.t("close")}`, onPress: () => {
                            self.setState({
                                showmodal: false
                            })
                        }
                    }]}
                >
                    <div>
                        <List className="mytabbox-item">
                            <Flex>
                                <Flex.Item>{i18n.t("username")}：{self.state.username}</Flex.Item>
                            </Flex>
                            <Flex>
                                <Flex.Item>{i18n.t("phone")}：{self.state.userphone}</Flex.Item>
                            </Flex>
                            <Flex>
                                <Flex.Item>{i18n.t("mail")}：{self.state.useremail}</Flex.Item>
                            </Flex>
                            <Flex>
                                <Flex.Item>{i18n.t("FrontofIDcard")}</Flex.Item>
                            </Flex>
                            <div className="IDcard IDimgs">
                                <img src={self.state.userimgurl} />
                            </div>
                            <Flex>
                                <Flex.Item>{i18n.t("ReversesideofIDcard")}</Flex.Item>
                            </Flex>
                            <div className="IDcard IDimgs">
                                <img src={self.state.userimgurlone} />
                            </div>
                            <WhiteSpace size="sm" />
                        </List>
                    </div>
                </Modal>
            </Nav>
        )
    }
}

export default Withdrawlist;