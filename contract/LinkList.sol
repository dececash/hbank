pragma solidity ^0.6.10;
// SPDX-License-Identifier: GPL-3.0 pragma solidity >=0.4.16 <0.7.0;

library LinkList {
    struct Node {
        bytes32 next;
        bytes32 key;
    }
    
    struct List {
        bytes32 head;
        bytes32 tail;
        uint len;
        mapping(bytes32 =>Node) map;
    }
    
    function list(List storage self) internal view returns(bytes32[] memory rets){
        bytes32 index = self.head;
        rets  = new bytes32[](self.len);
        for(uint256 i=0;index != 0;i++) {
            rets[i] = self.map[index].key;
            index = self.map[index].next;
        }
    }
    
  
    function push(List storage self, bytes32 key) internal {
        if( self.map[key].key != bytes32(0)) {
            return;
        }
        self.map[key]=Node({key:key,next:0});
        if(self.head == bytes32(0)) {
            self.head = key;
        }
        if( self.tail != bytes32(0)) {
             self.map[self.tail].next = key;
        }
        self.tail=key;
        self.len++;
    }
    
    function remove(List storage self, bytes32 key) internal {
        
        if(key == self.head) {
            self.head = self.map[key].next;
            delete self.map[key];
            self.len--;
        } else {
            bytes32 index = self.head;
            while(index != bytes32(0) && key != self.map[index].next) {
                index = self.map[index].next;
            }
            
            if(index != bytes32(0)) {
                 self.map[index].next = self.map[key].next;
                 delete self.map[key];
                 if(key == self.tail) {
                     self.tail = index;
                 }
                 self.len--;
            }
        }
        
        if(self.len == 0) {
            self.head=bytes32(0);
            self.tail = bytes32(0);
        }
    }
}