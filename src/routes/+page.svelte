<script>
  import EventTable from "../components/EventTable.svelte";
  import { ethers } from "ethers";
  import { fetch } from "cross-fetch";
  import axios from "axios"
  import { ABI } from "../constants/abi.js";
  import { FILTERS } from "../constants/filters.js";
  import { PROVIDER } from "../constants/providers.js";
  import { EVENTS } from "../constants/constants.js";
  import Loading from "../components/Loading.svelte"
  import { onMount } from 'svelte';
  import { afterUpdate } from 'svelte';

  let address

  let events = [];
  let totals = {}
  const oneDayAgo = parseInt((Date.now()/1000) -(24*60*60))
  const subgraphURL = "https://api.thegraph.com/subgraphs/name/ethandev0/pikaperpv4_optimism"
//  https://api.thegraph.com/subgraphs/name/ethandev0/pikaperpv3_optimism"
  // const subgraphURL = "https://api.thegraph.com/subgraphs/name/pooltogether/v5-eth-goerli-twab-controller"

  async function fetchGraphEvents(addressToQuery) {
    let queryString 
    if(!addressToQuery) {
     queryString = `{
  transactions(first: 420,
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

const totalPnl = trades.reduce((total, trade) => {
  if (trade?.pnl !== null) {
    return total + parseInt(trade.pnl); 
  }
  return total;

}, 0); 

totals = {pnl: totalPnl}
    events = trades
      $: events;
      $: totals;
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
