// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IExecutor.sol";

contract MockBridge {
  event Called(uint32 origin, address originSender);

  function execute(bool success) public {
    require(success, "MockBridge: fail");
    uint32 origin = IExecutor(msg.sender).origin();
    address originSender = IExecutor(msg.sender).originSender();
    emit Called(origin, originSender);
  }
}
