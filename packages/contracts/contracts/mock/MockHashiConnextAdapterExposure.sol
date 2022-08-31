// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../HashiConnextAdapter.sol";

contract MockHashiConnextAdapterExposure is HashiConnextAdapter {
  function initialize(uint32 selfDomain, address connext) public initializer {
    __HashiConnextAdapter_init(selfDomain, connext);
  }

  // solhint-disable-next-line no-empty-blocks
  function testOnlyExecutor() public onlyExecutor {}

  function xcall(uint32 destinationdomain, bytes memory callData) public {
    _xcall(destinationdomain, callData);
  }
}
