# 2022 EVMOS Momentum Hackathon

## PoC part

### cosmosjs usage

https://github.com/HackerSamuraiDAO/2022-EVMOS-Momentum-Hackathon/tree/main/packages/contracts/poc/cosmosjs

### relayer

https://github.com/HackerSamuraiDAO/2022-EVMOS-Momentum-Hackathon/blob/main/packages/contracts/poc/relayer/index.ts

### IBC Bridge

The information is kept here. This is remaining task after submission.

https://github.com/HackerSamuraiDAO/2022-EVMOS-Momentum-Hackathon/issues/7

### Deployed Contract

Deployed contract info is kept here.

https://github.com/HackerSamuraiDAO/2022-EVMOS-Momentum-Hackathon/blob/main/packages/contracts/networks.json

- Executor
  - Execute bridged tx in traget chain
- Bridge
  - Accept executor call and execute lock & mint bridge

### EVMOS Tx

Bridged tx in EVMOS, it mint corresponding NFT to user
https://evm.evmos.dev/tx/0x32d5fc002b0b4aa972992bc579d0dbc51aefbc10571cc7a906801428e919f738/token-transfers

## Development

### Init Submodules

#### Install Dependencies

```
git submodule init
git submodule update
```

### Contract

```
yarn
yarn build
yarn test
```

### Frontend

```
yarn
yarn dev
```

It required moralis API key, API secret key, relayer key
