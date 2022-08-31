export const truncate = (str: string | undefined, pre: number, post?: number) => {
  if (!str) {
    return "";
  }
  const _post = post || 0;
  const len = pre + _post;
  if (str.length <= len) {
    return str;
  }
  return `${str.substring(0, pre)}...${post ? str.substring(str.length - post) : ""}`;
};

export const getFromLocalStorageTxList = (chainId: string) => {
  const txListString = window.localStorage.getItem("txList");
  let txList;
  if (!txListString) {
    txList = { [chainId]: [] };
  } else {
    txList = JSON.parse(txListString);
    if (!txList[chainId]) {
      txList[chainId] = [];
    }
  }
  return txList;
};

export const addToLocalStorageTxList = (chainId: string, hash: string) => {
  const txList = getFromLocalStorageTxList(chainId);
  txList[chainId].push(hash);
  window.localStorage.setItem("txList", JSON.stringify(txList));
};
