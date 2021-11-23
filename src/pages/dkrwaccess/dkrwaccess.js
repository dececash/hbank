/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'antd-mobile/dist/antd-mobile.css';
import { Button, Flex, Toast, WhiteSpace, InputItem, Modal } from 'antd-mobile';
import BigNumber from "bignumber.js";
import { RechareItem, WithDrawItem} from '../../component/dkrwAccessList';
import i18n from '../../i18n'
import abi from '../../api/abi';
import pgnode from '../../api/pgnode';
import Nav from '../../component/nav';
import logo from '../../images/logo.png';
import cardimg from '../../images/cardimg.png';
import copy from 'copy-text-to-clipboard';
import { bank as bankJson } from './hangBank.json';
import './dkrwaccess.css';
import { reject } from 'underscore';

const alert = Modal.alert;
 
export default class Dkrwaccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account:JSON.parse(sessionStorage.getItem('account')),
            hasKYC: false,
            registered:false,
            hasBound:false,
            showVAccount:false,
            loading:true,
        }
    }

    componentDidMount() {
        this.init();
    }

    init() {
        let self =this;
        let checkKyc = new Promise((resolve, reject)=>{
                self.checkKyc(function(ret) {
                    resolve(ret);
                });
        }); 
        let getUserInfo =  new Promise((resolve, reject)=>{
            self.getUserInfo(function(ret) {
                resolve(ret);
            });
        }); 

        Promise.all([checkKyc, getUserInfo]).then(function(values) {
            let states = {loading: false};
            let result = Object.assign(states, values[0],values[1]);
            self.setState(result);
          });
        
    }

    refresh(datas) {
        this.setState(datas);
    }
    
    checkKyc(callback) {
        let self = this;
        abi.getUserInfo(this.state.account.mainPKr, function (res) {
            if (res[0].state === "2") {
                callback({
                    hasKYC: true,
                })
            } else {
                callback({});
            }
        })
    }

    getUserInfo(callback) {
        let self = this;
        let mainPKr = this.state.account.mainPKr;
        pgnode.getUserInfo(mainPKr, function (vaccount) {
            if (vaccount) {
                abi.dkrwAccessAccountToAddrs(mainPKr, vaccount, function (shortAddress) {
                    abi.getFullAddress([shortAddress], function (rest) {
                        let pkr = rest.result[shortAddress];
                        if (mainPKr == pkr) {
                            callback({
                                hasBound: true,
                                registered: true,
                                vaccount: vaccount
                            })
                        } else {
                            callback({
                                registered: true,
                                vaccount: vaccount
                            });
                        }
                    });
                })
            } else {
                callback({});
            }
        });
    }

    render() {
        let self = this;
        let showInfo;
        if(self.state.loading) {
            Toast.loading('',1);
        } else {
            if(!self.state.hasKYC) {
                showInfo = <RegisterKYC/>;
            } else {
                if(self.state.registered && self.state.hasBound) {
                    if(this.state.showVAccount) {
                        showInfo = <BindAccount pk={self.state.account.pk} 
                            mainPKr={self.state.account.mainPKr} 
                            vaccount={this.state.vaccount}
                            hasBound={this.state.hasBound} callback={self.refresh.bind(this)}/>
                    } else {
                        showInfo = <UserInfo pk={self.state.account.pk} vaccount={this.state.vaccount} callback={self.refresh.bind(this)}/>;
                    }
                } else {
                    if(self.state.registered) {
                        showInfo = <BindAccount pk={self.state.account.pk} 
                            mainPKr={self.state.account.mainPKr} 
                            vaccount={this.state.vaccount}
                            hasBound={this.state.hasBound} callback={self.refresh.bind(this)}/>
                    } else {
                        showInfo = <PGRegister mainPKr={self.state.account.mainPKr} 
                                            callback={self.refresh.bind(this)}/>
                    }
                }
            }
        }
        

        return (
            <Nav selectedTab="4">
                <div className="tabcontent">
                {showInfo }
                </div>
            </Nav>
        )
    }
}

class RegisterKYC extends Component{
    render(){
        return(<>
                <Flex className="header">
                    <Flex.Item className="tabcontent-box">
                        <img className="logo" src={logo} alt="logo" />
                        <p className='title'>
                            {/* 存取款 */}
                            {/* {i18n.t("Depositandwithdrawalm")} */}
                        </p>
                    </Flex.Item>
                </Flex>
                <Flex>
                    <Flex.Item>
                       
                    </Flex.Item>
                    <Flex.Item>
                        <Link to={{ pathname: `/register` }} >
                            <p style={{textAlign:"center"}}>
                                {/* 请先注册KYC！ */}
                                <Button type="primary" size="small" >{i18n.t("PleaseregisterKYCfirst")}!</Button>
                            </p>
                        </Link>
                    </Flex.Item>
                    <Flex.Item>
                       
                    </Flex.Item>
                </Flex>
                <WhiteSpace />
        </>)
    }
}

