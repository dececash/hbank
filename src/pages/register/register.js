/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
// import { randomBytes } from "crypto";
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, List, Toast, InputItem, Button, WhiteSpace } from 'antd-mobile';
import Nav from '../../component/nav';
import i18n from '../../i18n'
import logo from '../../images/logo.png';
import './register.css';
import BigNumber from 'bignumber.js';

import abi from '../../api/abi';
import axios from 'axios'
import { bigNumberify } from 'serojs/js-sero-utils/utils';


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
            if (res[0].state == '0') {
                codestr = "idcard";
            } else {
                codestr = res[0].code.substring(2, res[0].code.length);
            }
            self.setState({
                name: res[0].name,
                phone: res[0].phone,
                email: res[0].email,
                imgurl: 'https://13.124.240.238/images/' + codestr + '_0.png',
                imgurlone: 'https://13.124.240.238/images/' + codestr + '_1.png',
                userState: res[0].state
            })
        })
    }

    handlePhoto = async (event, type) => {
        let self = this;
        const files = [...event.target.files];
        console.log(files[0])
        self.compressImage(files[0], function (img) {
            console.log(img)
            var formData = new FormData();
            formData.append("image", img);
            abi.hash(self.state.account.pk, function (code) {
                console.log(code)
                let urls = 'https://13.124.240.238/upload/?nomark=0&accessToken=000&id=' + type + '&code=' + code;
                axios({
                    method: 'post',
                    url: urls,
                    data: formData
                }).then((res) => {
                    Toast.success(`${i18n.t("UploadSuccessfully")}`, 2);
                    let str = 'https://13.124.240.238/images/' + code + '_' + type + '.png' + "?v=" + new Date().getTime();
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
        })
    }

    compressImage = (file, callback) => {
        let maxsize = Math.pow(1024, 2);
        let quality = 0;
        if (file.size < maxsize) {
            quality = 1;
        } else {
            quality = new BigNumber(maxsize).div(file.size).toFixed(1);
        }
        console.log(quality)
        var name = file.name;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            var src = e.target.result;
            var img = new Image();
            img.src = src;
            img.onload = function (e) {
                var w = img.width;
                var h = img.height;
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var anw = document.createAttribute("width");
                anw.nodeValue = w;
                var anh = document.createAttribute("height");
                anh.nodeValue = h;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h);
                var base64 = canvas.toDataURL('image/webp', quality); 
                var bytes = window.atob(base64.split(',')[1]);
                var ab = new ArrayBuffer(bytes.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < bytes.length; i++) {
                    ia[i] = bytes.charCodeAt(i);
                }
                file = new Blob([ab], { type: 'image/png' });
                file.name = name;
                callback(file);
            };

            img.onerror = function (e) {
                console.error(e)
            };
        };
        reader.onerror = function (e) {
            console.error(e)
        };
    };

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

    submit = () => {
        let self = this;
        if (self.state.name.length > 0 && self.state.phone.length > 0 && self.state.email.length > 0) {
            abi.hash(self.state.account.pk, function (code) {

                abi.register(self.state.account.pk, self.state.account.pk, self.state.name, self.state.phone, self.state.email, "0x" + code, function (hash, err) {
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
                                <Button size='small' type='primary' onClick={() => this.submit()}>{i18n.t("submit")}</Button>
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
