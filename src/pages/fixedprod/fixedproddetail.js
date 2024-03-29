/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Pagination, InputItem, Toast, Modal } from 'antd-mobile';
import i18n from '../../i18n'
import abi from '../../api/abi';
import Nav from '../../component/nav'
import './fixedprod.css';
import BigNumber from 'bignumber.js';
const alert = Modal.alert;

class fixedprodDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            HbankisManager: false,
            isManager: false,
            Kycstate: false,
            list: [],
            indexList: [],
            day: 86400000,
            startIndex: 0,
            pageCount: 10,
            currentIndex: 1,
            totalApplication: 0,
            totalDrawable: 0,
            type:0
        }
    }
    componentDidMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        abi.fixedprodFinancing(obj.mainPKr);
        self.getList(obj.mainPKr, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', self.state.pageCount * self.state.currentIndex, "DECE");
        self.getAllList(obj.mainPKr, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', "DECE");
        
        self.setState({
            account: obj,
            type:this.props.location.state.type
        })
    }

    getList(mainPKr, _startIndex, _pageCount, cy) {
        let self = this;
        abi.fixedprodProdList(mainPKr, _startIndex, _pageCount, cy, function (res) {
            self.setState({
                startIndex: parseInt(res[0]),
                list: res[1],
                indexList: res[2],
            })
        })
    }

    getAllList(mainPKr, _startIndex, _pageCount, cy) {
        let self = this;
        abi.fixedprodProdList(mainPKr, _startIndex, _pageCount, cy, function (res) {
            let data = res[1];
            // console.log(data)
            let totalApplication = 0;
            data.map((item, index) => {
                totalApplication += parseFloat(new BigNumber(item[2]).dividedBy(10 ** 18).toFixed(3, 1));
                if (parseInt((Date.now() - (item[3] * 1000)) / self.state.day) > 30 && parseInt(item[4]) === 0) {
                    self.getTotal(parseFloat(new BigNumber(item[2]).dividedBy(10 ** 18).toFixed(3, 1)), parseInt((Date.now() - (item[3] * 1000)) / self.state.day));
                }
            })

            self.setState({
                totalApplication,
            })
        })
    }

    getTotal(total, nDay) {
        let self = this;
        abi.classGetClassRate(self.state.account.mainPKr, "DECE", nDay, function (res) {
            let num = 0;
            if (res[0] >> 15 > 0) {
                num = total + total * (res[0] & 0x7fff) / 10000;
            } else {
                num = total - total * (res[0] & 0x7fff) / 10000;
            }
            let totalDrawable = self.state.totalDrawable + num;
            self.setState({
                totalDrawable: totalDrawable
            })
        })
    }

    goToPage = (index) => {
        let self = this;
        let currentIndex = self.state.currentIndex + index;
        if (currentIndex > 0 && currentIndex <= Math.ceil(self.state.startIndex / self.state.pageCount)) {
            self.getList(self.state.account.mainPKr, self.state.startIndex - self.state.pageCount * (currentIndex - 1), self.state.startIndex - self.state.pageCount * (currentIndex - 1));
            self.setState({
                currentIndex
            })
        }
    }

    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n;
    }

    formatTime(number, format) {
        let time = new Date(number)
        let newArr = []
        let formatArr = ['Y', 'M', 'D'];
        // let formatArr = ['Y', 'M', 'D', 'h', 'm', 's'];
        newArr.push(time.getFullYear());
        newArr.push(this.formatNumber(time.getMonth() + 1));
        newArr.push(this.formatNumber(time.getDate()));
        // newArr.push(this.formatNumber(time.getHours()));
        // newArr.push(this.formatNumber(time.getMinutes()));
        // newArr.push(this.formatNumber(time.getSeconds()));
        for (let i in newArr) {
            format = format.replace(formatArr[i], newArr[i]);
        }
        return format;
    }

    render() {
        let self = this;
        return (
            <Nav selectedTab="3">
                <div className="tabcontent">
                    <div className="rate-detail">
                        {
                            this.state.type == 0 ?  <p>DECE Chain X HAPY 프로모션(20210908_DECE 1호)</p>:<p>DECE Chain X FPT 프로모션(20210908_DECE 2호)</p>
                        }
                    </div>

                    <div className="deposit">
                        <div className="deposit-text">
                            <div className="deposit-left"><p>{i18n.t("Totalapplication")}</p></div>
                            <div className="deposit-right"><p>{self.state.totalApplication}&nbsp;&nbsp;DECE</p></div>
                        </div>
                        <div className="deposit-text">
                            <div className="deposit-left"><p>{i18n.t("Totaldrawable")}</p></div>
                            <div className="deposit-right"><p>{self.state.totalDrawable.toFixed(3, 1)
                            }&nbsp;&nbsp;DECE</p></div>
                        </div>
                        <div className="deposit-btn" onClick={() => {
                             
                            alert(`${i18n.t("Depositguide")}`,<>
                                {
                                    this.state.type == 0 ? <ul className="Depositguide">
                                            <li><p>입금 안내현 입금 주소로는 DECE 기반 토큰만 입금 가능합니다.</p></li>
                                            <li><p>DECE 기반 HAPY 외 다른 디지털 자산 입금 시 복구가 불가할 수 있으니 주의해 주시기 바랍니다.</p></li>
                                            <li>
                                                <p>HAPY와 DECE의 교환비율은 최근 3개월 시세를 반영하여 </p>
                                                <p>1HAPY=0.0016666 DECE 입니다. 한번 교환하면 되돌릴 수 없으니 신중히 본인이 진행해 주시기 바랍니다.</p>
                                            </li>
                                            <li><p>컨트랙트 입금의 경우 입금에 지연이 발생할 수 있습니다.</p></li>
                                            <li><p>디지털 자산 명칭은 동일하나 전송 방식(네트워크)이 다른 경우에 입금 및 복구가 불가능 할 수 있습니다.</p></li>
                                    </ul>: <ul className="Depositguide">
                                        <li><p>현 입금 주소로는 DECE 기반 토큰만 입금 가능합니다.</p></li>
                                        <li><p>DECE 기반 FPT 외 다른 디지털 자산 입금 시 복구가 불가할 수 있으니 주의해 주시기 바랍니다.</p></li>
                                        <li>
                                            <p>FPT와 DECE의 교환비율은 최근 3개 월 시세를 반영하여 </p>
                                            <p>1FPT=0.0001666DECE 입니다. 한번 교환하면 되돌릴 수 없으니 신중히 본인이 진행해 주시기 바랍니다.</p>
                                        </li>
                                        <li><p>컨트랙트 입금의 경우 입금에 지연이 발생할 수 있습니다.</p></li>
                                        <li><p>디지털 자산 명칭은 동일하나 전송 방식(네트워크)이 다른 경우에 입금 및 복구가 불가능 할 수 있습니다.</p></li>
                                    </ul>
                                }
                            </>, [
                                { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                {
                                    text: `${i18n.t("confirm")}`, onPress: () => {
                                        alert(`${i18n.t("Deposit")}`, <div>
                                            <InputItem
                                                placeholder="amount"
                                                ref={el => self.sendInputRef = el}
                                            >{
                                                this.state.type == 0? "HAPY":"FPT"
                                            }:</InputItem>
                                        </div>, [
                                            { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                                            {
                                                text: `${i18n.t("confirm")}`, onPress: () => {
                                                    let value = new BigNumber(self.sendInputRef.state.value).multipliedBy(1e18);
                                                    let payToken;
                                                    if(this.state.type==0){
                                                        payToken="HAPY"
                                                    }else{
                                                        payToken="FPT"
                                                    }
                                                    abi.fixedprodFinancing(self.state.account.pk, self.state.account.mainPKr, value, "DECE", payToken, function (hash, err) {
                                                        if (err) {
                                                            Toast.fail(err);
                                                        } else {
                                                            abi.startGetTxReceipt(hash, function () {
                                                                self.getList(self.state.account.mainPKr, self.state.startIndex - self.state.pageCount * self.state.currentIndex, self.state.pageCount, "DECE");
                                                            });
                                                        }
                                                    });
                                                }
                                            },
                                        ])
                                    }
                                },
                            ])
                        }}>
                            <div>
                                <p>{i18n.t("Startdeposit")}<span>*</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="content">
                        <div className="fixedprodtitle">
                            <h2>{i18n.t("PeriodicInterestTable")}</h2>
                        </div>
                        <div className="InterestTable">
                            <div className="InterestTableitem">
                                <div>
                                    <p>Green</p>
                                    <p>0-1{i18n.t("Months")}</p>
                                </div>
                                <div>
                                    <p>Lock-up</p>
                                </div>
                            </div>
                            <div className="InterestTableitem">
                                <div>
                                    <p>Blue</p>
                                    <p>1-3{i18n.t("Months")}</p>
                                </div>
                                <div>
                                    <Interest nDay={90} />
                                </div>
                            </div>
                            <div className="InterestTableitem">
                                <div>
                                    <p>Red</p>
                                    <p>3-6{i18n.t("Months")}</p>
                                </div>
                                <div>
                                    <Interest nDay={180} />
                                </div>
                            </div>
                            <div className="InterestTableitem">
                                <div>
                                    <p>Black</p>
                                    <p>6-9{i18n.t("Months")}</p>
                                </div>
                                <div>
                                    <Interest nDay={270} />
                                </div>
                            </div>
                            <div className="InterestTableitem">
                                <div>
                                    <p>Sliver</p>
                                    <p>9-12{i18n.t("Months")}</p>
                                </div>
                                <div>
                                    <Interest nDay={360} />
                                </div>
                            </div>
                            <div className="InterestTableitem">
                                <div>
                                    <p>Gold</p>
                                    <p>12{i18n.t("Months")}-</p>
                                </div>
                                <div>
                                    <Interest nDay={361} />
                                </div>
                            </div>
                        </div>
                        <div className="fixedprodtitle">
                            <h2>{i18n.t("Applicationdetails")}</h2>
                        </div>
                    
                        <ul className="fixedprodList">
                            {
                                self.state.list.map((item, _index) => (<li>
                                    <div className="item">
                                        <div>{i18n.t("Applicationdate")}</div>
                                        <div>{self.formatTime(item[3] * 1000, 'Y.M.D')}</div>
                                    </div>
                                    <div className="item">
                                        <div>{i18n.t("Numberofapplications")}</div>
                                        <div>{new BigNumber(item[2]).dividedBy(10 ** 18).toFixed(6, 1)} DECE</div>
                                    </div>
                                    <div className="item">
                                        <div>Class</div>
                                        <div>{
                                            (Date.now() - (item[3] * 1000)) / self.state.day <= 30 ? <span>Green</span> : <span>
                                                {
                                                    (Date.now() - (item[3] * 1000)) / self.state.day <= 90 ? <span>Blue</span> : <span>
                                                        {
                                                            (Date.now() - (item[3] * 1000)) / self.state.day <= 180 ? <span>red</span> : <span>
                                                                {
                                                                    (Date.now() - (item[3] * 1000)) / self.state.day <= 270 ? <span>Black</span> : <span>
                                                                        {
                                                                            (Date.now() - (item[3] * 1000)) / self.state.day <= 360 ? <span>Sliver</span> : <span> Gold</span>
                                                                        }
                                                                    </span>
                                                                }
                                                            </span>
                                                        }
                                                    </span>
                                                }
                                            </span>
                                        }</div>
                                    </div>
                                    <div className="item">
                                        {parseFloat(new BigNumber(item[4]).dividedBy(10 ** 18).toFixed(6, 1)) == 0 ? <div>{i18n.t("Availablequantity")}</div> : <div>{i18n.t("Quantityfetched")}</div>}
                                        <div>
                                            <WithdrawComponet nDay={parseInt((Date.now() - (item[3] * 1000)) / self.state.day)} mainPKr={self.state.account.mainPKr} applicationNum={new BigNumber(item[2]).dividedBy(10 ** 18).toFixed(6, 1)} withDrawValue={parseFloat(new BigNumber(item[4]).dividedBy(10 ** 18).toFixed(6, 1))} />
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div>{i18n.t("status")}</div>
                                        <div><StateComponet index={self.state.indexList[_index]} nDay={parseInt((Date.now() - (item[3] * 1000)) / self.state.day)} withDrawValue={parseFloat(new BigNumber(item[4]).dividedBy(10 ** 18).toFixed(6, 1))} /></div>
                                    </div>
                                </li>))
                            }
                            <li style={{ padding: "10px 0" }}>
                                <Pagination
                                    total={Math.ceil(self.state.startIndex / self.state.pageCount)}
                                    className="custom-pagination-with-icon"
                                    current={self.state.startIndex === 0 ? 0 : self.state.currentIndex}
                                    locale={{
                                        prevText: (<span style={{ lineHeight: "28px", fontSize: "14px" }} onClick={() => this.goToPage(-1)}>{i18n.t("Prev")}</span>),
                                        nextText: (<span style={{ lineHeight: "28px", fontSize: "14px" }} onClick={() => this.goToPage(1)}>{i18n.t("Next")}</span>),
                                    }}
                                />
                            </li>
                        </ul>
                    </div>
                </div>
            </Nav>
        )
    }
}

export default fixedprodDetail;

class WithdrawComponet extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Availablequantity: 0,
        }
    }

    componentDidMount() {
        let self = this;
        self.getRate(self.props.nDay);
    }

    getRate(nDay) {
        let self = this;
        abi.classGetClassRate(self.props.mainPKr, "DECE", nDay, function (res) {
            // console.log(res, self.props.applicationNum);
            let num = 0;
            if(nDay > 30) {
                if (res[0] >> 15 > 0) {
                    num = parseFloat(self.props.applicationNum) + parseFloat(self.props.applicationNum) * (res[0] & 0x7fff) / 10000;
                    self.setState({
                        Availablequantity: parseFloat(num).toFixed(6, 1)
                    })
                } else {
                    num = parseFloat(self.props.applicationNum) - parseFloat(self.props.applicationNum) * (res[0] & 0x7fff) / 10000;
                    self.setState({
                        Availablequantity: parseFloat(num).toFixed(6, 1)
                    })
                }
            }
        })
    }

    render() {
        let self = this;
        return (<>{
            parseFloat(self.props.withDrawValue) == 0 ? <span>{self.state.Availablequantity}</span> : <span>{this.props.withDrawValue}</span>
        }</>)
    }
}

