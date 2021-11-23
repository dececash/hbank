pragma solidity ^0.6.10;

pragma experimental ABIEncoderV2;


import "./strings.sol";
import "./math.sol";
import "./ownable.sol";
import "./List.sol";


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

interface IClassManager {
    function getClassRate(bytes32 token, uint nDay) external view returns(uint);
}


interface Hbank{
    function recharge(bytes memory data) external payable;
}

interface HSwap {
    
    function exchange(string memory token) external payable returns (uint256 value);
    
}

contract fixedprod is BaseInterface,Ownable{
    using SafeMath for uint256;
    using List for List.UintSet;
    uint constant DAY= 1 days;
    
    struct Product {
        address owner;
        bytes32 token;
        uint amount;
        uint createTime;
        uint withdrawValue;
    }
    
    Product[] public prods;
    mapping(address => mapping(bytes32 => uint[])) selfMap;
    mapping(bytes32 => List.UintSet) tokenToPrids;
    
    mapping(bytes32 => bool) public allowTokens;
    
    IClassManager classManager;
    Hbank bank;
    HSwap swap;
    
    constructor(address _classManager, address _bank, address _swap) public {
        classManager = IClassManager(_classManager);
        bank = Hbank(_bank);
        swap = HSwap(_swap);
    }
    
    function setClass(address classAddress) public onlyManager {
        classManager = IClassManager(classAddress);
    }
    
    function setHBank(address bankAddress) public onlyOwner {
        bank = Hbank(bankAddress);
    }
    
    function setHSwap(address _swap) public onlyManager{
        swap = HSwap(_swap);
    }
    
    receive() external payable {
    }
    
    function managerWithdraw(string memory token, uint256 value) public onlyManager {
        require(send_token(msg.sender, token, value));
    }
    
    function prodList(uint startIndex, uint pageCount, string memory _token, address self) public view returns(uint len, Product[] memory prodList, uint[] memory indexs) {
        
        bytes32 token = strings._stringToBytes32(_token);
        
        uint[] memory list;
        if(self != address(0)) {
            list = selfMap[self][token];
        } else {
            list = tokenToPrids[token].list();
        }
        
        len = list.length;
        
        uint endIndex;
        if(startIndex > list.length) {
            startIndex = list.length;
        }
         
        if(startIndex < pageCount) {
            endIndex = 0;
        } else {
            endIndex = startIndex - pageCount;
        }
    
        indexs = new uint[](startIndex - endIndex);
        prodList = new Product[](startIndex - endIndex);
        for(uint i = startIndex; i > endIndex; i--) {
            indexs[startIndex -i] = list[i - 1];
            prodList[startIndex - i] = prods[indexs[startIndex-i]];
        }
    }
    
    function allow(string memory _token, bool flag) public onlyManager {
        bytes32 token = strings._stringToBytes32(_token);
        allowTokens[token] = flag;
    }

    function financing(bytes memory opData) external payable returns(bool) {
         (address investor, string memory depositTokenStr) = abi.decode(opData,(address, string));
         if(strings._stringEq("", depositTokenStr)) {
              _deposit(investor, msg_currency(), msg.value, msg_currency());
         } else {
              _deposit(investor, msg_currency(), msg.value, depositTokenStr);
         }
         return true;
        
    }
    
    function deposit(string memory depositTokenStr) public payable {
        if(strings._stringEq("", depositTokenStr)) {
              _deposit(msg.sender, msg_currency(), msg.value, msg_currency());
        } else {
              _deposit(msg.sender, msg_currency(), msg.value, depositTokenStr);
        }
    }
    
    function _deposit(address investor,  string memory payTokenStr, uint value, string memory depositTokenStr) internal {
        
        bytes32 payToken = strings._stringToBytes32(payTokenStr);
        bytes32 depositToken = strings._stringToBytes32(depositTokenStr);

        if(payToken != depositToken) {
            setCallValues(payTokenStr, value, "", bytes32(0));
            value = swap.exchange(depositTokenStr);
            require(value > 0, "no swap pair");
        }
        
        require(allowTokens[depositToken], "not allowed assets");
     
        selfMap[investor][depositToken].push(prods.length);
        tokenToPrids[depositToken].push(prods.length);
        prods.push(Product({owner:investor, token:depositToken, amount:value, createTime:now, withdrawValue:0}));
    }
    
    function withdraw(uint index) public {
        
        Product storage prod = prods[index];
        uint nDay =(now- prod.createTime) / DAY;
        uint rate = classManager.getClassRate(prod.token, nDay);
        
        require(msg.sender == prod.owner, "not the owner");
        require(rate > 0, "locked");
        require(prod.withdrawValue == 0, "have withdraw");
        
        bool flag = (rate >> 15) > 0;
        uint amount;
        
        if(flag) {
            amount = prod.amount + (rate&uint(0x7fff)) * prod.amount / 10000;
        } else {
            amount = prod.amount - (rate&uint(0x7fff)) * prod.amount / 10000;
        }
        
        prod.withdrawValue = amount;
       
        // require(send_token(msg.sender, strings._bytes32ToStr(prod.token), amount),"send failed");
        
        bytes memory data = abi.encode(prod.owner, 3);
        setCallValues(strings._bytes32ToStr(prod.token), amount, "", bytes32(0));
        bank.recharge(data);
        
        tokenToPrids[prod.token].remove(index);
    } 
}