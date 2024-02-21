<script>
  import EventTable from "../components/EventTable.svelte";
  import { ethers, BigNumber } from "ethers";
  import { fetch } from "cross-fetch";
  import axios from "axios"
  import { ABI } from "../constants/abi.js";
  import { FILTERS } from "../constants/filters.js";
  import { PROVIDER } from "../constants/providers.js";
  import { EVENTS } from "../constants/constants.js";
  import Loading from "../components/Loading.svelte"
  import { onMount } from 'svelte';
  import { afterUpdate } from 'svelte';
  import { GetGeckoPrices } from "../utils/getGeckoPrices.js"

  async function fetchPrices() {
  const prices = await GetGeckoPrices();
return prices
  }// const addAlreadyClosedProperty = (trades) => {
//   return trades.map((trade, index) => {
//     const { positionId } = trade;

//     const filteredTrades = trades.filter((_, i) => i !== index);
//     const matchingTrade = filteredTrades.find(
//       (t) => t.positionId === positionId && t.wasLiquidated !== null
//     );

//     console.log("trade",trade,"matchess",matchingTrade)
//     if (!matchingTrade) {
//       console.log("FALSE")

//       return { ...trade, alreadyClosed: "FALSE" };
//     } else if (matchingTrade.wasLiquidated) {
//       console.log("LIQUIDTAD")
//       return { ...trade, alreadyClosed: "LIQUIDATED" };
//     } else {
//       console.log("CLOSED")

//       return { ...trade, alreadyClosed: "CLOSED" };
//     }
//   });
// };


  let address

  let events = [];
  let totals = {}
  const oneDayAgo = parseInt((Date.now()/1000) -(24*60*60*3))
  const subgraphURL = "https://api.thegraph.com/subgraphs/name/ethandev0/pikaperpv4_new/"
//  https://api.thegraph.com/subgraphs/name/ethandev0/pikaperpv3_optimism"

  async function fetchGraphEvents(addressToQuery) {
    let queryString 
    if(!addressToQuery) {
     queryString = `{
  transactions(first: 820,
    where: { timestamp_gt: ${oneDayAgo} }
    orderBy: timestamp
    orderDirection: desc
  ) {
    price
    isLong
    leverage
    margin
    pnl
    owner
    amount
    timestamp
    productId
    wasLiquidated
    tradeFee
    txHash
    positionId
    singleAmount
  }
}`}else{
 queryString = `{
  transactions(
    first:300,
    orderBy: timestamp
    orderDirection: desc
    where: {owner: "${addressToQuery}"}
  ){
    price
    isLong
    leverage
    margin
    pnl
    owner
    amount
    timestamp
    productId
    wasLiquidated
    tradeFee
    txHash
    singleAmount
  }
}`}
let trades
    try {
      const response = await axios.post(subgraphURL, { query: queryString });
      trades = response.data.data.transactions;

//  console.log("trades",trades)
    } catch (error) {
      console.error("GraphQL query error:", error);
    }
    if(addressToQuery) {trades[0].isAddress=true}

    trades.map((trade,index)=>{ 
      let type
      if(trade.wasLiquidated === true) {
        type = "LIQUIDATED"
      }else if(trade.wasLiquidated === false) 
      {type = "CLOSE"}
      else if(trade.isLong === true) {
        type = "LONG"
      }
      else if (trade.isLong === false) {
        type = "SHORT"
      }
      trades[index].type = type
    })
    const totalTrades = trades.reduce((accumulator, trade) => {
  if (trade.wasLiquidated === null) {
    return accumulator + 1;
  } else {
    return accumulator;
  }
}, 0);
const totalVolume = trades.reduce((accumulator, trade) => {
      if(trade.wasLiquidated===null) {
  const size = trade.margin/1e8 * trade.leverage/1e8;
  return accumulator + size;}
  else{return accumulator}
}, 0);


const totalPnl = trades.reduce((total, trade) => {
  if (trade?.pnl !== null) {
    return total + parseInt(trade.pnl); 
  }
  return total;

}, 0); 

const totalFees = trades.reduce((total, trade) => {
  if (trade?.tradeFee !== null) {
    return total + parseInt(trade.tradeFee); 
  }
  return total;

}, 0); 

const priceMap = await fetchPrices();

console.log("trades as productid?", trades);

// Map trades to include the price based on productId
const tradesWithPrice = trades.map(trade => {
  const { productId, ...rest } = trade;
  const currentPrice = priceMap[productId];

  return { productId, currentPrice, ...rest };
});

// const tradesWithCloseInfo = addAlreadyClosedProperty(tradesWithPrice)
// console.log(tradesWithCloseInfo)


totals = { pnl: totalPnl / 1e8, trades: totalTrades, volume: totalVolume, fees: totalFees };
events = tradesWithPrice;

$: {
  events;
  totals;
}


  }

  function checkAddressParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const newAddress = urlParams.get("address");

  if (newAddress && newAddress !== address) {
    address = newAddress;
    console.log("viewing address ", address);
  }

  fetchGraphEvents(address);
}

  // Check the address parameter on component mount and after updates
  onMount(checkAddressParam);
</script>

{#if events.length > 0}
  <EventTable {events} {totals}/>
{:else}
  <div class="loading-spinner-container">
    <Loading size="128px" />
  </div>
{/if}

<style>
  :global(html) {
    font-family: "Inter-var", sans-serif;
    background-color: black;
  }
</style>
