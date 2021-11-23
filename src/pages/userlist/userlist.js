/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, WhiteSpace, List, Checkbox, Button, Toast, Modal, TextareaItem, Tabs, Pagination, InputItem, Icon } from 'antd-mobile';
import Nav from '../../component/nav';
import i18n from '../../i18n'
import logo from '../../images/logo.png';
import './userlist.css';
import abi from '../../api/abi';
import { saveAs } from 'file-saver';
var FileSaver = require('file-saver');
const CheckboxItem = Checkbox.CheckboxItem;
const tabs2 = [
    { title: `${i18n.t("Auditlist")}`, sub: '1' },
    { title: `${i18n.t("userlist")}`, sub: '2' },
];

class Userlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            userlist: [],
            userlistitem: [],
            userlistitemState: true,
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
       
        self.getUsers(obj.mainPKr);
        self.getUserList(obj.mainPKr, 0, self.state.pageCount);
        
        self.setState({
            account: obj
        })
    }

    getUsers(mainPKr) {
        let self = this;
        abi.getRegisterList(mainPKr, function (res) {
            let arr = [];
            for (let i = 0; i < res.length; i++) {
                let codestr = res[i].info.code.substring(2, res[i].info.code.length);
                let obj = {}
                obj.i = i;
                obj.code = res[i].info.code;
                obj.email = res[i].info.email;
                obj.name = res[i].info.name;
                obj.phone = res[i].info.phone;
                obj.owner = res[i].owner;
                obj.imgurl = 'https://ginkgobank.dece.cash/images/' + codestr + '_0.png';
                obj.imgurlone = 'https://ginkgobank.dece.cash/images/' + codestr + '_1.png';
                obj.key = res[i].owner;
                obj.checked = false;
                arr.push(obj);
            }
            self.setState({
                userlist: arr
            })
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
        this.setState({
            datalist: arr
        })
    }

    getReview(whether) {
        let self = this;
        let keys = [];
        let arr = self.state.userlist;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].checked) {
                keys.push(arr[i].key)
            }
        }
        if (keys.length > 0) {
            abi.reviewUser(self.state.account.pk, self.state.account.mainPKr, keys, whether, function (hash, err) {
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

    getUser() {
        let self = this;
        abi.getUserInfo(self.MainPkrFocusInst.state.value, function (res) {
            let codestr = res[0].code.substring(2, res[0].code.length);
            self.setState({
                username: res[0].name,
                useremail: res[0].email,
                userphone: res[0].phone,
                userimgurl: 'https://ginkgobank.dece.cash/images/' + codestr + '_0.png',
                userimgurlone: 'https://ginkgobank.dece.cash/images/' + codestr + '_1.png',
                userstate: res[0].state,
                showmodal: true
            })
        })
    }

    getUserList = (mainPKr, pageIndex, pageCount) => {
        let self = this;

        
        abi.getUserInfoList(mainPKr, pageIndex, pageCount, function (res, len) {
            // var blob = new Blob([res], {type: "text/plain;charset=utf-8"});
            // FileSaver.saveAs(blob, "hello world.txt");

            if (len == 0) {//eslint-disable-line
                self.setState({
                    userlistitemState: false
                })
            }
            let pageNum = Math.ceil(len / self.state.pageCount) - 1;
            let arr = [];

            for (let i = 0; i < res.length; i++) {
                let codestr = res[i].info.code.substring(2, res[i].info.code.length);
                let obj = {}
                obj.i = i;
                obj.code = res[i].info.code;
                obj.email = res[i].info.email;
                obj.name = res[i].info.name;
                obj.phone = res[i].info.phone;
                obj.owner = res[i].owner;
                obj.imgurl = 'https://ginkgobank.dece.cash/images/' + codestr + '_0.png';
                obj.imgurlone = 'https://ginkgobank.dece.cash/images/' + codestr + '_1.png';
                obj.key = res[i].owner;
                if (res[i].info.state == "2") {//eslint-disable-line
                    arr.push(obj);
                }
            }
            self.setState({
                userlistitem: arr,
                len: pageNum,
                pageIndex: pageIndex,
            })
            Toast.hide();
        })
    }

    goToPage = (index) => {
        let self = this;
        let pageIndex = self.state.pageIndex + index;
        if (pageIndex >= 0 && pageIndex <= self.state.len) {
            Toast.loading("Loading...", 60);
            self.getUserList(self.state.account.mainPKr, pageIndex, self.state.pageCount);
        }
    }

    render() {
        let self = this;
        return (
            <Nav selectedTab="5">
                <div className="tabcontent">
                    <Flex className="header">
                        <Flex.Item className="tabcontent-box">
                            <img className="logo" src={logo} alt="logo" />
                            <p className='title'>
                                {i18n.t("RegistrationReview")}
                            </p>
                        </Flex.Item >
                    </Flex>
                    <WhiteSpace size="sm" />
                    <WhiteSpace size="sm" />
                    <div className="content">
                        <div>
                            <div className="mytabboxs">
                                <InputItem
                                    placeholder={i18n.t("WalletAddress")}
                                    ref={el => this.MainPkrFocusInst = el}
                                    clear
                                    extra={<div><Icon type="search" size='xs' /></div>}
                                    onExtraClick={() => self.getUser()}
                                ></InputItem>
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
                                        {
                                            self.state.userstate == 0 ? <div>{i18n.t("KYCisnotregistered")}</div> : <List className="mytabbox-item">
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
                                                <div className="IDcard IDimg">
                                                    <img src={self.state.userimgurl} />
                                                </div>
                                                <Flex>
                                                    <Flex.Item>{i18n.t("ReversesideofIDcard")}</Flex.Item>
                                                </Flex>
                                                <div className="IDcard IDimg">
                                                    <img src={self.state.userimgurlone} />
                                                </div>
                                                <WhiteSpace size="sm" />
                                            </List>
                                        }
                                    </div>
                                </Modal>
                                <WhiteSpace size="sm" />
                                <WhiteSpace size="sm" />
                                <Tabs tabs={tabs2}
                                    initialPage={0}
                                    animated={false}
                                    useOnPan={false}
                                    renderTab={tab => <span>{tab.title}</span>
                                    }
                                >
                                    <div style={{ alignItems: 'center', justifyContent: 'center', minHeight: '150px', backgroundColor: '#fff' }}>
                                        <List className="mytabbox-item listaddress">
                                            {self.state.userlist.map(item => (
                                                <CheckboxItem checked={item.checked} key={item.i} onChange={() => this.onChange(item.i)}>
                                                    <Flex>
                                                        <Flex.Item>{i18n.t("username")}：{item.name}</Flex.Item>
                                                    </Flex>
                                                    <Flex>
                                                        <Flex.Item>{i18n.t("phone")}：{item.phone}</Flex.Item>
                                                    </Flex>
                                                    <Flex>
                                                        <Flex.Item>{i18n.t("mail")}：{item.email}</Flex.Item>
                                                    </Flex>

                                                    <Flex>
                                                        <Flex.Item>
                                                            {i18n.t("WalletAddress")}：
                                                        </Flex.Item>
                                                    </Flex>
                                                    <TextareaItem
                                                        value={item.owner}
                                                        data-seed="logId"
                                                        editable={true}
                                                        disabled={true}
                                                        autoHeight
                                                    />

                                                    <Flex>

                                                        <Flex.Item>{i18n.t("FrontofIDcard")}
                                                        </Flex.Item>
                                                    </Flex>

                                                    <div className="IDcard IDimg">
                                                        <img src={item.imgurl} />
                                                    </div>
                                                    <Flex>
                                                        <Flex.Item>{i18n.t("ReversesideofIDcard")}
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
                                                        <Button type="primary" size='small' onClick={() => this.getReview(true)}>{i18n.t("Pass")}</Button>
                                                    </Flex.Item>
                                                    <Flex.Item>
                                                        <Button size='small' onClick={() => this.getReview(false)}>{i18n.t("Fail")}</Button>
                                                    </Flex.Item>
                                                </Flex>
                                            </div> : <div className="center">{i18n.t("NoAuditRecord")}</div>
                                        }
                                        <WhiteSpace size="sm" />
                                        <WhiteSpace size="sm" />
                                    </div>
                                    <div style={{ alignItems: 'center', justifyContent: 'center', minHeight: '150px', backgroundColor: '#fff' }}>
                                        {
                                            self.state.userlistitemState ? <div>
                                                {self.state.userlistitem.map(item => (
                                                    <List className="mytabbox-item">
                                                        <div key={item.i}>
                                                            <WhiteSpace size="sm" />
                                                            <WhiteSpace size="sm" />
                                                            <Flex>
                                                                <Flex.Item>{i18n.t("username")}：{item.name}</Flex.Item>
                                                            </Flex>
                                                            <WhiteSpace size="sm" />
                                                            <Flex>
                                                                <Flex.Item>{i18n.t("phone")}：{item.phone}</Flex.Item>
                                                            </Flex>
                                                            <WhiteSpace size="sm" />
                                                            <Flex>
                                                                <Flex.Item>{i18n.t("mail")}：{item.email}</Flex.Item>
                                                            </Flex>
                                                            <WhiteSpace size="sm" />
                                                            <Flex className="textover">
                                                                <Flex.Item>{i18n.t("WalletAddress")}：{item.owner}</Flex.Item>
                                                            </Flex>
                                                            <WhiteSpace size="sm" />
                                                            <Flex>
                                                                <Flex.Item>{i18n.t("FrontofIDcard")}
                                                                </Flex.Item>
                                                            </Flex>
                                                            <WhiteSpace size="sm" />
                                                            <div className="IDcard IDimg">
                                                                <img src={item.imgurl} />
                                                            </div>
                                                            <WhiteSpace size="sm" />
                                                            <Flex>
                                                                <Flex.Item>{i18n.t("ReversesideofIDcard")}
                                                                </Flex.Item>
                                                            </Flex>
                                                            <WhiteSpace size="sm" />
                                                            <div className="IDcard IDimg">
                                                                <img src={item.imgurlone} />
                                                            </div>
                                                            <WhiteSpace size="sm" />
                                                            <WhiteSpace size="sm" />
                                                        </div>
                                                    </List>
                                                ))}
                                                <WhiteSpace size="sm" />
                                                <WhiteSpace size="sm" />
                                                <Flex>
                                                    <Flex.Item>
                                                        <Pagination
                                                            total={self.state.len + 1}
                                                            className="custom-pagination-with-icon"
                                                            current={self.state.pageIndex + 1}
                                                            locale={{
                                                                prevText: (<Button type="primary" size='small' onClick={() => this.goToPage(-1)}>{i18n.t("Prev")}</Button>),
                                                                nextText: (<Button size='small' onClick={() => this.goToPage(1)}>{i18n.t("Next")}</Button>),
                                                            }}
                                                        />
                                                    </Flex.Item>
                                                    <WhiteSpace size="sm" />
                                                    <WhiteSpace size="sm" />
                                                </Flex>
                                            </div> : <div>{i18n.t("NoUserInformation")}</div>
                                        }
                                    </div>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                    <WhiteSpace size="sm" />
                    <WhiteSpace size="sm" />
                    <WhiteSpace size="sm" />
                </div>
            </Nav>
        )
    }
}
export default Userlist;