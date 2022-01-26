// SPDX-License-Identifier: GPL-3.0 pragma solidity >=0.4.16 <0.7.0;
pragma solidity 0.6.10;
pragma experimental ABIEncoderV2;


import "./strings.sol";
import "./math.sol";

contract Ownable {
    address public owner;
    address public manager;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() public {
        owner = msg.sender;
        manager = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyManager() {
        require(msg.sender == owner || msg.sender == manager);
        _;
    }

    function setManager(address _manager) public onlyOwner {
        manager = _manager;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract BaseInterface {

    bytes32 private topic_currency = 0x7c98e64bd943448b4e24ef8c2cdec7b8b1275970cfe10daf2a9bfa4b04dce905;
    bytes32 private topic_setCallValues = 0xa6cafc6282f61eff9032603a017e652f68410d3d3c69f0a3eeca8f181aec1d17;
    bytes32 private topic_sero_send = 0x868bd6629e7c2e3d2ccf7b9968fad79b448e7a2bfb3ee20ed1acbc695c3c8b23;
    
    function msg_currency() internal returns (string memory) {
        bytes memory tmp = new bytes(32);
        bytes32 b32;
        assembly {
            log1(tmp, 0x20, sload(topic_currency_slot))
            b32 := mload(tmp)
        }
        return strings._bytes32ToStr(b32);
    }

    function setCallValues(string memory _currency, uint256 _amount, string memory _category, bytes32 _ticket) internal {
        bytes memory temp = new bytes(0x80);
        assembly {
            mstore(temp, _currency)
            mstore(add(temp, 0x20), _amount)
            mstore(add(temp, 0x40), _category)
            mstore(add(temp, 0x60), _ticket)
            log1(temp, 0x80, sload(topic_setCallValues_slot))
        }
        return;
    }
    

    function send_token(address _receiver, string memory _currency, uint256 _amount)internal returns (bool success){
        return sero_send(_receiver,_currency,_amount,"",0);
    }

  
    function sero_send(address _receiver, string memory _currency, uint256 _amount, string memory _category, bytes32 _ticket)internal returns (bool success){
        bytes memory temp = new bytes(160);
        assembly {
            mstore(temp, _receiver)
            mstore(add(temp, 0x20), _currency)
            mstore(add(temp, 0x40), _amount)
            mstore(add(temp, 0x60), _category)
            mstore(add(temp, 0x80), _ticket)
            log1(temp, 0xa0, sload(topic_sero_send_slot))
            success := mload(add(temp, 0x80))
        }
    }
}

interface BaseInfo {
    function hasSet(address addr) external view returns(bool);
    function getRefers(address addr) external view returns(address[] memory rets);
    function set(address[] memory addrs) external;
}

interface Dkrw {
    
    function agent(string memory refferCode, address addr) external payable;
    function encode(uint64 number ) external view returns (string memory);
    function decode(string memory code) external view returns (uint64);
    function idsMap(address addr) external view returns(uint256);
    
}

interface HBank {
    function recharge(bytes memory data) external payable;
}

interface HSwap {
    function exchange(string memory token) external payable returns (uint256 value) ;
    function getPrice(string memory tokenA, string memory tokenB ) external view returns (uint256, uint256);

    
}


contract DkrwDelegate is BaseInterface, Ownable {
    using SafeMath for uint256;
    Dkrw dkrw;
    
    BaseInfo baseInfo;
    
    HBank hBank;
    
    HSwap hSwap;

    // create user address
    address public contractOwner;

    mapping(address => UserTapInRecords) public tapInRecordsMapping;

    mapping(address => Investment[]) public userInvestmentsMapping;

    mapping(address => InvestmentTotalRevenue) public userTotalRevenueMapping;

    mapping(address => RecommendReward[]) public userRecommendRewardListMapping;

    constructor(address _dkrw, address _baseInfo, address _hbank, address _hSwap) public {
        dkrw = Dkrw(_dkrw);
        baseInfo = BaseInfo(_baseInfo);
        hBank = HBank(_hbank);
        hSwap = HSwap(_hSwap);
    }
    
    
    string INVESTMENT_CURRENCY = "DKRW";
    
    string REWARD_CURRENCY = "DHAPY";
    
    uint REWARD_SPLIT = 344;  // 344
    
    uint REWARD_PERCENT = 30;

    uint DAY_SECS = 60*60*24;  // 60*60*24; 
    
    struct Investment {
        
        uint256 investmentTime;
        uint256 investmentAmount;
        
    }

    struct RecommendReward {
        uint256 rewardTime;
        uint256 rewardAmount;
        
        string uname;
    }

    struct UserTapInRecords {
        uint lastTapInTime;
        UserTapInDailyReward[] tapInRewardList;
       
    }

    struct InvestmentTotalRevenue {
        uint256 totalTapInRevenue;
        uint256 totalRecommendRevenue;
        uint256 tapInRewardEstimate;
    }
    
    struct UserTapInDailyReward {
        uint256 tapInDatetime;
        uint256 tapInRewardAmount;
    }

    struct RecommenderRewardInfo {
        uint256 rewardAmount;
        uint recommendLevel;
        address rewardAddress;
    }
    
    receive() external payable {
        
    }

    function recordInvestment(address investorAddr, uint256 investmentAmount, uint time) private {
        Investment[] storage investmentsMapping = userInvestmentsMapping[investorAddr];
        Investment memory newInvestment = Investment({
            investmentTime: time,
            investmentAmount: investmentAmount
        });
        investmentsMapping.push(newInvestment);
    }
    
    function investAction(string memory refferCode, address investorAddr, uint256 investmentAmount, uint happenedTime) public payable {
        setCallValues(INVESTMENT_CURRENCY, investmentAmount, "", bytes32(0));
        dkrw.agent(refferCode, investorAddr);
        
        if(!baseInfo.hasSet(investorAddr)) {
            address[] memory list = new address[](1);
            list[0] = investorAddr;
            baseInfo.set(list);
        }
    }

    function delegateInvest(string memory refferCode, address investorAddr, uint256 investmentAmount, uint happenedTime, bool flag) private returns (bool) {

        investAction(refferCode, investorAddr, investmentAmount, happenedTime);
        
        if(flag) {
            recordInvestment(investorAddr, investmentAmount, happenedTime);
            rewardRecommenders(investorAddr, investmentAmount, happenedTime);
        }
      
        return true;
    }

    function getReferAddress(address investorAddr) private view returns(address[] memory) {
        return baseInfo.getRefers(investorAddr);
    }
    
    function rewardRecommenders(address investorAddr, uint256 investmentAmount, uint time) private {
        address[] memory recommenderAddress = getReferAddress(investorAddr);
        for (uint index = 0; index < recommenderAddress.length; index++) {
            if (recommenderAddress[index] == address(0)) {
                return;
            }
            
            (address _rewardAddress, uint _level, uint256 _amount) = calculateRecommenderReward2(recommenderAddress[index], index + 1, investmentAmount);
            doRewardRecommender(_amount, _level, _rewardAddress, time);
        }

    }
    
    function getActualReward(uint256 value) private view returns(uint256){
        (uint256 v1, uint256 v2) = hSwap.getPrice(INVESTMENT_CURRENCY, REWARD_CURRENCY);
        return value*v1/v2;
    }
    
    function recharge(address addr, string memory token, uint256 value) private {
        bytes memory data = abi.encode(addr, 3);
        setCallValues(token, value, "", bytes32(0));
        hBank.recharge(data);
    }
    
    event RewardLog(uint256);
    
    function rewardAction(uint256 rewardAmount, uint level,  address rewardAddress, uint time) private returns (uint256) {
        
        uint256 amount = getActualReward(rewardAmount);
        recharge(rewardAddress, REWARD_CURRENCY, amount);
        
        return amount;
        
    }
    
    function calcuateRewardView(uint256 actualRewardAmount, uint level,  address rewardAddress) private view returns (uint64, string memory, uint256 ) {
        uint64 uid = uint64(dkrw.idsMap(rewardAddress));
        string memory encodedName = "-";
        
        if (uid != 0) {
            encodedName = dkrw.encode(uid);
        }
        
        return (uid, encodedName, actualRewardAmount);
    }
    
    function recordAction(uint256 actualRewardAmount, uint level,  address rewardAddress, uint time, bool isRecord) private returns (uint64, string memory, uint256 ) {

        
        (uint64 uid, string memory encodedName, uint256 actual) = calcuateRewardView(actualRewardAmount, level, rewardAddress);
        
        if (isRecord) {
            InvestmentTotalRevenue storage revenue = userTotalRevenueMapping[rewardAddress];
            revenue.totalRecommendRevenue  = revenue.totalRecommendRevenue + actual;
    
            RecommendReward[] storage rewardList = userRecommendRewardListMapping[rewardAddress];
            rewardList.push(RecommendReward({rewardTime: time, rewardAmount:actual, uname: encodedName}));
        }

        return (uid, encodedName, actual);
    }
    
    function doRewardRecommender(uint256 rewardAmount, uint level,  address rewardAddress, uint time) private {
        uint256 actualRewardAmount = rewardAction(rewardAmount, level, rewardAddress, time);
        recordAction(actualRewardAmount, level, rewardAddress, time, true);
        
    }
    
    function calculateRecommenderReward2(address recommenderAddress, uint recommendLevel, uint256 investmentAmount) private pure returns (address _rewardAddress, uint _level, uint256 _amount) {
        
        RecommenderRewardInfo memory recommenderReward;
        recommenderReward.rewardAddress = recommenderAddress;
        recommenderReward.recommendLevel = recommendLevel;
        
        if (recommendLevel == 1) {
            recommenderReward.rewardAmount = investmentAmount * 7 / 100;
        }
        else if (recommendLevel == 2) {
            recommenderReward.rewardAmount = investmentAmount * 5 / 100;
        }
        else if (recommendLevel == 3) {
            recommenderReward.rewardAmount = investmentAmount * 3 / 100;
        }
        else {
            recommenderReward.rewardAmount = 0;
        }
        
        return (recommenderAddress, recommendLevel, recommenderReward.rewardAmount);
    }

    function calculateRecommenderReward(address recommenderAddress, uint recommendLevel, uint256 investmentAmount) private pure returns (RecommenderRewardInfo memory) {
        
        RecommenderRewardInfo memory recommenderReward;
        recommenderReward.rewardAddress = recommenderAddress;
        recommenderReward.recommendLevel = recommendLevel;
        
        if (recommendLevel == 1) {
            recommenderReward.rewardAmount = investmentAmount * 7 / 100;
        }
        else if (recommendLevel == 2) {
            recommenderReward.rewardAmount = investmentAmount * 5 / 100;
        }
        else if (recommendLevel == 3) {
            recommenderReward.rewardAmount = investmentAmount * 3 / 100;
        }
        else {
            recommenderReward.rewardAmount = 0;
        }
        
        return recommenderReward;
    }

    function calculateTapInRewardV3(uint256 currentInvestmentTime, uint256 investmentAmount, uint256 lastTapInTime, uint tapInTime) private view returns (uint, uint256) {
        
        uint dayInterval = 0;
        uint startTime = 0;
        
        if (lastTapInTime == 0) {
            startTime = currentInvestmentTime;
        } else {
            if (currentInvestmentTime > lastTapInTime) {
                startTime = currentInvestmentTime;
            } else {
                startTime = lastTapInTime;
            }
        }
        
        uint investentDay = getSinceDay(currentInvestmentTime);
        uint lastTapInDay = getSinceDay(startTime);
        uint startDay = getSinceDay(startTime);
        uint tapInDay = getSinceDay(tapInTime);
        dayInterval = tapInDay - startDay;
        
        uint alreadyRewardDay = lastTapInDay - investentDay;
        uint256 leftRewardDay = REWARD_SPLIT - alreadyRewardDay;
        
        if (dayInterval > leftRewardDay) {
            dayInterval = leftRewardDay;
        }
        
        if (dayInterval == 0) {
            return (0, 0);
        }
            
        uint256 totalReward = (investmentAmount * REWARD_PERCENT * dayInterval);
        uint256 thisTimeReward = totalReward / REWARD_SPLIT / 100 ;
        
        return (dayInterval, thisTimeReward);
    }
    
    function getSinceDay(uint time) private view returns (uint) {
        return  time / DAY_SECS;
    }
    
    function notTapInToday(address userAddress, uint256 tapInTime) private view returns (bool) {
        uint daySince1970 = getSinceDay(tapInTime);
        UserTapInRecords memory userTapInRecords = tapInRecordsMapping[userAddress];
        uint lastTapInDay = getSinceDay(userTapInRecords.lastTapInTime);
        if (lastTapInDay < daySince1970) {
            return true;
        }
        return false;
    }

    function estimateTapInRewardsRaw(address userAddress, uint256 tapInTime) private view returns (uint256 rewards) {
        Investment[] storage userInvestments = userInvestmentsMapping[userAddress];
        
        if (userInvestments.length == 0) {
            return 0;
        }
        
        uint256 totalRewardThisTime = 0;
        UserTapInRecords memory userTapInRecords = tapInRecordsMapping[userAddress];
        uint256 lastTapInDatetime = userTapInRecords.lastTapInTime;
        
        for (uint index = userInvestments.length - 1; index >= 0; index--) {
            Investment memory currentInvestment = userInvestments[index];
            uint256 secInterval = currentInvestment.investmentTime + (DAY_SECS * REWARD_SPLIT);
            if (lastTapInDatetime > secInterval) {
                break;
            }
            (uint dayInterval, uint256 shouldPayTapInRevenue) = calculateTapInRewardV3(currentInvestment.investmentTime, currentInvestment.investmentAmount, lastTapInDatetime, tapInTime);
            if (shouldPayTapInRevenue > 0) {
                totalRewardThisTime = totalRewardThisTime + shouldPayTapInRevenue;
            }
            
            if (index == 0) {
                break;
            }
        }
        
        return totalRewardThisTime;
    }

    function estimateTapInRewards(address userAddress, uint256 tapInTime) private view returns (uint256 rewards) {
        
        uint256 estimated = estimateTapInRewardsRaw(userAddress, tapInTime);
        
        uint256 rewardsAfterRating = getActualReward(estimated);
        
        return rewardsAfterRating;
        
    }

    function rewardDailyTapIn(address userAddress, uint tapInTime) private returns (uint256, uint256) {
        require(notTapInToday(userAddress, tapInTime), "You already tap in today!");
        Investment[] storage userInvestments = userInvestmentsMapping[userAddress];
        uint256 totalRewardThisTime = estimateTapInRewards(userAddress, tapInTime);
        if (totalRewardThisTime > 0) {
            
            UserTapInRecords storage userTapInRecords = tapInRecordsMapping[userAddress];
            recharge(userAddress, REWARD_CURRENCY, totalRewardThisTime);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            userTapInRecords.lastTapInTime = tapInTime;
            userTapInRecords.tapInRewardList.push(UserTapInDailyReward({tapInDatetime:tapInTime, tapInRewardAmount: totalRewardThisTime}));
        
            InvestmentTotalRevenue storage revenue = userTotalRevenueMapping[userAddress];
            revenue.totalTapInRevenue = revenue.totalTapInRevenue + totalRewardThisTime;
        }

        return (totalRewardThisTime, userInvestments.length);
        
    }

    function countPageIndex(uint256 totalRecords, uint page, uint perPage) private pure returns(uint256, uint256, uint256 ) {
        if (totalRecords == 0) {
            return (0, 0, 0);
        }
        uint256 lastIndex = totalRecords - 1;
        uint256 startIndex = (page - 1 ) * perPage;
        uint256 endIndex = page * perPage - 1;
        if (startIndex > lastIndex) {
            return (0,0,0);
        }
        if (endIndex > lastIndex) {
            endIndex = lastIndex;
        }
        if (startIndex == endIndex) {
            return (startIndex, endIndex, 1);
        }
        return (startIndex, endIndex, endIndex - startIndex + 1);
    }

    function queryUserRecommendRevenueDetail(uint index) public view returns (uint256, uint256) {
        
        RecommendReward memory reward = userRecommendRewardListMapping[msg.sender][index];
        return (reward.rewardTime, reward.rewardAmount);
    }
    
    function queryUserRecommendRevenueCount() public view returns (uint256) {
        return userRecommendRewardListMapping[msg.sender].length;
    }

    function queryTapInRevenueCount() public view returns (uint256) {
        return tapInRecordsMapping[msg.sender].tapInRewardList.length;
    }
    
    function queryTapInRevenueDetail(uint index) public view returns (uint256, uint256) {
        UserTapInDailyReward memory reward = tapInRecordsMapping[msg.sender].tapInRewardList[index];
        return (reward.tapInDatetime, reward.tapInRewardAmount);
    }

    function delegateQueryTotalRevenue(address userAddress, uint256 estimateTapInTime) public view returns (uint256, uint256, uint256) {
        InvestmentTotalRevenue memory investmentTotalRevenue = userTotalRevenueMapping[userAddress];
        investmentTotalRevenue.tapInRewardEstimate = estimateTapInRewards(userAddress, estimateTapInTime);
        return (investmentTotalRevenue.totalTapInRevenue, investmentTotalRevenue.totalRecommendRevenue, investmentTotalRevenue.tapInRewardEstimate);
    }

    function simulateTapIn(address userAddress, uint tapInTime) private returns (uint256, uint256) {
        return rewardDailyTapIn(userAddress, tapInTime);
    }
        
    function simulateEstimate(address userAddress, uint tapInTime) private view returns (uint256) {
        uint256 estimateRewards = estimateTapInRewards(userAddress, tapInTime);
        return estimateRewards;
    }

    function dailyTapIn() public returns (uint256, uint256) {
        return rewardDailyTapIn(msg.sender, now);
    }

    function doInvest(string memory refferCode, bool flag) public payable returns (bool) {
        return delegateInvest(refferCode, msg.sender, msg.value, now, flag);
    }

    function queryTotalRevenue() public view returns (uint256, uint256, uint256) {
        return delegateQueryTotalRevenue(msg.sender, now);
    }
    function queryUserRecommendRevenue(uint startIdx, uint256 perPage) public view returns (RecommendReward[] memory, uint256 totalRecords) {
        RecommendReward[] memory content = userRecommendRewardListMapping[msg.sender];
        
		(uint256 startIndex, uint256 endIndex) = countPageIndexV2(content.length, startIdx, perPage);
        RecommendReward[] memory results = new RecommendReward[](startIndex-endIndex);
        
        for(uint256 i= startIndex;i>endIndex;i--) {
            results[startIndex-i] = content[i-1];
        }
        return  (results, content.length);
    }

    function queryUserInvestmentTapInRevenue(uint start, uint256 perPage) public view returns (UserTapInDailyReward[] memory, uint256 totalRecords) {
        
        UserTapInDailyReward[] memory content = tapInRecordsMapping[msg.sender].tapInRewardList;
        
        (uint256 startIndex, uint256 endIndex) = countPageIndexV2(content.length, start, perPage);
        UserTapInDailyReward[] memory results = new UserTapInDailyReward[](startIndex-endIndex);
        
        for(uint256 i= startIndex;i>endIndex;i--) {
            results[startIndex-i] = content[i-1];
        }
        return  (results, content.length);
    }
    
    function queryUserInvestment(uint start, uint256 perPage) public view returns (Investment[] memory, uint256 totalRecords) {
        Investment[] memory content = userInvestmentsMapping[msg.sender];
        
		(uint256 startIndex, uint256 endIndex) = countPageIndexV2(content.length, start, perPage);
        Investment[] memory results = new Investment[](startIndex-endIndex);
        
        for(uint256 i = startIndex; i > endIndex; i--) {
            results[startIndex-i] = content[i-1];
        }
        return  (results, content.length);
        
    }
    
    function countPageIndexV2(uint256 totalRecords, uint startIndex, uint perPage) private pure returns (uint256, uint256) {
    
        if (totalRecords == 0 || perPage <= 0 ) {
            return (0, 0);
        }
        uint256 endIndex;
        
        if(startIndex > totalRecords) {
            startIndex = totalRecords;
        }
        
        if(startIndex < perPage) {
            endIndex = 0;
        } else {
            endIndex = startIndex-perPage;
        }
        
        return (startIndex, endIndex);
    }
    
    
    function financing(bytes memory opData) external payable returns(bool) {
        (address investor, string memory referCode) = abi.decode(opData,(address,string));
        // setCallValues("DKRW", msg.value, "", bytes32(0));
        // dkrw.agent(referCode, investor); 
        delegateInvest(referCode, investor, msg.value, now, true);
        
        return true;
    }
    
    function withdraw(string memory token, uint256 value) public onlyManager {
        require(send_token(manager, token, value));
    }
    
    function setHBank(address bankAddress) public onlyOwner {
        hBank = HBank(bankAddress);
    }
    
    function setDkrw(address dkrwAddress) public onlyOwner {
        dkrw = Dkrw(dkrwAddress);
    }
    
    function setHSwap(address swapAddress) public onlyOwner {
        hSwap = HSwap(swapAddress);
    }
    
    function setBaseInfo(address baseInfoAddress) public onlyOwner {
        baseInfo = BaseInfo(baseInfoAddress);
    }
}
