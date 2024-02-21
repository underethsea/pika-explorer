// -------------V2----------------------
// const EVENTS = {
//   CLOSEPOSITION: {
//     TOPIC: "",
//   },
//   NEWPOSITION: {
//     TOPIC: "0x340ad004f2cc7f2adb2ebb38a9900cbc5888c8c67aeab767e74b16dbe1c87a4a",
//   },
// };

// ----------V3-----------------------
const EVENTS = {
  CLOSEPOSITION: {
    TOPIC: "0x980658f6b65b51ce7d353bc2f9110e33617a69ab8dd85ed76e70546542ebea25",
  },
  NEWPOSITION: {
    TOPIC: "0xf0179f06d5592030053869d8d0ae508420786cda1b88f04f1611215f029a35ab",
  },
};

const CONTRACT = {
  PERPV4: { ADDRESS: "0x8c9b6a4a4e61F4635E8e375E05ff98Db5516d25E"},
  PERPV3: { ADDRESS: "0xD5A8f233CBdDb40368D55C3320644Fb36e597002" },
  PERPV2: { ADDRESS: "0x2FaE8C7Edd26213cA1A88fC57B65352dbe353698" },
};

const PRODUCTS = {
  1: { name: "ETH", image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",gecko:"ethereum" },
  2: { name: "BTC", image: "https://data-chain-link.cdn.prismic.io/data-chain-link/19a58483-b100-4d09-ab0d-7d221a491090_BTC.svg", gecko:"bitcoin"},
  3: { name: "SOL", image: "https://app.pikaprotocol.com/images/solana.png", gecko:"solana"},
  4: { name: "AVAX", image: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",gecko:"avalanche-2"},
  5: { name: "MATIC", image: "https://app.pikaprotocol.com/images/matic.png",gecko:"matic-network" },
  6: { name: "LINK" , image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png", gecko:"chainlink"},
  7: { name: "SNX" , image: "https://s2.coinmarketcap.com/static/img/coins/64x64/2586.png",gecko:"havven"},
  8: { name: "AAVE", image: "https://app.pikaprotocol.com/images/aave.png", gecko:"aave" },
  9: { name: "APE" , image: "https://app.pikaprotocol.com/images/ape.png", gecko:"apecoin"},
  10: { name: "AXS", image:"https://app.pikaprotocol.com/images/axs.png", gecko:"axie-inifinity"},
  11: { name: "UNI", image:"https://app.pikaprotocol.com/images/uni.png" , gecko: "uniswap"},
  12: { name: "OP" , image:"https://app.pikaprotocol.com/images/op.png",gecko: "optimism"},
  13: { name: "DOGE", image:"https://assets.coingecko.com/coins/images/5/small/dogecoin.png?1547792256",gecko:"dogecoin" },
  14: { name: "CRV" , image:"https://app.pikaprotocol.com/images/crv.png",gecko:"curve-dao-token"},
  15: { name: "NEAR" , image:"https://app.pikaprotocol.com/images/near.png",gecko:"near"},
  16: { name: "ATOM" , image:"https://app.pikaprotocol.com/images/atom.png",gecko:"cosmos-hub"},
  17: { name: "EUR" , image:"https://app.pikaprotocol.com/images/EUR.svg"},
  18: { name: "JPY", image:"https://app.pikaprotocol.com/images/JPY.png" },
  19: { name: "GBP" , image:"https://app.pikaprotocol.com/images/GBP.png"},
  20: { name: "AUD" , image:"https://app.pikaprotocol.com/images/AUD.png"},
  21: { name: "CAD", image:"https://app.pikaprotocol.com/images/CAD.png" },
  22: { name: "BNB",image:"https://app.pikaprotocol.com/images/bnb.png" ,gecko:"bnb"},
  23: { name: "DYDX" , image:"https://s2.coinmarketcap.com/static/img/coins/64x64/11156.png",gecko:"dydx"},
  24: { name: "FTM" , image:"https://app.pikaprotocol.com/images/ftm.png",gecko:"fantom"},
  25: { name: "SAND", image:"https://app.pikaprotocol.com/images/sand.png" ,gecko:"the-sandbox"},
  26: { name: "ARB",image:"https://app.pikaprotocol.com/images/arbitrum.png" ,gecko:"arbitrum"},
  27: {name: "PEPE", image:"https://assets.bit2me.com/assets/images/crypto-icons/v7/pepe-circle-solid-default.svg",gecko:"pepe"},
  28: { name: "GMX",image:"https://www.pikaprotocol.com/images/gmx.svg" ,gecko:"gmx"},
  29: { name: "WLD",image:"https://assets.coingecko.com/coins/images/31069/standard/worldcoin.jpeg?1696529903" ,gecko:"worldcoin-wld"},
  30: { name: "ETHBTC",image:"https://www.pikaprotocol.com/images/eth-btc.png" ,gecko:""},
  31: { name: "MKR",image:"https://www.pikaprotocol.com/images/mkr.svg" ,gecko:"maker"},
  32: { name: "XRP",image:"https://www.pikaprotocol.com/images/xrp.svg" ,gecko:"ripple"},
  33: { name: "LTC",image:"https://www.pikaprotocol.com/images/ltc.svg" ,gecko:"litecoin"},
  34: { name: "LDO",image:"https://www.pikaprotocol.com/images/ldo.svg" ,gecko:"lido-dao"},
  35: { name: "SEI",image:"https://www.pikaprotocol.com/images/sei.png" ,gecko:"sei-network"},
  36: { name: "APT",image:"https://www.pikaprotocol.com/images/apt.png" ,gecko:"aptos"},
  37: { name: "RUNE",image:"https://www.pikaprotocol.com/images/rune.png" ,gecko:"thorchain"},
  38: { name: "BCH",image:"https://www.pikaprotocol.com/images/bch.png" ,gecko:"bitcoin-cash"},
  39: { name: "BLUR",image:"https://www.pikaprotocol.com/images/blur.png" ,gecko:"blur"},
  40: { name: "XAU",image:"https://www.pikaprotocol.com/images/xau.svg" ,gecko:""},
  41: { name: "XAG",image:"https://www.pikaprotocol.com/images/xag.svg" ,gecko:""},
  42: { name: "DOT",image: "https://www.pikaprotocol.com/images/dot.svg", gecko: "polkadot" },
  43: { name: "SUI",image: "https://www.pikaprotocol.com/images/sui.svg", gecko: "sui" },
  44: { name: "ADA" ,image: "https://www.pikaprotocol.com/images/ada.svg", gecko: "cardano"},
  45: { name: "TON" ,image: "https://www.pikaprotocol.com/images/ton.svg", gecko: "the-open-network"},
  46: { name: "TIA" ,image: "https://www.pikaprotocol.com/images/tia.png", gecko: "celestia" },
  47: { name: "MEME"  ,image: "https://www.pikaprotocol.com/images/meme.png", gecko: "memecoin-2"},
  48: { name: "RLB"  ,image: "https://www.pikaprotocol.com/images/rlb.svg", gecko: "rollbit-coin"},
  49: { name: "PYTH" ,image: "https://www.pikaprotocol.com/images/pyth.png", gecko: "pyth-network" },
  50: { name: "ORDI"  ,image: "https://www.pikaprotocol.com/images/ordi.png", gecko: "ordinals"}
  
};

// 16: {
//   symbol: "ETH",
//   geckoID: "ethereum",
//   icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Ethereum_logo_translucent.svg/1202px-Ethereum_logo_translucent.svg.png",
// },
// 17: {
//   symbol: "BTC",
//   geckoID: "bitcoin",
//   icon: "https://logos-world.net/wp-content/uploads/2020/08/Bitcoin-Emblem.png",
// },
// 18: {
//   symbol: "LINK",
//   geckoID: "chainlink",
//   icon: "https://cryptologos.cc/logos/chainlink-link-logo.png",
// },
// 19: {
//   symbol: "SNX",
//   geckoID: "havven",
//   icon: "https://cryptologos.cc/logos/synthetix-network-token-snx-logo.png",
// },
// 20: {
//   symbol: "SOL",
//   geckoID: "solana",
//   icon: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
// },
// 21: {
//   symbol: "AVAX",
//   geckoID: "avalanche-2",
//   icon: "https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=022",
// },
// 22: {
//   symbol: "MATIC",
//   geckoID: "matic-network",
//   icon: "https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/DPYBKVZG55EWFHIK2TVT3HTH7Y.png",
// },
// 23: {
//   symbol: "AAVE",
//   geckoID: "aave",
//   icon: "https://cryptologos.cc/logos/aave-aave-logo.png",
// },
// 24: {
//   symbol: "APE",
//   geckoID: "apecoin",
//   icon: "https://thegivingblock.com/wp-content/uploads/2022/03/APECOIN.png",
// },
// 25: {
//   symbol: "AXS",
//   geckoID: "axie-infinity",
//   icon: "https://simpleswap.io/static/img/currencies/axs.svg",
// },
// 26: {
//   symbol: "UNI",
//   geckoID: "uniswap",
//   icon: "https://lh3.googleusercontent.com/ONZYvg_BD8Wym3VF0drcWCK-ONcOBt2gMFqh4q46TBlHpvGMGH6W59q93jZc7jYR3FYBinrZXOEgYM5LcILkUXEe0C5DBQ4zL5tN3g=w303",
// },

export { CONTRACT, EVENTS, PRODUCTS };
