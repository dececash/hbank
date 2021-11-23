pragma solidity ^0.6.10;

pragma experimental ABIEncoderV2;

import "./strings.sol";
// import "./LinkList.sol";

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
}


contract DkrwBrige is BaseInterface,Ownable{
    // using EnumerableSet for EnumerableSet.UintSet;

    enum RecordState{
        Initial,
        Through,
        Fail
    }
    
    struct RechargeRecord {
        string trxId;
        uint amount;
        uint createTime;
    }
    
    struct WithdrawRecord {
        address owner;
        uint amount;
        uint createTime;
        RecordState status;
    }
    
    struct WithdrawItemRecord{
        WithdrawRecord item;
        uint auditingId;
    }
    
    string private constant TOKE_NAME = "DKRW";
        
    mapping(string => address) public accountToAddrs;
    mapping(string => RecordState) public rechargeAudited;
    
    WithdrawRecord[] withdrawRecords;
    mapping(address => uint[]) selfWithdraws;
    uint[] private withdrawIds;
    // EnumerableSet.UintSet needAuditings;
    mapping(address => uint) public lockedBalance;
    
    receive() external payable {
    }
    
    function dkrwRecharge() payable public onlyManager  {
       require(strings._stringEq(msg_currency(), TOKE_NAME),"cy no DKRW");
    }
    
    function dkrwWithdraw(uint256 value) public onlyManager {
        require(send_token(manager, TOKE_NAME, value));
    }
    
    function register(string memory account) public {
        require(accountToAddrs[account] == address(0), "has registed");
        accountToAddrs[account] = msg.sender;
    }
    
    function auditingRechareg(string memory trxId, string memory account, uint amount, bool flag) public onlyManager {
        if(flag) {
            require(rechargeAudited[trxId] != RecordState.Through, "status error");
            rechargeAudited[trxId] = RecordState.Through;
            
            address to = accountToAddrs[account];
            require(to != address(0), "no registed");
            require(send_token(to, TOKE_NAME, amount), "");
        } else {
            require(rechargeAudited[trxId] == RecordState.Initial, "status error");
            rechargeAudited[trxId] = RecordState.Fail;
        }
    }
    
    function withdraw() public payable {
       require(strings._stringEq(msg_currency(), TOKE_NAME),"cy no DKRW");
       
        uint amount = msg.value;
        require(amount > 0 , "amount is zero value");
        
        withdrawRecords.push(WithdrawRecord({
            owner:msg.sender,
            amount:amount,
            createTime:now,
            status:RecordState.Initial
        }));
        
        uint index = withdrawRecords.length;
        selfWithdraws[msg.sender].push(index);
        withdrawIds.push(index);
        
        lockedBalance[msg.sender] = lockedBalance[msg.sender] + amount;
    }
    
    function auditingWithdraw(uint[] memory list, bool through) public onlyManager {
        require(list.length > 0,"no need auditing");
        for(uint i = 0; i < list.length; i++) {
            require(list[i] > 0, "index is zero value");
            
            WithdrawRecord storage record = withdrawRecords[list[i] - 1];
            require(record.status == RecordState.Initial, "status error");
            
            if(through) {
                record.status = RecordState.Through;
            } else {
                record.status = RecordState.Fail;
                require(send_token(record.owner,"XABCDEFGHI", record.amount), "");
            }
            
            if(lockedBalance[record.owner] >= record.amount) {
                lockedBalance[record.owner] = lockedBalance[record.owner] - record.amount;
            } else {
                 lockedBalance[record.owner] = 0;
            }
            // needAuditings.remove(list[i]);
        } 
    }
    
    function getRecordsByUser(uint pageIndex, uint pageCount, address owner) public view returns(WithdrawItemRecord[] memory list) {
        return _getRecords(pageIndex, pageCount, owner);
    }
    
    function getRecords(uint pageIndex, uint pageCount) public view returns(WithdrawItemRecord[] memory list) {
        return _getRecords(pageIndex, pageCount, address(0));
    }
    
    function _getRecords(uint pageIndex, uint pageCount, address owner) internal view returns(WithdrawItemRecord[] memory list) {
        uint[] memory ids;
        if(owner == address(0)){
            ids = withdrawIds;
        }else{
            ids = selfWithdraws[owner];
        }
        
        uint len = ids.length;
        if(len == 0 || len < pageIndex * pageCount) {
            return list;
        }
        
        uint start = len - pageIndex * pageCount;
        uint end;
        if(start >= pageCount) {
            end = start - pageCount;
        }
 
        list = new WithdrawItemRecord[](start - end);
        for(uint i = start; i > end; i--) {
            uint index = ids[i-1];
            list[start - i] = WithdrawItemRecord({
                item:withdrawRecords[index-1],
                auditingId:index
            });
        }
    } 
    
} 