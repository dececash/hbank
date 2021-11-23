/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, Card, WhiteSpace, Button, Toast } from 'antd-mobile';
import { Link } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import copy from 'copy-to-clipboard';
import Nav from '../../component/nav'
import './worldshare.css';
import i18n from '../../i18n';
import logo from '../../images/logo.png'
import profid from '../../images/profid.png'
import code from '../../images/code.png'
import copyimg from '../../images/copy.png'
import abi from '../../api/abi';

class Worldshare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            profit: {
                0: "0",
                1: "0",
                2: "0",
            },
            RecommendRevenueIndex: 1,
            InvestmentIndex: 1,
            pagecount: 10,
            InvestmentList: [],
            RecommendRevenueList: [],
            RefferList: {}
        }
    }

    componentWillMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        self.queryTotalRevenue(obj.mainPKr);
        self.getDkrwDetail(obj.mainPKr);
        self.setState({
            account: obj
        })
    }

    clockIn(pk, mainPKr) {
        let self = this;
        if (self.state.profit.TodayEarnings != "0.000") {
            abi.getUserInfo(mainPKr, function (res) {
                if (res[0].state === "2") {
                    abi.dailyTapIn(pk, mainPKr, function (hash) {
                        if (hash != "") {
                            abi.startGetTxReceipt(hash, function () {
                                self.queryTotalRevenue(self.state.account.mainPKr);
                            });
                        }
                    })
                } else {
                    Toast.info(`${i18n.t("PleaseregisterKYCfirst")}!`)
                }
            })
        } else {
            Toast.info(`${i18n.t("Nowithdrawableincome")}!`)
        }
    }

    queryTotalRevenue(mainPKr) {
        let self = this;
        abi.queryTotalRevenue(mainPKr, function (res) {
            let obj = {};
            obj.TotalRevenue = new BigNumber(res[0]).dividedBy(10 ** 18).toFixed(3, 1);
            obj.RecommendedIncome = new BigNumber(res[1]).dividedBy(10 ** 18).toFixed(3, 1);
            obj.TodayEarnings = new BigNumber(res[2]).dividedBy(10 ** 18).toFixed(3, 1);
            self.setState({
                profit: obj
            })
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

    getDkrwDetail = (mainPKr) => {
        let self = this;
        abi.dkrwDetail(mainPKr, function (res) {
            let obj = {}
            obj.idLeft = res[0][1];
            obj.idRight = res[0][2];
            obj.reffer = res[0][7];
            self.setState({
                RefferList: obj
            })
        })
    }

    copycode = (copytext) => {
        copy(copytext)
        Toast.info(`${i18n.t("CopySuccessfully")}!`)
    }

    render() {
        return (
            <Nav selectedTab="3">
                <div className="tabcontent">
                    <Flex className="header">
                        <Flex.Item className="tabcontent-box">
                            <img className="logo" src={logo} alt="logo" />
                            <p className='title'>
                                DeFi{i18n.t("assetmanagement")}
                            </p>
                        </Flex.Item>
                    </Flex>
                </div>
                <WhiteSpace size="lg" />
                <div className="content">
                    <div className="worldshare">
                        <Card>
                            <Card.Header
                                title={i18n.t("Contractinformation")}
                                thumb={code}
                                extra={
                                    <a style={{ color: 'black' }}
                                        href={`https://dece-cash.github.io/worldshare/?v=3&index=${this.state.account.index}`}
                                        // href={`https://ginkgobank.dece.cash/test/worldshare/?v=3&index=${this.state.account.index}`}
                                        // href={`http://localhost:3001/?v=3&index=${this.state.account.index}`}
                                        rel="noopener"
                                    >{i18n.t("investment")}</a>}
                            />
                            <Card.Body>
                                <div>
                                    <p>
                                        <span>ID   A :</span>
                                        <span>&nbsp;&nbsp;  {this.state.RefferList.idLeft}</span>
                                        {
                                            this.state.RefferList.idLeft == "" ? <img /> : <img className="copyimg" onClick={() => this.copycode(this.state.RefferList.idLeft)} src={copyimg} />
                                        }
                                    </p>
                                    <p>
                                        <span>ID   B :</span>
                                        <span>&nbsp;&nbsp;  {this.state.RefferList.idRight}</span>
                                        {
                                            this.state.RefferList.idRight == "" ? <img /> : <img className="copyimg" onClick={() => this.copycode(this.state.RefferList.idRight)} src={copyimg} />
                                        }
                                    </p>
                                    <p>
                                        <span>{i18n.t("Referrer")}  ID :</span>
                                        <span>&nbsp;&nbsp;  {this.state.RefferList.reffer}</span>
                                        {
                                            this.state.RefferList.reffer == "" ? <img /> : <img className="copyimg" onClick={() => this.copycode(this.state.RefferList.reffer)} src={copyimg} />
                                        }
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                        <WhiteSpace size="lg" />
                        <Card>
                            <Card.Header
                                title={i18n.t("Incomeinformation")}
                                thumb={profid}
                                extra={<div onClick={() => this.clockIn(this.state.account.pk, this.state.account.mainPKr)}>{i18n.t("Withdrawalincome")}</div>}
                            />
                            <Card.Body>
                                <div>
                                    <p>
                                        <span>{i18n.t("Totalstaticincome")}:</span>
                                        <span className="profitnum">{this.state.profit.TotalRevenue}</span>
                                    </p>
                                    <p>
                                        <span>{i18n.t("Staticincome")}:</span>
                                        <span className="profitnum">{this.state.profit.TodayEarnings}</span>
                                    </p>
                                    <p>
                                        <span>{i18n.t("Totalrecommendedrevenue")}:</span>
                                        <span className="profitnum">{this.state.profit.RecommendedIncome}</span>
                                    </p>
                                    <Flex>
                                        <Flex.Item>
                                            <Link to={{ pathname: `/investmentlist`, state: {} }} >
                                                <Button size="small" >
                                                    {i18n.t("Investmentlist")}
                                                </Button>
                                            </Link>
                                        </Flex.Item>
                                        <Flex.Item>
                                            <Link to={{ pathname: `/recommendlist`, state: {} }} >
                                                <Button size="small" >
                                                    {i18n.t("Recommendedincome")}
                                                </Button>
                                            </Link>
                                        </Flex.Item>
                                    </Flex>
                                </div>
                            </Card.Body>
                        </Card>
                        <WhiteSpace size="lg" />
                    </div>
                </div>
            </Nav>
        )
    }
}

export default Worldshare;
