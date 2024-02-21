<script>
import { Commas, EightLessDecimalsPrecise, EightLessDecimals} from "../utils/utils.js"
import { createEventDispatcher } from 'svelte';

import { onMount } from 'svelte';
import axios from 'axios';
let tradeCount = 0;
  let traders = [];
  let totalPnL = 0;
  let totalFees = 0;
  let totalTrades = 0;
  let uniqueTraders
  let liquidationCount
  let tradeFeesPlusLiquidationFees
async function OneDay() {
  const maxPageSize = 900;
  const oneDayAgo = parseInt(Date.now() / 1000 - 24 * 60 * 60);

  const subgraphURL =
    "https://api.thegraph.com/subgraphs/name/ethandev0/pikaperpv4_new/";
  let data;
  let transactionResults = [];
  while (true) {
    const queryString = `{
    transactions(first: ${maxPageSize},
        where: { timestamp_gt: ${oneDayAgo} }
        orderBy: timestamp
        orderDirection: desc
      ){
      id
      singleAmount
      timestamp
      tradeFee
      count
      pnl
      owner
    }
  }`;
    try {
      const response = await axios.post(subgraphURL, { query: queryString });
      data = response.data;
    } catch (error) {
      console.error("GraphQL query error:", error);
      break;
    }
    transactionResults.push(...data.data.transactions);

    const numberOfResults = data.data.transactions.length;
    if (numberOfResults < maxPageSize) {
      // We have retrieved all the results
      break;
    }
  }

 
  for (const transaction of transactionResults) {
    tradeCount++;
    totalTrades += parseInt(transaction["singleAmount"]);
    totalFees += parseInt(transaction["tradeFee"]);
    if (!traders.includes(transaction["owner"])) {
      traders.push(transaction["owner"]);
    }
    transaction["pnl"] !== null
      ? (totalPnL += parseInt(transaction["pnl"]))
      : "";
  }
  uniqueTraders = traders.length;
//   console.log("24hr PnL ", parseInt(totalPnL / 1e8));
//   console.log("24hr Traders ", uniqueTraders);
//   console.log("24hr Trade Count ", tradeCount);

  let liquidationsResult = [];

  while (true) {
    const queryString = `{
        liquidations(first: ${maxPageSize},
        where: { timestamp_gt: ${oneDayAgo} }
        orderBy: timestamp
        orderDirection: desc
      ){        remainingReward
        timestamp
      }
    }`;
    try {
      const response = await axios.post(subgraphURL, { query: queryString });
      data = response.data;
    } catch (error) {
      console.error("GraphQL query error:", error);
      break;
    }
    liquidationsResult.push(...data.data.liquidations);

    const numberOfResults = data.data.liquidations.length;
    if (numberOfResults < maxPageSize) {
      break;
    }
  }

  //   console.log(liquidationsResult);
  let remainingRewardsSum = 0;
  for (let liquidation of liquidationsResult) {
    remainingRewardsSum += parseInt(liquidation["remainingReward"]);
  }
   tradeFeesPlusLiquidationFees = totalFees + remainingRewardsSum;

   liquidationCount = liquidationsResult.length;

}

  onMount(OneDay);
  export let isOpen = false;

const dispatch = createEventDispatcher();
const handleClose = () => {
dispatch('close');
isOpen = false
};

</script>
{#if isOpen}
<div class="modal">
<div class="modal-content">
  <span class="close" on:click={handleClose}>&times;</span>
  <h2>24hr Protocol Report</h2>
  <div class="grid">
  <div class="inline">24h PnL</div><div class="inline-right">{Commas(parseInt(totalPnL/1e8))}</div>
  <div class="inline">24h Traders</div> <div class="inline-right" style="text-align: right;">{Commas(uniqueTraders) }</div>
  <div class="inline">24h Trades</div> <div  class="inline-right"> {Commas(tradeCount)}</div>
  <div class="inline"> Liquidations</div> <div class="inline-right"> {Commas(liquidationCount)}</div>
  <div class="inline">24hr Fees</div> <div  class="inline-right"> {Commas(parseInt(tradeFeesPlusLiquidationFees/1e8))}</div>
</div>
</div>
</div>


{/if}

<style>
    .inline {
    }
.inline-right {
    /* display:inline-block; */
    text-align: right;
}
.grid-container {
        grid-auto-flow: column; /* Set the flow to column */

    display: grid;
    grid-template-columns: auto auto;
    grid-row-gap: 0.5rem; /* Adjusted the gap between rows */
    margin-top: 1rem;
  }

  .grid-item {
    display: flex; /* Use flexbox to align label and value on the same line */
    align-items: center; /* Align items vertically within each grid item */
  }

  .grid-item:nth-child(odd) {
    text-align: right;
    font-weight: bold;
  }

  .grid-item:nth-child(even) {
    text-align: left;
  }

  .modal {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .modal-content {
    background-color: rgb(31, 30, 30);
    color: rgb(217, 215, 215);
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #e8d533;
    width: 332px;
    border-radius:15px;

  }

  .close {
    color: #f0eeee;
    float: right;
    font-size: 20px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: #b7b6b6;
    text-decoration: none;
    cursor: pointer;
  }

  .grid {
display: grid;
grid-template-columns: 5fr 2fr;
grid-row-gap: 10px;
}

.right-align {
text-align: right;
}
</style>

