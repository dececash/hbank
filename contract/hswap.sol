pragma solidity 0.6.10;
// SPDX-License-Identifier: GPL-3.0 pragma solidity >=0.4.16 <0.7.0;
pragma experimental ABIEncoderV2;

import "./strings.sol";
import "./math.sol";
import "./LinkList.sol";

contract Ownable {
    address public owner;
    address public manager;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        owner = msg.sender;
        manager = msg.sender;
    }


    /**
     * @dev Throws if called by any account other than the owner.
     */
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

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
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

contract Swap is BaseInterface, Ownable {
    using SafeMath for uint256;
    
    using LinkList for LinkList.List;

    struct Pair {
        bytes32 tokenA;
        bytes32 tokenB;
        uint256 price;
        uint256 feeRate;
    }

    mapping(bytes32 => Pair) public pairs;
    bytes32[] public keys;
   
    receive() external payable {
    }

    function pairList(uint256 _start, uint256 _end) public view returns (Pair[] memory rets) {
        if (_start >= keys.length || _start >= _end) {
            return rets;
        }

        if (_end > keys.length) {
            _end = keys.length;
        }

        rets = new Pair[](_end - _start);
        for (uint256 i = _start; i < _end; i++) {
            rets[i - _start] = pairs[keys[i]];
        }
    }

    function withdraw(string memory token, uint256 value) public onlyManager {
        require(send_token(manager, token, value));
    }

    function setFeeRate(string memory tokenA, string memory tokenB, uint256 feeRate) public onlyManager {
        bytes32 tokenABytes = strings._stringToBytes32(tokenA);
        bytes32 toeknBBytes = strings._stringToBytes32(tokenB);
        require(tokenABytes != toeknBBytes, "same token");
        bytes32 key = hashKey(tokenABytes, toeknBBytes);
        require(feeRate < 10000);
        pairs[key].feeRate = feeRate;
    }

    function setPair(string memory tokenA, string memory tokenB, uint256 price) public onlyManager {
        bytes32 tokenABytes = strings._stringToBytes32(tokenA);
        bytes32 toeknBBytes = strings._stringToBytes32(tokenB);
        require(tokenABytes != toeknBBytes, "same token");
        bytes32 key = hashKey(tokenABytes, toeknBBytes);
        if (pairs[key].tokenA == bytes32(0)) {
            pairs[key] = Pair({
                tokenA : tokenABytes,
                tokenB : toeknBBytes,
                price : price,
                feeRate : 100
                });
            keys.push(key);
        } else {
            require(tokenABytes == pairs[key].tokenA);
            pairs[key].price = price;
        }
    }

    function exchange(string memory token) public payable returns (uint256 value) {
        bytes32 tokenSend = strings._stringToBytes32(msg_currency());
        bytes32 toeknRece = strings._stringToBytes32(token);
        bytes32 key = hashKey(tokenSend, toeknRece);
        require(pairs[key].tokenA != bytes32(0), "pair not available");
        value = msg.value;
        uint256 price = pairs[key].price;
        require(price != 0);

        if (tokenSend == pairs[key].tokenA) {
            value = value.mul(price).div(1e9);
        } else {
            value = value.mul(1e9).div(price);
        }
        
        value = value.mul(10000 - pairs[key].feeRate).div(10000);

        require(send_token(msg.sender, token, value));
    }
    
    function getPrice(string memory tokenA,string memory tokenB ) public returns (uint256) {
        bytes32 tokenSend = strings._stringToBytes32(tokenA);
        bytes32 tokenRece = strings._stringToBytes32(tokenB);
        bytes32 key = hashKey(tokenSend, tokenRece);
    }

    function hashKey(bytes32 tokenA, bytes32 tokenB) private pure returns (bytes32) {
        require(tokenA != tokenB, 'same token');
        (bytes32 token0, bytes32 token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        return keccak256(abi.encode(token0, token1));
    }
}