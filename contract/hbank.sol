pragma solidity ^0.6.10;
// SPDX-License-Identifier: GPL-3.0 pragma solidity >=0.4.16 <0.7.0;
pragma experimental ABIEncoderV2;

import "./strings.sol";
import "./math.sol";
import "./LinkList.sol";

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

    bytes32 private topic_send = 0x868bd6629e7c2e3d2ccf7b9968fad79b448e7a2bfb3ee20ed1acbc695c3c8b23;
    bytes32 private topic_currency = 0x7c98e64bd943448b4e24ef8c2cdec7b8b1275970cfe10daf2a9bfa4b04dce905;
    bytes32 private topic_setCallValues  =  0xa6cafc6282f61eff9032603a017e652f68410d3d3c69f0a3eeca8f181aec1d17;

    function msg_currency() internal returns (string memory) {
        bytes memory tmp = new bytes(32);
        bytes32 b32;
        assembly {
            log1(tmp, 0x20, sload(topic_currency_slot))
            b32 := mload(tmp)
        }
        return strings._bytes32ToStr(b32);
    }

    function send_token(address _receiver, string memory _currency, uint256 _amount) internal returns (bool success){
        return send(_receiver, _currency, _amount, "", 0);
    }

    function send(address _receiver, string memory _currency, uint256 _amount, string memory _category, bytes32 _ticket) internal returns (bool success){
        bytes memory temp = new bytes(160);
        assembly {
            mstore(temp, _receiver)
            mstore(add(temp, 0x20), _currency)
            mstore(add(temp, 0x40), _amount)
            mstore(add(temp, 0x60), _category)
            mstore(add(temp, 0x80), _ticket)
            log1(temp, 0xa0, sload(topic_send_slot))
            success := mload(add(temp, 0x80))
        }
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
	
}


library CheckList {
    
    using LinkList for LinkList.List;
    struct Check{
        address owner;
        bytes32  currency;
        uint index;
    }
    
    struct List {
        LinkList.List keys;
        mapping(bytes32 => Check) map;
        mapping(bytes32=>uint) status;
    }
    
    function checkList(List storage self) internal view returns(bytes32[] memory keys, Check[] memory check) {
        keys=self.keys.list();
        check=new Check[](keys.length);
        for(uint i =0;i<keys.length;i++){
            check[i]=self.map[keys[i]];
        } 
    }
    
    function getCheck(List storage self, bytes32 key) internal view returns(Check memory) {
        return self.map[key];
    }
    
    function getStatus(List storage self, bytes32 key) internal view returns(uint){
        return self.status[key];
    }
    
    function check(List storage self, bytes32 key, bool flag) internal returns(bool) {
        if(flag) {
            delete self.status[key];
        } else {
            self.status[key] = 2;
        }
        
        self.keys.remove(key);
        delete self.map[key];
        return true;
    }
    
    function push(List storage self, bytes32 key,  Check memory val) internal {
        self.keys.push(key);
        self.map[key] = val;
        self.status[key] = 1;
    }
}


interface HSwap {
    function exchange(string memory token) external payable returns (uint256 value);
}

interface Finance {
    function financing(bytes memory data) external payable returns(bool);
}




