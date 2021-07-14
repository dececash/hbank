pragma solidity ^0.6.10;

library List {
    
    struct UintSet {
        uint[] values;
        mapping(uint => uint) indexs;
    }
    
    function index(UintSet storage self, uint v) internal view returns(uint) {
        return self.indexs[v];
    }
    
    function list(UintSet storage self) internal view returns(uint[] memory) {
        return self.values;
    }
    
    function push(UintSet storage self, uint value) internal {
        if(self.indexs[value] != 0) {
            self.values.push(value);
            self.indexs[value] = self.values.length;
        }
    }
    
    function remove(UintSet storage self, uint value) internal returns(bool) {
        uint valueIndex = self.indexs[value];
        if(valueIndex == 0) {
            return false;
        } else {
            
            uint256 toDeleteIndex = valueIndex - 1;
            if(toDeleteIndex != self.values.length - 1) {
                self.values[toDeleteIndex] = self.values[self.values.length - 1];
                self.indexs[self.values[toDeleteIndex]] = valueIndex;
            }
            self.values.pop();
            delete self.indexs[value];
        }
        
    }
}