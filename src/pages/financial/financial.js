/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
/*import { Link } from 'react-router-dom';*/

import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { Flex, Modal, Toast } from 'antd-mobile';
import './financial.css'
import Nav from '../../component/nav'
import i18n from '../../i18n';
import logo from '../../images/logo.png'
import worldshareblack from '../../images/worldshareblack.png'
import commodity from '../../images/commodity.png'
import pfid from '../../images/pfid.png'
import map from "../../images/map.png"
import bchain from "../../images/bchain.png"
import abi from '../../api/abi';

const alert = Modal.alert;

class Financial extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: {},
            IsWorldShare: true
        }
    }

    componentWillMount() {
        let self = this;
        let obj = JSON.parse(sessionStorage.getItem('account'));
        self.getUserInfo(obj.mainPKr);
        self.setState({
            account: obj
        })
    }
    getUserInfo = (mainPKr) => {
        let self = this;
        abi.getUserInfo(mainPKr, function (res) {
            if (res[0].state === "2") {
                self.setState({
                    IsWorldShare: true
                })
            } else {
                self.setState({
                    IsWorldShare: false
                })
            }
        })
    }
    goWorldShare(url) {
        let self = this;
        if (self.state.IsWorldShare) {
            this.props.history.push(url);
        } else {
            Toast.info(`${i18n.t("PleaseregisterKYCfirst")}!`)
        }
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
                <div className="content commodity">

                    <div className="financial" onClick={() => {
                        alert(`${i18n.t("Terms")}`, <div className="Terms">
                            <p className="Terms-title">제1조(목적) </p>
                            <p>이 약관은 GINKGO BANK와 고객 사이의 전자 디지털 거래에 관한 기본적인 사항을 정함으로써, 거래의 신속하고 효율적인 처리를 도모하고 거래당사자 상호간의 이해관계를 합리적으로 조정하는 것을 목적으로 합니다. 이 상품은 투자자의 합리적인 투자를 위한 상품을 제공하지만, 투자자의 투자 의사 결정은 전적으로 투자자 자신의 판단과 책임하에 이루어져야 하며, 당사는 이 상품에 의거하여 행해진 일체의 투자 행위 결과에 대하여 어떠한 책임도 지지 않습니다. </p>
                            <p>본 상품은 WORLDSHARE에서 패키지 및 아바타를 구매하는 방법 중 하나이며 WORLDSHARE의 요청과 지원으로 개설된 한정 상품으로 WORLDSHARE가 담보한 만큼 발행된 DHAPY의 수량이 모두 소진될 시 종료될 수 있습니다.</p>
                            <p className="Terms-title">제2조(이용시간)</p>
                            <p>1.이용자는 GINKGO BANK가 정한 시간 이내에서 전자 디지털 거래를 이용할 수 있습니다.</p>
                            <p>2.이용시간은 GINKGO BANK의 사정에 따라 달라질 수 있으며, GINKGO BANK가 이용시간을 변경하고자 할 경우에는 변경 1주일 전부터 1주일간 모바일 앱 및 인터넷 홈페이지를 통하여 게시합니다. 다만, 시스템 장애복구, 긴급한 프로그램 보수, 외부요인 등 불가피한 경우에는 예외로 합니다.</p>
                            <p className="Terms-title">제3조(수수료)</p>
                            <p>1.GINKGO BANK는 전자 디지털 수수료를 이용자의 계좌에서 출금하는 등의 방법으로 받을 수 있으며, 구체적인 수납 방법은 개별약관에 따릅니다. 단, 전자 디지털 수수료는 GINKGO BANK가 별도로 정하는 바에 따라 감면될 수 있습니다.</p>
                            <p>2.GINKGO BANK는 이용자가 확인할 수 있도록 이용자가 접근하기 용이한 전자적 장치를 통하여 수수료를 게시합니다. </p>
                            <p className="Terms-title">제4조(거래의 성립)</p>
                            <p>사용자가 WS 프로모션을 참여하고자 하는 경우에는 다음 각 호의 시기에 거래가 성립합니다.</p>
                            <p>1.KYC를 인증한 사용자가 입력한 거래지시의 내용을 GINKGO BANK가 확인하고 상품 제공자금(수수료를 포함)을 계좌원장에 기록한 때.</p>
                            <p>2.WS 프로모션 메뉴 안에서 투자 버튼을 통하여 WORLDSHARE에 접근하여 패키지를 구매 한 때.</p>
                            <p className="Terms-title">제5조(접근매체의 사용 등)</p>
                            <p>①회사는 전자 디지털 거래의 종류, 성격, 위험수준 등을 고려하여 안전한 인증방법을 사용하여야 한다.</p>
                            <p>②고객은 접근매체를 사용 및 관리함에 있어서 다른 법률에 특별한 규정이 없는 한 다음 각 호의 행위를 하여서는 아니 된다.</p>
                            <p>1.접근매체를 양도하거나 양수하는 행위.</p>
                            <p>2.대가를 수수, 요구 또는 약속하면서 접근매체를 대여받거나 대여하는 행위 또는 보관, 전달, 유통하는 행위.</p>
                            <p>3.범죄에 이용할 목적으로 또는 범죄에 이용될 것을 알면서 접근매체를 대여받거나 대여하는 행위 또는 보관, 전달, 유통하는 행위.</p>
                            <p>4.접근매체를 질권(채무자가 돈을 갚을 때까지 채권자가 담보물을 보유할 수 있고, 채무자가 돈을 갚지 않을 때는 그 담보물을 사용 또는 처분하여 우선적으로 빌려준 돈을 받을 수 있는 권리)의 목적으로 하는 행위.</p>
                            <p>5.제1호부터 제4호까지의 행위를 알선하는 행위.</p>
                            <p>③고객은 접근매체를 제3자에게 누설하여서는 아니 되며, 접근매체의 분실, 도용, 위조 또는 변조를 방지하기 위하여 충분한 주의를 기울여야 한다.</p>
                            <p className="Terms-title">제6조(신고사항의 변경 및 사고신고)</p>
                            <p>①고객이 주소(전자우편주소를 포함한다), 전화번호, 각종 비밀번호 등 회사에 신고한 사항을 변경하고자 하는 경우 개별약관에서 정하는 방법에 따라 회사에 신고하여야 한다.</p>
                            <p>②고객은 접근매체 등 전자 디지털 거래에 있어 비밀을 요하는 사항이 도난, 분실, 위조, 변조 또는 누설되었음을 알았을 때에는 지체 없이 이를 개별약관에서 정한 방법에 따라 회사에 신고하여야 한다.</p>
                            <p className="Terms-title">제7조(준수사항)</p>
                            <p>전자 디지털 거래의 안전한 수행을 위하여 이용자는 GINKGO BANK가 정하는 바에 따라 다음 각 호의 사항을 준수하여야 합니다.</p>
                            <p>1.비밀번호 유출 및 해킹 등 전자적 침해를 방지하기 위하여 필요한 조치 및 관리방법</p>
                            <p>2.이용자 보호를 위하여 GINKGO BANK가 제공하는 절차와 방법</p>
                            <p>3.기타 GINKGO BANK가 정하는 사항</p>
                            <p className="Terms-title">제8조(약관의 변경)</p>
                            <p>1.GINKGO BANK가 이 약관을 변경하고자 하는 경우에는 변경 1주일 전에 그 내용을 해당 전자 디지털 거래를 수행하는 전자적 장치(해당 전자적 장치에 게시하기 어려울 경우에는 이용자가 접근하기 용이한 전자적 장치)에 게시하고 이용자에게 통지하여야 합니다. 다만, 이용자가 이의를 제기할 경우 GINKGO BANK는 이용자에게 적절한 방법으로 약관 변경 내용을 통지하였음을 확인해 주어야 합니다.</p>
                            <p>2.제1항에도 불구하고 법령의 개정으로 인하여 긴급하게 약관을 변경한 때에는 변경된 약관을 전자적 장치에 최소 1주일 이상 게시하고 이용자에게 통지하여야 합니다.</p>
                            <p>3.GINKGO BANK가 제1항 및 제2항의 게시하거나 통지를 하는 경우에는 ＂이용자가 약관의 변경내용이 게시되거나 통지된 후부터 변경되는 약관의 시행일 전의 영업일까지 이내에 계약을 해지할 수 있으며, 약관의 변경내용에 이의를 제기하지 아니하는 경우 약관의 변경내용에 승인한 것으로 본다.” 라는 취지의 내용을 통지하여야 합니다.</p>
                            <p className="Terms-title">제9조(약관적용의 우선순위 등)</p>
                            <p>①전자 디지털거래에 관해서는 이 약관을 우선 적용하며, 이 약관에서 정하지 않은 사항은 개별약관 및 전자 디지털거래법 등 관계 법령이 정하는 바에 따른다.</p>
                            <p>②회사와 고객 간에 개별적으로 합의한 사항이 이 약관에서 정한 사항과 다를 때에는 그 합의사항을 이 약관에 우선하여 적용한다.</p>
                        </div>, [
                            { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                            {
                                text: `${i18n.t("agree")}`, onPress: () => {
                                    this.goWorldShare('/worldshare')
                                }
                            },
                        ])
                    }
                    }>
                        <div className="financial-box">
                            <div className="financial-header">
                                <p>WS프로모션 상품 (210127_WS 1호)</p>
                            </div>
                            <div className="financial-contet">
                                <img src={worldshareblack} />
                            </div>

                            <div className="financial-bottom">
                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>가입 대상 </p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>GINKGOBANK 프로모션 상품을통한WORLDSHARE패키지 구매자</p>
                                    </div>
                                </div>

                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>가입 기간</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>상품에 편성된 DHAPY소진시 까지</p>
                                    </div>
                                </div>

                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>상품 보상</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>패키지 구매에 30% 해당하는 DHAPY</p>
                                    </div>
                                </div>
                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>DHAPY 가격 </p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>초기 1000DKRW(변동, 전환수수료 5%)</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="financial" onClick={() => {
                        alert(``, <div className="Terms-center">
                            <p>상품이 소진되어 조기 마감되었습니다.</p>
                            <p>감사합니다.</p>
                        </div>, [
                            { text: `${i18n.t("confirm")}`, onPress: () => console.log('cancel'), style: { color: "#ffffff", background: "#fc752b" } },
                        ])
                    }
                    }>
                        <div className="financial-box">
                            <div className="financial-header">
                                <p>SUMONEY_IDV연금상품(210308_IDV 1호) </p>
                            </div>
                            <div className="financial-contet">
                                <img src={commodity} />
                            </div>

                            <div className="financial-bottom">
                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>가입 대상 </p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>GINKGOBANK KYC 완료 회원</p>
                                    </div>
                                </div>

                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>가입 기간</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>2021.03.09(화) ~ 2021.03.10(수)</p>
                                        <p>*상품 소진 시 조기 마감 가능</p>
                                    </div>
                                </div>

                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>개인 구매 한도</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p></p>
                                    </div>
                                </div>
                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p className="text">SOFT CAP</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>110,000DKRW(10,000IDV)</p>
                                    </div>
                                </div>
                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p className="text">HARD CAP</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>1,100,000DKRW(100,000IDV)</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="financial" onClick={() => {
                        alert(`${i18n.t("Terms")}`, <div className="Terms">
                            <p className="Terms-title">제1조(목적)</p>
                            <p>이 약관은 GINKGO BANK와 고객 사이의 전자 디지털 거래에 관한 기본적인 사항을 정함으로써, 거래의 신속하고 효율적인 처리를 도모하고 거래당사자 상호간의 이해관계를 합리적으로 조정하는 것을 목적으로 합니다. 이 상품은 투자자의 합리적인 투자를 위한 상품을 제공하지만, 투자자의 투자 의사 결정은 전적으로 투자자 자신의 판단과 책임하에 이루어져야 하며, 당사는 이 상품에 의거하여 행해진 일체의 투자 행위 결과에 대하여 어떠한 책임도 지지 않습니다. </p>
                            <p>PFID 토큰을 활용하여 참여 가능한 기간한정 상품으로 제공기간인 2년의 경과, 혹은 기타 부득이한 사정으로 사전 종료 될 수 있습니다.</p>
                            <p className="Terms-title">제2조(이용시간)</p>
                            <p>1.이용자는 GINKGO BANK가 정한 시간 이내에서 전자 디지털 거래를 이용할 수 있습니다.</p>
                            <p>2.이용시간은 GINKGO BANK의 사정에 따라 달라질 수 있으며, GINKGO BANK가 이용시간을 변경하고자 할 경우에는 변경 1주일 전부터 1주일간 모바일 앱 및 인터넷 홈페이지를 통하여 게시합니다. 다만, 시스템 장애복구, 긴급한 프로그램 보수, 외부요인 등 불가피한 경우에는 예외로 합니다.</p>
                            <p className="Terms-title">제3조(수수료)</p>
                            <p>1.GINKGO BANK는 전자 디지털 수수료를 이용자의 계좌에서 출금하는 등의 방법으로 받을 수 있으며, 구체적인 수납 방법은 개별약관에 따릅니다. 단, 전자 디지털 수수료는 GINKGO BANK가 별도로 정하는 바에 따라 감면될 수 있습니다.</p>
                            <p>2.GINKGO BANK는 이용자가 확인할 수 있도록 이용자가 접근하기 용이한 전자적 장치를 통하여 수수료를 게시합니다. </p>
                            <p className="Terms-title">제4조(거래의 성립)</p>
                            <p>사용자가 PFID연금상품을 참여하고자 하는 경우에는 다음 각 호의 시기에 거래가 성립합니다.</p>
                            <p>1.KYC를 인증한 사용자가 입력한 거래지시의 내용을 GINKGO BANK가 확인하고 상품 제공자금(수수료를 포함)을 계좌원장에 기록한 때 </p>
                            <p>2.GINKGOBANK App에 보유한 PFID자산을 PFID연금상품 메뉴 안의 예치 버튼을 통하여 제출 및 승인 하였을 때</p>
                            <p className="Terms-title">제5조(접근매체의 사용 등)</p>
                            <p>①회사는 전자 디지털 거래의 종류, 성격, 위험수준 등을 고려하여 안전한 인증방법을 사용하여야 한다.</p>
                            <p>②고객은 접근매체를 사용 및 관리함에 있어서 다른 법률에 특별한 규정이 없는 한 다음 각 호의 행위를 하여서는 아니 된다.</p>
                            <p>1.접근매체를 양도하거나 양수하는 행위</p>
                            <p>2.대가를 수수, 요구 또는 약속하면서 접근매체를 대여받거나 대여하는 행위 또는 보관, 전달, 유통하는 행위</p>
                            <p>3.범죄에 이용할 목적으로 또는 범죄에 이용될 것을 알면서 접근매체를 대여받거나 대여하는 행위 또는 보관, 전달, 유통하는 행위</p>
                            <p>4.접근매체를 질권(채무자가 돈을 갚을 때까지 채권자가 담보물을 보유할 수 있고, 채무자가 돈을 갚지 않을 때는 그 담보물을 사용 또는 처분하여 우선적으로 빌려준 돈을 받을 수 있는 권리)의 목적으로 하는 행위</p>
                            <p>5.제1호부터 제4호까지의 행위를 알선하는 행위</p>
                            <p>③고객은 접근매체를 제3자에게 누설하여서는 아니 되며, 접근매체의 분실, 도용, 위조 또는 변조를 방지하기 위하여 충분한 주의를 기울여야 한다.</p>
                            <p className="Terms-title">제6조(신고사항의 변경 및 사고신고)</p>
                            <p>①고객이 주소(전자우편주소를 포함한다), 전화번호, 각종 비밀번호 등 회사에 신고한 사항을 변경하고자 하는 경우 개별약관에서 정하는 방법에 따라 회사에 신고하여야 한다.</p>
                            <p>②고객은 접근매체 등 전자 디지털 거래에 있어 비밀을 요하는 사항이 도난, 분실, 위조, 변조 또는 누설되었음을 알았을 때에는 지체 없이 이를 개별약관에서 정한 방법에 따라 회사에 신고하여야 한다.</p>
                            <p className="Terms-title">제7조(준수사항)</p>
                            <p>전자 디지털 거래의 안전한 수행을 위하여 이용자는 GINKGO BANK가 정하는 바에 따라 다음 각 호의 사항을 준수하여야 합니다.</p>
                            <p>1.비밀번호 유출 및 해킹 등 전자적 침해를 방지하기 위하여 필요한 조치 및 관리방법</p>
                            <p>2.이용자 보호를 위하여 GINKGO BANK가 제공하는 절차와 방법</p>
                            <p>3.기타 GINKGO BANK가 정하는 사항</p>
                            <p className="Terms-title">제8조(약관의 변경)</p>
                            <p>1.GINKGO BANK가 이 약관을 변경하고자 하는 경우에는 변경 1주일 전에 그 내용을 해당 전자 디지털 거래를 수행하는 전자적 장치(해당 전자적 장치에 게시하기 어려울 경우에는 이용자가 접근하기 용이한 전자적 장치)에 게시하고 이용자에게 통지하여야 합니다. 다만, 이용자가 이의를 제기할 경우 GINKGO BANK는 이용자에게 적절한 방법으로 약관 변경 내용을 통지하였음을 확인해 주어야 합니다.</p>
                            <p>2.제1항에도 불구하고 법령의 개정으로 인하여 긴급하게 약관을 변경한 때에는 변경된 약관을 전자적 장치에 최소 1주일 이상 게시하고 이용자에게 통지하여야 합니다.</p>
                            <p>3.GINKGO BANK가 제1항 및 제2항의 게시하거나 통지를 하는 경우에는 ＂이용자가 약관의 변경내용이 게시되거나 통지된 후부터 변경되는 약관의 시행일 전의 영업일까지 이내에 계약을 해지할 수 있으며, 약관의 변경내용에 이의를 제기하지 아니하는 경우 약관의 변경내용에 승인한 것으로 본다.” 라는 취지의 내용을 통지하여야 합니다.</p>
                            <p className="Terms-title">제9조(약관적용의 우선순위 등)</p>
                            <p>①전자 디지털거래에 관해서는 이 약관을 우선 적용하며, 이 약관에서 정하지 않은 사항은 개별약관 및 전자 디지털거래법 등 관계 법령이 정하는 바에 따른다.</p>
                            <p>②회사와 고객 간에 개별적으로 합의한 사항이 이 약관에서 정한 사항과 다를 때에는 그 합의사항을 이 약관에 우선하여 적용한다.</p>
                        </div>, [
                            { text: `${i18n.t("cancel")}`, onPress: () => console.log('cancel') },
                            {
                                text: `${i18n.t("agree")}`, onPress: () => { }
                            },
                        ])
                    }
                    }
                    >
                        <div className="financial-box">
                            <div className="financial-header">
                                <p>SUMONEY_PFID연금상품(210330_PFID 1호) </p>
                            </div>
                            <div className="financial-contet">
                                <img src={pfid} />
                            </div>

                            <div className="financial-bottom">
                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>가입 대상 </p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>DECE기반PFID보유자</p>
                                    </div>
                                </div>

                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>가입 기간</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>상시</p>
                                    </div>
                                </div>

                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>참여/보상화폐</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>PFID(DECE Base)</p>
                                    </div>
                                </div>
                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>예치기간</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>3개월, 6개월, 9개월 中택1</p>
                                    </div>
                                </div>

                            </div>
                            <div className="financial-bottom" style={{ background: "#F7D6C7" }}>
                                <div className="financial-bottom-box1">
                                    <span style={{ color: "#EA572B", paddingTop: "10px", }}>*유의사항</span>
                                </div>
                            </div>
                            <div style={{ background: "#F7D6C7", fontSize: "12px" }}>
                                <div className="financial-bottom-box1" style={{ transform: "scale(0.8)" }}>
                                    <p style={{margin:"0px"}}>1)본 상품은 DECE기반 PFID로 참여가능하며, SERO 및 ETH기반 PFID는 월렛 입금 및 상품에 참여할 수 없습니다.</p>
                                    <p style={{margin:"0px"}}>2)상시 참여가능 상품으로 상품 서비스 제공기간은 최장 2년 입니다.</p>
                                    <p style={{margin:"0px"}}>3)연이율은 최대 기준으로,최초3개월, 6개월로 참여시이자율이공시와 다를 수 있습니다.</p>
                                    <p style={{margin:"0px"}}>4)중도해지 가능상품이며 중도해지시 이자는 발생하지않습니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="financial" onClick={() => {
                        alert(``, <div className="Terms-center">
                            <p>상품이 소진되어 조기 마감되었습니다.</p>
                            <p>감사합니다.</p>
                        </div>, [
                            { text: `${i18n.t("confirm")}`, onPress: () => console.log('cancel'), style: { color: "#ffffff", background: "#fc752b" } },
                        ])
                    }
                    }>
                        <div className="financial-box">
                            <div className="financial-header">
                                <p>SUMONEY_MAP연금상품(210407_MAP 1호) </p>
                            </div>
                            <div className="financial-contet">
                                <img src={map} />
                            </div>

                            <div className="financial-bottom">
                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>가입 대상 </p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>GINKGOBANK KYC 완료 회원</p>
                                    </div>
                                </div>

                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>가입 기간</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>2021.04.11(일) ~ 2021.04.16 (금)</p>
                                        <p>*상품 소진 시 조기 마감 가능</p>
                                    </div>
                                </div>

                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>개인 구매 한도</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p></p>
                                    </div>
                                </div>
                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p className="text">SOFT CAP</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>160,000DKRW  (1,000MAP)</p>
                                    </div>
                                </div>
                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p className="text">HARD CAP</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>1,600,000DKRW (10,000MAP)</p>
                                    </div>
                                </div>

                            </div>
                            <div className="financial-bottom" style={{ background: "#EEEDF0" }}>
                                <div className="financial-bottom-box1">
                                    <span style={{ color: "#EA572B", paddingTop: "10px", }}>*유의사항</span>
                                </div>
                                {/* <div className="financial-bottom-box">
                                    <span>1) 본 상품은 DKRW로 참여 가능한 기간 한정 연금상품 입니다.</span>
                                </div>*/}
                            </div>
                            <div style={{ background: "#EEEDF0", fontSize: "12px" }}>
                                <div className="financial-bottom-box1" style={{ transform: "scale(0.8)" }}>
                                    <p style={{margin:"0px"}}>1) 본 상품은 DKRW로 참여 가능한 기간 한정 연금상품 입니다.</p>
                                    <p style={{margin:"0px"}}>2) 계약기간 3개월 단기상품 입니다.</p>
                                    <p style={{margin:"0px"}}>3) Map 연금 상품은 수익을 보장하지 않으며 만기시점의 시장가격에 따라 원금 DKRW의 손실이 있을 수 있습니다. Map 프로젝트의 내용을 자세히 확인 후 본인의 판단에 따라 참여바랍니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="financial" onClick={() => {
                        alert(``, <div className="Terms-center">
                            <p>상품이 소진되어 조기 마감되었습니다.</p>
                            <p>감사합니다.</p>
                        </div>, [
                            { text: `${i18n.t("confirm")}`, onPress: () => console.log('cancel'), style: { color: "#ffffff", background: "#fc752b" } },
                        ])
                    }
                    }>
                        <div className="financial-box">
                            <div className="financial-header">
                                <p>뿌리깊은 나무 House Bchain VIP (1호) </p>
                            </div>
                            <div className="financial-contet">
                                <img src={bchain} />
                            </div>

                            <div className="financial-bottom">
                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>신청 대상</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>GINKGOBANK KYC 완료 회원</p>
                                    </div>
                                </div>

                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>신청 기간</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>2021.04.19(월)~2021.04.21 (수)</p>
                                    </div>
                                </div>

                                <div className="financial-bottom-box">
                                    <div className="financial-bottom-left">
                                        <p>개인 구매 한도</p>
                                    </div>
                                    <div className="financial-bottom-right">
                                        <p>Fix 1,050,000DKRW(3,000P-Unit)</p>
                                    </div>
                                </div>
                                <div className="financial-bottom-box">
                                    <p style={{ background: "#df673470" }}>*자세한 사항은 홍보물을 참조해주세요.</p>
                                </div>
                            </div>
                            <div className="financial-bottom" style={{ background: "#EEEDF0",paddind:"0px" }}>
                                <div className="financial-bottom-box1">
                                    <span style={{ color: "#EA572B", paddingTop: "10px", }}>*유의사항</span>
                                </div>
                            </div>
                            <div style={{ background: "#EEEDF0", fontSize: "12px" }}>
                                <div className="financial-bottom-box1" style={{ transform: "scale(0.8)" }}>
                                    <p style={{margin:"0px"}}>본 House BChain VIP는 무조건적인 수익을 보장하는 것은 아니기에 신청 후 책임은 개인에게 있습니다.</p>
                                    <p style={{margin:"0px"}}> House BChain VIP를 중간에 탈퇴할 시 환불이 불가하며 House BChain VIP 신청시 제출한 정보의 오기입, 개인의 부주의로 인하여 발생한 손실에 대해서 GINGKOBANKD(는 보상하지 않습니다. 향 후 법률 및 회사  의 사정으로 인하여 House BChain VIP 내용은 변동될 수 있습니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </Nav >
        )
    }
}

export default Financial;
