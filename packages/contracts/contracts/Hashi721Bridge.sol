// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC721MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";

import "./HashiConnextAdapter.sol";
import "./interfaces/IHashiWrapped721.sol";

//TODO: add domain check
contract Hashi721Bridge is Initializable, ERC165Upgradeable, HashiConnextAdapter {
  // mapping(address => mapping(uint256 => uint32)) private _destinations;
  mapping(address => address) private _contracts;
  mapping(address => uint32) private _domains;

  address private _nftImplementation;

  function initialize(
    uint32 selfDomain,
    address connext,
    address nftImplementation
  ) public initializer {
    __Hashi721Bridge_init(selfDomain, connext, nftImplementation);
  }

  function xSend(
    address processingNFTContractAddress,
    address from,
    address to,
    uint256 tokenId,
    uint32 destinationDomain,
    string memory tokenURI
  ) public {
    _validateAuthorization(processingNFTContractAddress, from, tokenId);
    address birthChainNFTContractAddress;
    uint32 birthChainDomain;
    if (_contracts[processingNFTContractAddress] == address(0x0) && _domains[processingNFTContractAddress] == 0) {
      birthChainNFTContractAddress = processingNFTContractAddress;
      birthChainDomain = getSelfDomain();
      IERC721Upgradeable(birthChainNFTContractAddress).transferFrom(from, address(this), tokenId);
      // _destinations[processingNFTContractAddress][tokenId] = destinationDomain;
    } else {
      birthChainNFTContractAddress = _contracts[processingNFTContractAddress];
      birthChainDomain = _domains[processingNFTContractAddress];
      // require(destinationDomain == birthChainDomain, "Hashi721Bridge: invalid destination domain");
      IHashiWrapped721(processingNFTContractAddress).burn(tokenId);
    }
    bytes memory callData = abi.encodeWithSelector(
      this.xReceive.selector,
      birthChainNFTContractAddress,
      to,
      tokenId,
      birthChainDomain,
      tokenURI
    );
    _xcall(destinationDomain, callData);
  }

  function xReceive(
    address birthChainNFTContractAddress,
    address to,
    uint256 tokenId,
    uint32 birthChainDomain,
    string memory tokenURI
  ) public onlyExecutor {
    uint32 selfDomain = getSelfDomain();
    if (birthChainDomain == selfDomain) {
      // address executor = getExecutor();
      // uint32 domain = _getOrigin(executor);
      // require(_destinations[birthChainNFTContractAddress][tokenId] == domain, "Hashi721Bridge: invalid bridge");
      IERC721Upgradeable(birthChainNFTContractAddress).safeTransferFrom(address(this), to, tokenId);
      // delete _destinations[birthChainNFTContractAddress][tokenId];
    } else {
      bytes32 salt = keccak256(abi.encodePacked(birthChainDomain, birthChainNFTContractAddress));
      address processingNFTContractAddress = ClonesUpgradeable.predictDeterministicAddress(
        _nftImplementation,
        salt,
        address(this)
      );
      if (!AddressUpgradeable.isContract(processingNFTContractAddress)) {
        ClonesUpgradeable.cloneDeterministic(_nftImplementation, salt);
        _contracts[processingNFTContractAddress] = birthChainNFTContractAddress;
        _domains[processingNFTContractAddress] = birthChainDomain;
        IHashiWrapped721(processingNFTContractAddress).initialize();
      }
      IHashiWrapped721(processingNFTContractAddress).mint(to, tokenId, tokenURI);
    }
  }

  // solhint-disable-next-line func-name-mixedcase
  function __Hashi721Bridge_init(
    uint32 selfDomain,
    address connext,
    address nftImplementation
  ) internal onlyInitializing {
    __Ownable_init_unchained();
    __HashiConnextAdapter_init_unchained(selfDomain, connext);
    __Hashi721Bridge_init_unchained(nftImplementation);
  }

  // solhint-disable-next-line func-name-mixedcase
  function __Hashi721Bridge_init_unchained(address nftImplementation) internal onlyInitializing {
    _nftImplementation = nftImplementation;
  }

  function _validateAuthorization(
    address nftContractAddress,
    address from,
    uint256 tokenId
  ) internal view {
    require(
      IERC721Upgradeable(nftContractAddress).ownerOf(tokenId) == _msgSender() ||
        IERC721Upgradeable(nftContractAddress).getApproved(tokenId) == _msgSender() ||
        IERC721Upgradeable(nftContractAddress).isApprovedForAll(from, _msgSender()),
      "Hashi721Bridge: invalid sender"
    );

    require(IERC721Upgradeable(nftContractAddress).ownerOf(tokenId) == from, "Hashi721Bridge: invalid from");
  }
}