class StateComponet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {}
        }
    }

    componentDidMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        self.setState({
            account: obj
        })
    }

    withDraw() {
        let self = this;
        abi.fixedprodWithdraw(self.state.account.pk, self.state.account.mainPKr, self.props.index, function (hash, err) {
            if (err) {
                Toast.fail(err);
            } else {
                abi.startGetTxReceipt(hash, function () {
                    this.props.history.push("/fixedproddetail");
                });
            }
        });
    }

    render() {
        let self = this;
        return (<>
            {
                self.props.nDay <= 30 ? <span style={{ color: 'red' }}>Locked</span> : <span>
                    {
                         
                         parseFloat(self.props.withDrawValue) == 0 ? <span style={{ color: '#2196f3' }} onClick={() => { self.withDraw() }}>{i18n.t("Canwithdrawmoney")}</span> : <span style={{ color: "#333" }}>{i18n.t("Withdrawn")}</span>
                    }
                </span>
            }
        </>);
    }
}

class Interest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            symbol: "-",
            digital: 0
        }
    }

    componentDidMount() {
        let self = this;
        self.getRate(this.props.nDay);
    }

    getRate(nDay) {
        let self = this;
        abi.classGetClassRate(self.props.mainPKr, "DECE", nDay, function (res) {
            // console.log(res)
            if (res[0] >> 15 > 0) {
                self.setState({
                    symbol: "+",
                    digital: (res[0] & 0x7fff) / 100
                })
            } else {
                self.setState({
                    symbol: "-",
                    digital: ((res[0] & 0x7fff) / 100).toFixed(2, 1)
                })
            }
        })
    }

    render() {
        let self = this;
        return (<>
            <p>{self.state.symbol}{self.state.digital}%</p>
        </>);
    }
}