class PGRegister extends Component{
    constructor(props){
        super(props);
        this.state={
            mainPKr : props.mainPKr,
            userName :"",
            userPhone : ""
        }
    }

    componentDidMount(){
        let self=this;
        abi.getUserInfo(this.state.mainPKr, function (res) {
            if (res[0].state === "2") {
                self.setState({
                    userName:res[0].name,
                    userPhone:res[0].phone
                })
            }
        })
    }

    register(){
        let self = this;
        let bankCard = "001";
        if(self.state.bankCard) {
            bankCard = self.state.bankCard;
        }
        if(self.bankCd.state.value=="" || self.identity.state.value==""){
            Toast.info('Please fill in the information ！', 2, null, false);
            return
        }

        let data={
            "name": self.state.userName,
            "pkr":self.state.mainPKr,
            "taxType": '개인',
            "identity": self.identity.state.value, 
            "phone": self.state.userPhone,
            "account":self.bankCd.state.value,
            "bankCd": bankCard,
            "beneficiary": self.state.userName
        };

        pgnode.register(data, function (err, res) {

            if (err) {
                Toast.fail(JSON.stringify(err));
            } else {
                self.props.callback({
                    vaccount: res.vaccnt.account,
                    registered: true
                });
            }
        });
    }

    render(){
        let self=this;
        return(<div  className="register-dkrw" style={{minHeight:document.documentElement.clientHeight}}>
                    {
                        self.state.isRegister ?<>
                        {
                            <div className="register-dkrw-box">
                            <div className="register-dkrw-header" style={{background:"#777777"}}>
                            </div>
                            <div className='user-register'>
                                <div className="user-name">
                                    <p>
                                        {/* 请输入开户人姓名与银行 */}
                                        {i18n.t("brigeNameandBank")}
                                    </p>
                                </div>
                                <div className="register-message">
                                    <div className="left">
                                        <p>
                                            <span>
                                                {/* 开户人 */}
                                                {i18n.t("Accountholder")}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="right">
                                        <p>{self.state.userName}</p>
                                    </div>
                                </div>
                                <div className="register-message">
                                    <div className="left">
                                        <p>
                                            <span>
                                                {/* 电话号码 */}
                                                {i18n.t("phonenumber")}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="right">
                                        <p>{self.state.userPhone}</p>
                                    </div>
                                </div>
                                <div className="register-message">
                                    <div className="left">
                                        <p>
                                            <span>
                                                {/* 身份证号码 */}
                                                {i18n.t("identificationnumber")}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="right">
                                        <InputItem 

                                            placeholder={`${i18n.t("brigeBindidentifidentif")}`}
                                            style={{border:"1px solid #000000",padding:"0px"}}
                                            ref={el => self.identity = el}
                                        />
                                    </div>
                                </div>
                                <div className="register-message">
                                    <div className="left">
                                        <select onChange={(e)=>{
                                            let tg =e.target;
                                            console.log(tg.options[tg.selectedIndex].value);
                                            self.setState({
                                                bankCard:tg.options[tg.selectedIndex].value
                                            })    
                                            }}>
                                            {
                                                bankJson.map((data,index)=>{
                                                   return <option value={data.value} key={index}>{data.name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="right">
                                        <InputItem 
                                            placeholder={`${i18n.t("Pleaseregisteryourbankaccount")}`}
                                            style={{border:"1px solid #000000",padding:"0px"}}
                                            ref={el => self.bankCd = el}
                                        />
                                    </div>
                                </div>
                                <div className="operation-register">
                                    <p>
                                       <span>
                                            <span className="operation-icon">*</span>
                                            <span className="operation-ok" onClick={()=>self.register()}>
                                                {/* 确认 */}
                                                {i18n.t("confirm")}
                                            </span>
                                       </span>
                                    </p>           
                                </div>
                            </div>
                        </div>
                        }</>:<div className="register-dkrw-box">
                            <div className="register-dkrw-header">
                                <p>
                                    {/* 登记提现账号 */}
                                    {i18n.t("brigeWithdrawAccount")}
                                </p>
                            </div>
                            <div className="register-dkrw-content">
                                <div className="content-header">
                                    <div className="left">
                                        <p onClick={()=>{self.setState({ isRegister:true })}}>
                                            {/* 登记 */}
                                            {i18n.t("Register")}
                                        </p>
                                    </div>
                                    <div className="right">
                                        <p>
                                            {/* 请登记你的银行账户 */}
                                            {i18n.t("Pleaseregisteryourbankaccount")}
                                        </p>
                                    </div>
                                </div>
                                <div className="content-center">
                                    <div className="card-icon">
                                        <p>*</p>
                                    </div>
                                    <div className="card-center">
                                        <p className="card-title">
                                            {/* 提现账号登记 */}
                                            {i18n.t("brigeWithdrawRegisterAccount")}
                                        </p>
                                        <p className="card-detail">
                                            {/* 请输入本人名义的银行账号 */}
                                            {i18n.t("brigeAccountNumber")}
                                        </p>
                                    </div>
                                    <div className="card-img">
                                        <img src={cardimg} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
        </div>)
    }
}

class BindAccount extends Component{
    constructor(props){
        super(props);
        this.state = {
            pk: props.pk,
            mainPKr: props.mainPKr,
            vaccount: props.vaccount,
            notBound: !props.hasBound,
        }
    }

    brigeRegisister() {
        let self = this;
        abi.brigeRegisister(self.state.pk, self.state.mainPKr, self.state.vaccount, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                    // self.props.callback({ showVAccount:false });
                    this.props.callback({showVAccount:false})
                });
            }
        })
    }

    render(){
        let self = this;
        // console.log(self.state.notBound,">>>>>>>>")
        return(<div className="bind">
                <div className= "bind-header">
                        <p>
                            DKRW 
                            {/* 存取款 */}
                            {i18n.t("Depositandwithdrawalm")}     
                        </p>                
                    </div>
                    <div className="bind-btn">
                        <p>
                            <span>
                                {/* 获取存款账号成功 */}
                                {i18n.t("brigeAccount")}
                            </span>
                        </p>
                    </div>
                    <div className="bind-describe">
                        <p className="bind-describe-success">
                            {/* 往WSBANK存款专用虚拟账号汇款 */}
                            {i18n.t("brigeWSBANK")}
                            <span>
                                {/* 可充值 */}
                                {i18n.t("Rechargeable")}
                            </span>
                            DKRW。
                        </p>
                    </div>
                    <div className="bind-account">
                        <p>
                            {/* 存款专用虚拟账号 */}
                            {i18n.t("brigeDedicated")}
                        </p>
                        <div className="bind-account-describe">
                            <div className="left">
                                <p>
                                    {/* {
                                        self.state.vaccount?.slice(0, 8) + "******" + self.state.vaccount?.slice(self.state.vaccount.length - 8)
                                    } */}
                                    {
                                        self.state.vaccount
                                    }
                                </p>
                            </div>
                            <div className="right">
                                <p>
                                    <span onClick={()=>{copy(self.state.vaccount);Toast.success("复制成功",1)}}>
                                        {/* 复制 */}
                                        {i18n.t("copy")}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bind-btn-confirm">
                        <p>
                            <span>
                                <span className="operation-icon">*</span>
                                {
                                    this.state.notBound ? <span className="operation-ok" onClick={()=>self.brigeRegisister()}>
                                        {/* 注册 */}
                                        {i18n.t("register")}
                                    </span>:<span onClick={()=>{this.props.callback({showVAccount:false})}}>
                                        {/* 关闭 */}
                                        {i18n.t("closure")}
                                    </span>
                                }
                           </span>
                        </p>  
                    </div>
        </div>)
    }
}

class UserInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            pk: props.pk,
            vaccount:props.vaccount,
            pageIndex:0,
            pageCount:2,
            withdrawList:[],
            rechargeList:[],
            showType:0
        }
    }

    prvePage() {
        if(this.state.pageIndex == 0) {
            return;
        }

        this.fetch(this.state.pageIndex - 1);
    }

    nextPage() {
        this.fetch(this.state.pageIndex + 1);
    }
    
    fetch(pageIndex) {
        let self = this;
        if (this.state.showType == 0) {
            pgnode.getRechargeList(this.state.vaccount, pageIndex, this.state.pageCount, function (list) {
                self.setState({
                    rechargeList: list,
                    pageIndex: pageIndex
                });
            });
        } else {
            abi.brigeWithDrawList(this.state.mainPKr, pageIndex, this.state.pageCount, this.state.mainPKr, function (list) {
                self.setState({
                    withdrawList: list,
                    pageIndex: pageIndex
                });
            });
        }
    }

    getLockedBalance(mainPKr) {
        if(!mainPKr) {
            mainPKr = this.state.mainPKr;
        }
        let self = this;
        abi.brigeLockedBalance(mainPKr, function (ret) {
            self.setState({
                lockdedBalance: ret[0],
            })
        });
    }

    componentDidMount() {
        let self = this;
        abi.accountDetails(this.state.pk, function (account) {
            self.setState({
                mainPKr: account.mainPKr,
                balance: account.balance,
            }, function () {
                self.getLockedBalance(account.mainPKr);
                self.fetch(this.state.pageIndex);
            });
        });
    }

    render() {
        let self =this;
        let showInfos;
        if(self.state.showType == 0) {
            showInfos = self.state.rechargeList.map((data,index) => (
                <RechareItem key={data.trxId} pk={self.state.pk} mainPKr={self.state.mainPKr}
                    isManager={false} item={data} />
            ))
        } else {
            showInfos = self.state.withdrawList.map((data,index) => (
                <WithDrawItem key={data.auditingId} pk={self.state.pk} mainPKr={self.state.mainPKr}
                isManager={false} item={data} /> 
            ))
        }
        
       return(<div className="dkrwaccess-index">
                <div className='generalization'>
                    <div className="generalization-item">
                        <div className="left">
                            {/* 总资产 */}
                            {i18n.t("Totalassets")}
                        </div>
                        <div className="right">
                            {
                                new BigNumber(self.state.balance).plus(new BigNumber(self.state.lockdedBalance)).div(10 ** 18).toNumber().toFixed(2, 1)
                            } DKRW
                        </div>
                    </div>
                    <div className="generalization-item">
                        <div className="left">
                            {/* 可提现金额 */}
                            {i18n.t("Availablecashamount")}
                        </div>
                        <div className="right">
                            { new BigNumber(self.state.balance).div(10 ** 18).toNumber().toFixed(2, 1)} DKRW
                        </div>
                    </div>
                    <div className="generalization-item">
                        <div className="left">
                            {/* 使用中的金额 */}
                            {i18n.t("Amountinuse")}
                        </div>
                        <div className="right">
                            { new BigNumber(self.state.lockdedBalance).div(10 ** 18).toNumber().toFixed(2, 1) } DKRW
                        </div>
                    </div>
                    <div className="generalization-btn">
                        <div className="left">
                            <Button size="small"   onClick={()=>{
                                self.props.callback({showVAccount:true});
                            }}>
                                {/* 存款 */}
                                {i18n.t("Deposit")}
                            </Button>
                        </div>
                        <div className="right">
                            <Button size="small" onClick={() => { alert(`${i18n.t("withdraw")}`, <div>
                                <InputItem placeholder="amount" ref={el => self.sendInputRef = el} 
                                onChange={(value) => { console.log(value); }} 
                                >DKRW</InputItem> 
                                </div>, [ 
                                    { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') }, 
                                    {
                                        text: `${i18n.t("confirm")}`, onPress: () => { 
                                        let value = new BigNumber(self.sendInputRef.state.value).multipliedBy(1e18);
                                        abi.dkrwAccessUserwithdraw(self.state.pk, self.state.mainPKr, "DKRW", value, function (hash, err) {
                                            if (err) {
                                                Toast.fail(err);
                                            } else {
                                                abi.startGetTxReceipt(hash, function () {
                                                    self.getLockedBalance();
                                                    self.fetch(self.state.pageIndex);
                                                });
                                            }
                                        });
                                        }
                                    },
                                ])
                            }}>
                                {/* 取款 */}
                                {i18n.t("Withdrawal")}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="dkrwaccess-title">
                    <div className="left">
                        <p>
                            <span>DKRW</span>
                            {/* 存取款明细 */}
                            {i18n.t("Depositdetails")}
                        </p>
                    </div>
                    <div className="right">
                        <select onChange={(e)=>{
                            self.setState({
                                pageIndex: 0,showType: e.target.options.selectedIndex
                            }, function() {
                                self.fetch(0);
                            });
                        }}>
                            <option value="0">
                                {/* 存款明细 */}
                                {i18n.t("Depositdetail")}
                            </option>
                            <option value="1">
                                {/* 提款明细 */}
                                {i18n.t("Withdrawaldetails")}
                            </option>
                        </select>
                    </div>
                </div>
                <div className="dkrwaccess-list">
                    <div className="dkrw-template">
                        <div className="dkrw-item">
                            <div className="content">
                                <div className="tab-item">
                                    <div className="dkrw-amount">
                                        <p>
                                            {/* 数量 */}
                                            {i18n.t("quantity")}
                                        </p>
                                    </div>
                                    <div className="dkrw-time">
                                        <p>
                                            {/* 时间 */}
                                            {i18n.t("time")}
                                        </p>
                                    </div>
                                    <div className="dkrw-state">
                                        <p>
                                            {/* 状态 */}
                                            {i18n.t("status")}
                                        </p>
                                    </div>
                                </div>
                                <div className="list">
                                    {showInfos} 
                                </div>
                                <div className="operation-item">
                                    <div className="left-icon">
                                        <p onClick={()=>{this.prvePage()}} > 
                                        {/* 上一页 */}
                                            {i18n.t("Prev")}
                                        </p>
                                    </div>
                                    <div className="operation-content">
                                    </div>
                                    <div className="right-icon">
                                        <p onClick={()=>{this.nextPage()}} >
                                            {/* 下一页 */}
                                            {i18n.t("Next")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
