//"SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.17;

contract FileValidator {
    bytes32 fileHash;
    address owner;
    uint256 createdAt;
    constructor(bytes32 _hash) public {
        fileHash = _hash;
        owner = msg.sender;
        createdAt = block.timestamp;
    }
    function verify(bytes32 hashToVerify)external view returns(bool) {
        return (hashToVerify==fileHash);
    }
    function info() external view returns(address,uint256){
        return (owner,createdAt);
    }
}