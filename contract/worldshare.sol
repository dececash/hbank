pragma solidity 0.6.10;
// SPDX-License-Identifier: GPL-3.0 pragma solidity >=0.4.16 <0.7.0;
pragma experimental ABIEncoderV2;

import "./strings.sol";

contract BaseInterface {

    bytes32 private topic_currency = 0x7c98e64bd943448b4e24ef8c2cdec7b8b1275970cfe10daf2a9bfa4b04dce905;
    bytes32 private topic_setCallValues = 0xa6cafc6282f61eff9032603a017e652f68410d3d3c69f0a3eeca8f181aec1d17;

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
}



interface Dkrw {
    function agent(string memory refferCode, address addr) external payable;
}


contract DKRWAgent is BaseInterface {
    
    Dkrw dkrw;
    
    constructor(address _dkrw) public {
        dkrw = Dkrw(_dkrw);
    }
    
    event FLog(address investor, string refferCode);
    
    function financing(bytes memory opData) external payable returns(bool) {
        (address investor, string memory referCode) = abi.decode(opData,(address,string));
        emit FLog(investor, referCode);
        setCallValues("DKRW", msg.value, "", bytes32(0));
        
        dkrw.agent(referCode, investor);
        
        return true;
    }
}