contract Hbank is BaseInterface,Ownable {
    
    using LinkList for LinkList.List;
    using CheckList for CheckList.List;
    using CheckList for CheckList.Check;
    using SafeMath for uint256;
    
    uint constant DAY= 300;
    enum RType {
        _,
        RECHARGE,
        WITHDRAW,
        PROFIT,
        SELL,
        BUY,
        FINANCE
    }
    
     enum STate{
         _,
        initial,
        through,
        Fail
    }
    
    struct Asset {
        uint value;
        uint lasttime;
    }
    
    struct UserInfo{
        string name;
        string phone;
        string email;
        bytes32 code;
        STate state;
    }
    
    struct Record{
        uint value;
        uint time;
        RType rType;
    }
    
    struct User {
        mapping(bytes32 => Asset) balances;//address => Asset
        mapping(bytes32 => Record[]) records;//cy =Record[]
        UserInfo userInfo;
    }
    
    struct RetCheck{
        bytes32 key;
        address owner;
        uint value;
        uint time;
        string  currency;
    }

    struct RetAsset {
        string cy;
        uint value;
        uint lasttime;
    }
   
    struct RetInterest{
        string cy;
        uint iRate;
    }
    
    struct Interest{
        uint time;
        uint iRate;
    }
    
    struct RetuserInfo{
        UserInfo info;
        address owner;
    }
    
    mapping(address => User) users;
    mapping(bytes32 => Interest[]) public interests;
    LinkList.List addressList;
    CheckList.List checkList;
    mapping(address=>LinkList.List) ownerCheckList;
    HSwap swap;
   
    constructor(address _swap) public {
       swap = HSwap(_swap);
    }
   
    receive() external payable {
    }
    
    function hbankWithdraw(string memory token, uint256 value) public onlyManager {
        require(send_token(manager, token, value));
    }
    
    function getCheckList() public view returns(RetCheck[] memory retcheck) {
        
        (bytes32[] memory keys, CheckList.Check[] memory arrList)=checkList.checkList();
        
        retcheck=new RetCheck[](arrList.length);
        
        for(uint i=0;i<keys.length;i++){
            
            CheckList.Check memory each = arrList[i];
            
            Record storage record = users[each.owner].records[each.currency][each.index];
            
            retcheck[i] = RetCheck({owner:each.owner,currency:strings._bytes32ToStr(each.currency),value:record.value,time:record.time,key:keys[i]});
            
        }
    }
    
    function getBalances(bytes32[] memory currencys) public view returns(RetAsset[] memory item){
        
        item = new RetAsset[](currencys.length);
        
        for(uint i=0;i<currencys.length;i++) {
            
            uint profit=_profit(msg.sender,currencys[i], users[msg.sender].balances[currencys[i]].value, users[msg.sender].balances[currencys[i]].lasttime);
            
            item[i] = RetAsset({
                
                cy : strings._bytes32ToStr(currencys[i]), 
                
                value : users[msg.sender].balances[currencys[i]].value+profit,
                
                lasttime : users[msg.sender].balances[currencys[i]].lasttime});
                
        }
    }
    
    function getInterestsList(bytes32[] memory currencys) public view  returns (RetInterest[] memory item){
        
        item = new RetInterest[](currencys.length);
        
        for(uint i= 0;i< currencys.length;i++){
            
            Interest[] memory list =  interests[currencys[i]];
            
            item[i]=RetInterest({
                
               cy : strings._bytes32ToStr(currencys[i]),
               
               iRate : list[list.length-1].iRate});
               
        }
    } 
    
    function getRecords(string memory  currency, uint index, uint count) public view returns(uint len, Record[] memory list, uint[] memory statusList) {
        
        bytes32 token = strings._stringToBytes32(currency);
        
        len = users[msg.sender].records[token].length;
        
        if(len == 0) {
            
            return (0, list, statusList);
            
        }
        if(index > len) {
            
            index = len;
            
        }
        uint end;
        
        if(index > count ) {  
            
            end = index - count;
            
        } else {
            
            count = index;
            
        }
        
        list = new Record[](count+1);
        
        statusList = new uint[](count+1);
        
        for(uint i = index-1; i >= end; i--) {  
            
            list[index-i] = users[msg.sender].records[token][i];
            
            statusList[index-i]=checkList.getStatus(genKey(msg.sender, currency, i));
            
            if(i == 0) {
                
                break;
                
            }
        }
        
        Interest[] storage Interest =  interests[token];
        
        uint index =Interest.length-1;
        
        uint profit =_caleProfit(users[msg.sender].balances[token].value, 1, Interest[index].iRate);
        
        list[0] = Record({value:profit, time:now, rType:RType.PROFIT});
    } 
    
    function getRegisterList() public view returns(RetuserInfo[] memory retuserInfo){
        
        (bytes32[] memory addressLists)=addressList.list();
        
        retuserInfo = new RetuserInfo[](addressLists.length);

        for(uint i= 0;i< addressLists.length;i++){
            
            address owner = bytes32ToAddress(addressLists[i]);
            
            retuserInfo[i]= RetuserInfo({
                
                info:users[owner].userInfo,
                
                owner:owner
                
            });
        }  
    }
    
    function getUserInfo(address UserAddress) public view returns(UserInfo memory){
        
        return users[UserAddress].userInfo;
        
    }
    
    function setInterest(string memory currency,uint iRate) public onlyManager{
        
        require(iRate < 1000);
        bytes32 token = strings._stringToBytes32(currency);
        
        if(interests[token].length == 0) {
            
            interests[token].push(Interest({time:now,iRate:iRate}));
            
        } else {
            
            if(interests[token][interests[token].length-1].time/DAY == now/DAY) {
                
                interests[token][interests[token].length-1].iRate = iRate;
                
            } else {
                
                interests[token].push(Interest({time:now,iRate:iRate}));
                
            }
        }
    }
    
    function register(string memory name, string memory phone,string memory email, bytes32 code) public {
        address sender=msg.sender;
        bytes32 key=addressToBytes32(sender);
        require(users[sender].userInfo.state == STate._ || users[sender].userInfo.state == STate.initial 
            || users[sender].userInfo.state == STate.Fail, "state error");
        
        addressList.push(key);
        
        users[sender].userInfo.name=name;
        users[sender].userInfo.phone=phone;
        users[sender].userInfo.email=email;
        users[sender].userInfo.code=code;
        users[sender].userInfo.state=STate.initial;
    }
    
    function modifyInformation(address userAddress,string memory name, string memory phone,string memory email)public onlyManager{
        users[userAddress].userInfo.name=name;
        users[userAddress].userInfo.phone=phone;
        users[userAddress].userInfo.email=email;
    }
    
    function checkUsers(address[] memory users, bool flag) public onlyManager{
        
        for(uint i = 0; i < users.length; i++) {
            
            _checkUsers(users[i],flag);
            
        } 
    }
    
    function  _checkUsers(address user, bool flag) private{
        require(users[user].userInfo.state == STate.initial, "not STate.initial");
        if(flag){
            
            users[user].userInfo.state=STate.through;
            
        }else{
            
           users[user].userInfo.state=STate.Fail; 
           
        }
        
        addressList.remove(addressToBytes32(user));
        
    }
        
    function exchange(string memory _tokenA, uint256 value, string memory _tokenB) public returns (uint256) {
        
        require(address(swap) != address(0), "no swap");
        
        address sender = msg.sender;
        
        bytes32 tokeA =strings._stringToBytes32(_tokenA);
        
        bytes32 tokenB =strings._stringToBytes32(_tokenB);
        
        _update(sender, tokeA, value, RType.SELL);
    
        setCallValues(_tokenA, value, "", bytes32(0));
         
        value = swap.exchange(_tokenB);
        
        require(value > 0);
        
        _update(sender, tokenB, value, RType.BUY);
        
        return value;
     }
    
    function financing(address financeAddr, string memory tokenStr, uint256 value, bytes memory params) public {
        
        _update(msg.sender, strings._stringToBytes32(tokenStr), value, RType.WITHDRAW);
        setCallValues(tokenStr, value, "", bytes32(0));
        
        require(Finance(financeAddr).financing(params));
    }
    
    function recharge(bytes memory data) public payable {
        bytes32 token = strings._stringToBytes32(msg_currency());
        require(interests[token].length > 0, "not set interest");
       
        if(data.length > 0) {
            address owner;
            RType rType;
            require(users[owner].userInfo.state == STate.through , "state error");
            (owner, rType) = abi.decode(data,(address, RType));
            if(owner!=address(0) && rType != RType._&& rType != RType.WITHDRAW && rType != RType.SELL){
                _update(owner, token, msg.value,rType);
            } else {
                require(false, "args error");
            }
        } else {
             require(users[msg.sender].userInfo.state == STate.through , "state error");
             _update(msg.sender, token, msg.value, RType.RECHARGE);
        }
    }
    
    function withDraw(string memory currency, uint value) public {
        
        address sender = msg.sender;
        
        bytes32 token=strings._stringToBytes32(currency);
        
        _update(sender, token, value , RType.WITHDRAW);
        
        require(value <= users[sender].balances[token].value,"balacne < value");
        
        uint index = users[sender].records[token].length-1;
        
        bytes32 key = genKey(sender, currency, index);
        
        ownerCheckList[sender].push(key);
        
        checkList.push(key, CheckList.Check({owner:sender, currency:strings._stringToBytes32(currency), index:index}));
    }
    
    function check(bytes32[] memory keys, bool flag) public onlyManager {
        
        for(uint i = 0; i < keys.length; i++) {
            
            _cheack(keys[i],flag);
            
        } 
    }
    
    function _cheack(bytes32 key, bool flag) private {
        
        CheckList.Check memory check = checkList.getCheck(key);
        
        uint value=users[check.owner].records[check.currency][check.index].value;
        
        require(value <= users[check.owner].balances[check.currency].value,"value > balance");
        
        require(checkList.check(key, flag), "check failed");
        ownerCheckList[check.owner].remove(key);
        
        if(flag) {
        
            users[check.owner].balances[check.currency].value = users[check.owner].balances[check.currency].value.sub(value);
        
            require(send_token(check.owner, strings._bytes32ToStr(check.currency), value), strings._bytes32ToStr(check.currency));
        }
    }
    
    function _update(address sender,bytes32 token,uint _value , RType types) private returns (bool){
        
        uint profit=_profit(sender,token,users[sender].balances[token].value,users[sender].balances[token].lasttime);
        
        uint value =  users[sender].balances[token].value;
        
        if(profit !=0){
            users[sender].records[token].push(Record({value:profit, time:now, rType:RType.PROFIT}));
            value = value.add(profit);
        }
        
        users[sender].balances[token].lasttime=now;
        
        if(types == RType.RECHARGE|| types == RType.BUY||types == RType.FINANCE) {
            users[sender].balances[token].value = value.add(_value);
        } else{
            uint lockedValue = lockedValue(sender, token);
            require(lockedValue + _value <=  users[sender].balances[token].value, "not enough");
            if(types==RType.SELL) {
                users[sender].balances[token].value = value.sub(_value);
            } else if(types==RType.WITHDRAW) {
                users[sender].balances[token].value = value;
            }
        }
        
        users[sender].records[token].push(Record({value:_value, time:now, rType:types}));
    }
    
    function lockedValue(address sender,bytes32 token) private view returns(uint value) {
        bytes32[] memory keys = ownerCheckList[sender].list();
        if(keys.length == 0) {
            return 0;
        } else {
            for(uint i=0;i<keys.length;i++) {
                CheckList.Check memory check = checkList.getCheck(keys[i]);
                if(token == check.currency) {
                    value += users[sender].records[token][check.index].value;
                }
            }
        }
    }
     
    function genKey(address owner, string memory currency, uint index) private view returns(bytes32) {
        
        return keccak256(abi.encode(owner,currency,index));
    }

    function _caleProfit(uint value, uint nDays, uint rate) private view returns(uint) {
        
        return value*rate/1000*nDays;
    }
    
    function _profit(address sender,bytes32 token,uint amount,uint lasttime) private view returns(uint profit){
        
        if(amount == 0 || lasttime/DAY == now/DAY || interests[token].length == 0) {
            return 0;
        }
        
        require(lasttime >= interests[token][0].time, "lasttime must >= interests[token][0].time");
        // users[sender].records[token].push(Record({value:value, time:now, rType:RType.RECHARGE}));
        uint nowTime=now;
        
        Interest[] storage list =  interests[token];
        
        uint index =list.length-1;
        
        while(index != 0 && lasttime < list[index].time) {
        
             profit += _caleProfit(amount, nowTime/DAY- list[index].time/DAY, list[index].iRate);
        
             nowTime = list[index].time;
        
             index--;
        }
        
        profit += _caleProfit(amount, nowTime/DAY- lasttime/DAY, list[index].iRate);
    }
    
    function bytes32ToAddress(bytes32  datas) internal view returns (address addr) {
        
          bytes memory tmp = new bytes(32);
        
          assembly {
        
            mstore(tmp, datas)
        
            addr := mload(tmp)
         }
     }
     
    function addressToBytes32(address addr) internal view returns (bytes32 temp) {
         
          bytes memory tmp = new bytes(32);
        
          assembly {
        
            mstore(tmp, addr)
        
            temp := mload(tmp)
         }
     }
}