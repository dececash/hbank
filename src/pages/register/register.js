/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, List, Toast, InputItem, Button, WhiteSpace } from 'antd-mobile';
import Nav from '../../component/nav';
import i18n from '../../i18n'
import logo from '../../images/logo.png';
import './register.css';
import abi from '../../api/abi';
import axios from 'axios'
import { randomBytes } from "crypto";


class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            hasError: false,
            emailError: false,
            name: "",
            phone: "",
            email: "",
            userState: 0,
            submitLoading: false,
            file: '',
            imgurl: '',
            imgurlone: '',
            idstr: "",
            imgtype: "",
        }
        this.fileInputEl = React.createRef();
        this.fileInputEls = React.createRef();
    }

    componentWillMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        self.getUser(obj.mainPKr);
        console.log(obj);
        self.setState({
            account: obj
        })
    }

    getUser(mainPKr) {
        let self = this;
        abi.getUserInfo(mainPKr, function (res) {
            let codestr = "";
            let imgtype = "";
            if (res[0].state == '0') {
                codestr = "idcard";
                imgtype = ".png"
            } else {
                codestr = res[0].code.substring(2, 42);
                let j = self.hexCharCodeToStr(res[0].code).length - 1;
                while (self.hexCharCodeToStr(res[0].code)[j] !== '.') {
                    j--;
                }
                imgtype = self.hexCharCodeToStr(res[0].code).substring(j, self.hexCharCodeToStr(res[0].code).length);
            }
            self.setState({
                name: res[0].name,
                phone: res[0].phone,
                email: res[0].email,
                imgurl: 'https://13.124.240.238/images/' + codestr + '_0' + imgtype,
                imgurlone: 'https://13.124.240.238/images/' + codestr + '_1' + imgtype,
                userState: res[0].state
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
            curCharCode = parseInt(rawStr.substr(i, 2), 16);
            resultStr.push(String.fromCharCode(curCharCode));
        }
        return resultStr.join("");
    }
    handlePhoto = async (event, type) => {
        let self = this;
        const files = [...event.target.files];
        let i = files[0].name.length - 1;

        while (files[0].name[i] !== '.') {
            i--;
        }
        let imgtype = files[0].name.substring(i, files[0].name.length);
        let codestr = "";
        var formData = new FormData();
        formData.append("image", files[0]);
        abi.hash(self.state.account.pk, function (res) {
            codestr = res.substring(0, 40);
            self.setState({
                imgtype,
            })
            let urls = 'https://13.124.240.238/upload/?nomark=0&accessToken=000&id=' + type + '&code=' + codestr;
            axios({
                method: 'post',
                url: urls,
                data: formData
            }).then((res) => {
                Toast.success(`${i18n.t("UploadSuccessfully")}`, 2);
                let str = 'https://13.124.240.238/images/' + codestr + '_' + type + imgtype + "?v=" + new Date().getTime();
                if (type === 0) {
                    self.setState({
                        imgurl: str
                    })
                } else {
                    self.setState({
                        imgurlone: str
                    })
                }
                self.forceUpdate();
            }).catch((err) => {
                Toast.fail(`${i18n.t("ReselectPicture")}`, 2);
                console.log(err);
            })
        });
    }

    onErrorClick = () => {
        if (this.state.hasError) {
            Toast.info('Please enter 11 digits');
        }
    }
    onEmailErrorClick = () => {
        if (this.state.emailError) {
            Toast.info('Please enter e-mail');
        }
    }
    onChangesphone = (value) => {
        // if (value.replace(/^(00)?82\-?0[71](?:\d{8,9})$/, '').length < 11) {
        //     this.setState({
        //         hasError: true,
        //     });
        // } else {
        //     this.setState({
        //         hasError: false,
        //     });
        // }
        this.setState({
            phone: value
        });
    }
    onChangesname = (value) => {
        this.setState({
            name: value
        });
    }
    changeState = () => {
        this.setState({
            userState: 0
        })
        this.forceUpdate();

        console.log(this.state.userState)
    }
    onChangesemail = (value) => {
        // if (value.replace(/^(00)?82\-?0[71](?:\d{8,9})$/, '').length < 11) {
        //     this.setState({
        //         emailError: true,
        //     });
        // } else {
        //     this.setState({
        //         emailError: false,
        //     });
        // }
        this.setState({
            email: value
        });
    }

    submit = (imgtype) => {
        let self = this;
        if (self.state.name.length > 0 && self.state.phone.length > 0 && self.state.email.length > 0) {
            abi.hash(self.state.account.pk, function (code1) {
                let buf = randomBytes(12);
                buf.write(imgtype, 12 - imgtype.length);
                let code = "0x" + code1.substring(0, 40) + buf.toString('hex');
                console.log("code1", code);
                abi.register(self.state.account.pk, self.state.account.pk, self.state.name, self.state.phone, self.state.email, code, function (hash, err) {
                    if (err) {
                        Toast.fail(err);
                    } else {
                        abi.startGetTxReceipt(hash, function (data) {
                            self.getUser(self.state.account.mainPKr);
                        });
                    }
                })
            });
        };
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
                                {i18n.t("RegistrationMessage")}
                            </p>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace />
                    {
                        self.state.userState == '0' ? <div>
                            <div className="content">
                                <List renderHeader={() => `${i18n.t("RegistrationMessage")}`}>
                                    <InputItem
                                        type="text"
                                        placeholder="input your name"
                                        onChange={this.onChangesname}
                                        value={this.state.name}
                                    >{i18n.t("Name")}:</InputItem>
                                    <InputItem
                                        type="phone"
                                        placeholder="input your phone"
                                        // error={this.state.hasError}
                                        // onErrorClick={this.onErrorClick}
                                        onChange={this.onChangesphone}
                                        value={this.state.phone}
                                    >{i18n.t("PhoneNumber")}:</InputItem>
                                    <InputItem
                                        type="email"
                                        placeholder="input your e-mail"
                                        // error={this.state.emailError}
                                        // onErrorClick={this.onEmailErrorClick}
                                        onChange={this.onChangesemail}
                                        value={this.state.email}
                                    >{i18n.t("E-mail")}:</InputItem>
                                    <WhiteSpace />

                                    <Flex className="IDcard" >
                                        <Flex.Item className="center">
                                            {i18n.t("FrontofIDcard")}
                                        </Flex.Item>
                                        <Flex.Item className="center">
                                            <input
                                                type="file"
                                                ref={this.fileInputEl}
                                                accept="image/*"
                                                hidden
                                                onChange={(event) => this.handlePhoto(event, 0)}
                                            />
                                        </Flex.Item>
                                    </Flex>
                                    <WhiteSpace />

                                    <div className="IDcard IDimg">
                                        <img onClick={() => { this.fileInputEl.current.click() }} src={this.state.imgurl} />
                                    </div>
                                    <WhiteSpace />
                                    <Flex className="IDcard" >
                                        <Flex.Item className="center">
                                            {i18n.t("ReversesideofIDcard")}
                                        </Flex.Item>
                                        <Flex.Item className="center">
                                            <input
                                                type="file"
                                                ref={this.fileInputEls}
                                                accept="image/*"
                                                // accept=".jpg,.jpeg,.jpg"
                                                hidden
                                                onChange={(event) => this.handlePhoto(event, 1)}
                                            />
                                        </Flex.Item>
                                    </Flex>
                                    <WhiteSpace />
                                    <div className="IDcard IDimg">
                                        <img onClick={() => { this.fileInputEls.current.click() }} src={this.state.imgurlone} />
                                    </div>
                                    <WhiteSpace size="sm" />
                                </List>
                            </div>
                            <WhiteSpace size="sm" />
                            <div className="content">
                                <Button size='small' type='primary' onClick={() => this.submit(self.state.imgtype)}>{i18n.t("submit")}</Button>
                            </div>
                        </div> : <div>
                                {
                                    self.state.userState == '1' ? <div>
                                        <div className="content">
                                            <List renderHeader={() => `${i18n.t("RegistrationMessage")}`}>
                                                <InputItem
                                                    type="text"
                                                    disabled
                                                    value={this.state.name}
                                                >{i18n.t("Name")}:</InputItem>
                                                <InputItem
                                                    type="phone"
                                                    disabled
                                                    value={this.state.phone}
                                                >{i18n.t("PhoneNumber")}:</InputItem>
                                                <InputItem
                                                    type="email"
                                                    disabled
                                                    value={this.state.email}
                                                >{i18n.t("E-mail")}:</InputItem>
                                                <WhiteSpace />
                                                <Flex className="IDcard" >
                                                    <Flex.Item className="center">
                                                        {i18n.t("FrontofIDcard")}
                                                    </Flex.Item>
                                                </Flex>
                                                <WhiteSpace />

                                                <div className="IDcard IDimg">
                                                    <img src={this.state.imgurl} />
                                                </div>
                                                <WhiteSpace />
                                                <Flex className="IDcard" >
                                                    <Flex.Item className="center">
                                                        {i18n.t("ReversesideofIDcard")}
                                                    </Flex.Item>
                                                </Flex>
                                                <WhiteSpace />
                                                <div className="IDcard IDimg">
                                                    <img src={this.state.imgurlone} />
                                                </div>
                                                <WhiteSpace size="sm" />
                                            </List>
                                        </div>
                                        <WhiteSpace size="sm" />
                                        <div className="content">
                                            <Button size='small'>{i18n.t("UnderReview")}</Button>
                                        </div>
                                    </div> : <div>
                                            {
                                                self.state.userState == '2' ? <div>
                                                    <div className="content">
                                                        <List renderHeader={() => `${i18n.t("RegistrationMessage")}`}>
                                                            <InputItem
                                                                type="text"
                                                                disabled
                                                                value={this.state.name}
                                                            >{i18n.t("Name")}:</InputItem>
                                                            <InputItem
                                                                type="phone"
                                                                disabled
                                                                value={this.state.phone}
                                                            >{i18n.t("PhoneNumber")}:</InputItem>
                                                            <InputItem
                                                                type="email"
                                                                disabled
                                                                value={this.state.email}
                                                            >{i18n.t("E-mail")}:</InputItem>
                                                            <WhiteSpace />

                                                            <Flex className="IDcard" >
                                                                <Flex.Item className="center">
                                                                    {i18n.t("FrontofIDcard")}
                                                                </Flex.Item>
                                                            </Flex>
                                                            <WhiteSpace />

                                                            <div className="IDcard IDimg">
                                                                <img src={this.state.imgurl} />
                                                            </div>
                                                            <WhiteSpace />
                                                            <Flex className="IDcard" >
                                                                <Flex.Item className="center">
                                                                    {i18n.t("ReversesideofIDcard")}
                                                                </Flex.Item>
                                                            </Flex>
                                                            <WhiteSpace />
                                                            <div className="IDcard IDimg">
                                                                <img src={this.state.imgurlone} />
                                                            </div>
                                                            <WhiteSpace size="sm" />
                                                        </List>
                                                    </div>
                                                    <WhiteSpace size="sm" />
                                                </div> : <div>
                                                        <div className="content">
                                                            <List renderHeader={() => `${i18n.t("RegistrationMessage")}`}>
                                                                <InputItem
                                                                    type="text"
                                                                    value={this.state.name}
                                                                >{i18n.t("Name")}:</InputItem>
                                                                <InputItem
                                                                    type="phone"
                                                                    value={this.state.phone}
                                                                >{i18n.t("PhoneNumber")}:</InputItem>
                                                                <InputItem
                                                                    type="email"
                                                                    value={this.state.email}
                                                                >{i18n.t("E-mail")}:</InputItem>
                                                                <WhiteSpace />

                                                                <Flex className="IDcard" >
                                                                    <Flex.Item className="center">
                                                                        {i18n.t("FrontofIDcard")}
                                                                    </Flex.Item>
                                                                </Flex>
                                                                <WhiteSpace />

                                                                <div className="IDcard IDimg">
                                                                    <img src={this.state.imgurl} />
                                                                </div>
                                                                <WhiteSpace />
                                                                <Flex className="IDcard" >
                                                                    <Flex.Item className="center">
                                                                        {i18n.t("ReversesideofIDcard")}
                                                                    </Flex.Item>
                                                                </Flex>
                                                                <WhiteSpace />
                                                                <div className="IDcard IDimg">
                                                                    <img src={this.state.imgurlone} />
                                                                </div>
                                                                <WhiteSpace size="sm" />
                                                            </List>
                                                        </div>
                                                        <WhiteSpace size="sm" />
                                                        <div className="content">
                                                            <Flex>
                                                                <Flex.Item>
                                                                    <Button size='small' type='warning'>{i18n.t("RegistrationInformation")}</Button>
                                                                </Flex.Item>
                                                                <Flex.Item>
                                                                    <Button size='small' type='primary' onClick={() => this.changeState()}>{i18n.t("edit")}</Button>
                                                                </Flex.Item>
                                                            </Flex>
                                                        </div>
                                                    </div>
                                            }
                                        </div>
                                }
                            </div>
                    }
                    <WhiteSpace />
                    <WhiteSpace />
                    <WhiteSpace />
                </div>
            </Nav>
        )
    }
}

export default Register;
