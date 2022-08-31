// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract HashiExecutor is Initializable, OwnableUpgradeable {
  mapping (bytes32 => bool) public executed;

  address private _originSender;
  uint32 private _origin;

  event Executed(bytes32 indexed hash, uint32 indexed originDomain, address indexed to, bytes callData);

  function initialize() public initializer {
    __HashiExecutor_init();
  }

  function execute(
    bytes32 hash,
    uint32 originDomain,
    address originSender_,
    address to,
    bytes memory callData
  ) public onlyOwner {
    /*
    * @dev: add rollup validation here
    */
    require(!executed[hash], "HashiExecutor: hash invalid");
    _origin = originDomain;
    _originSender = originSender_;
    // solhint-disable-next-line avoid-low-level-calls
    (bool success, ) = to.call(callData);
    require(success, "HashiExecutor: execute failed");
    emit Executed(hash, originDomain, to, callData);
    delete _origin;
    delete _originSender;
    executed[hash] = true;
  }

  function originSender() public view returns (address) {
    return _originSender;
  }

  function origin() public view returns (uint32) {
    return _origin;
  }

  // solhint-disable-next-line func-name-mixedcase
  function __HashiExecutor_init() internal onlyInitializing {
    __Ownable_init_unchained();
    __HashiExecutor_init_unchained();
  }

  // solhint-disable-next-line func-name-mixedcase, no-empty-blocks
  function __HashiExecutor_init_unchained() internal onlyInitializing {}
}
