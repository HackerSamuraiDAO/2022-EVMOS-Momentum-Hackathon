// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";

import "./interfaces/IHashiWrapped721.sol";

contract HashiWrapped721 is
  Initializable,
  ERC165Upgradeable,
  OwnableUpgradeable,
  ERC721Upgradeable,
  ERC721URIStorageUpgradeable,
  IHashiWrapped721
{
  function initialize() public initializer {
    __Ownable_init();
    __ERC721_init("HashiWrapped721", "HASHIW721");
  }

  function mint(
    address to,
    uint256 tokenId,
    string memory _tokenURI
  ) public onlyOwner {
    _mint(to, tokenId);
    if (bytes(_tokenURI).length > 0) {
      _setTokenURI(tokenId, _tokenURI);
    }
  }

  function burn(uint256 tokenId) public onlyOwner {
    _burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(IERC165Upgradeable, ERC165Upgradeable, ERC721Upgradeable)
    returns (bool)
  {
    return interfaceId == type(IHashiWrapped721).interfaceId || super.supportsInterface(interfaceId);
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
    return super._burn(tokenId);
  }
}
