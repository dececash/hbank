pragma solidity ^0.6.10;

pragma experimental ABIEncoderV2;

import "./strings.sol";
import "./ownable.sol";

contract ClassManager is Ownable{
   
    mapping(bytes32 =>uint16[6]) rateList;
    
    function setRate(string memory token,uint16 rate, uint index) public onlyOwner{
        rateList[strings._stringToBytes32(token)][index]=rate;
    }
    
    function getClassRate(bytes32 token, uint nDay) public view returns(uint){
        if(nDay <= 30){
            return rateList[token][0];
        } else if(nDay <= 90){
            return (rateList[token][1]);
        } else if(nDay <= 180){
            return (rateList[token][2]);
        } else if(nDay <= 270){
            return (rateList[token][3]);
        } else if(nDay <= 360){
            return(rateList[token][4]);
        } else {
            return (rateList[token][5]);
        }
    }
}