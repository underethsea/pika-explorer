<script>
      import { Commas, EightLessDecimalsPrecise, EightLessDecimals} from "../utils/utils.js"
      import { createEventDispatcher } from 'svelte';

    import { onMount } from 'svelte';
    import axios from 'axios';
    let openPositions = 0;
  let openInterest = 0;
  let shortOpenInterest = 0;
  let longOpenInterest = 0;
  let longShortRatio = 0;
  let longAvgLeverage = 0;
  let shortAvgLeverage = 0;
async function GetPositions() {
  const maxPageSize = 900;
  const subgraphURL =
    "https://api.thegraph.com/subgraphs/name/ethandev0/pikaperpv4_optimism";
  let data;
  let results = [];

  // new subgraph uses delegateBalance() but old subgraph was twab()
  while (true) {
    const queryString = `{positions(first: ${maxPageSize}) {
        isLong
        leverage
        margin
        amount
      }}`;

    try {
      const response = await axios.post(subgraphURL, { query: queryString });
      data = response.data;
    } catch (error) {
      console.error("GraphQL query error:", error);
      break;
    }

    // console.log(data);
    results.push(...data.data.positions);

    const numberOfResults = data.data.positions.length;
    if (numberOfResults < maxPageSize) {
      // We have retrieved all the results
      break;
    }

    lastId = data.data.accounts[data.data.positions.length - 1].id;
  }
  // console.log(results)

  openPositions = 0;
  openInterest = 0;
  shortOpenInterest = 0;
  longOpenInterest = 0;
  let shortamts = [];
  let shortlev = [];
  let longamts = [];
  let longlev = [];
  

  for (const trade of results) {
    openPositions += 1;
    openInterest += parseInt(trade.amount);

    if (trade.isLong === false) {
      shortOpenInterest += parseInt(trade.amount);
      shortamts.push(parseInt(trade.amount));
      shortlev.push(parseInt(trade.leverage));
    } else {
      longOpenInterest += parseInt(trade.amount);
      longamts.push(parseInt(trade.amount));
      longlev.push(parseInt(trade.leverage));
    }
  }

  const longsum_amount_leverage = longlev.reduce(
    (sum, leverage, index) => sum + leverage * longamts[index],
    0
  );
  const shortsum_amount_leverage = shortlev.reduce(
    (sum, leverage, index) => sum + leverage * shortamts[index],
    0
  );
  longAvgLeverage = longsum_amount_leverage / longOpenInterest / Math.pow(10, 8);
  shortAvgLeverage = shortsum_amount_leverage / shortOpenInterest / Math.pow(10, 8);
  longShortRatio = (longOpenInterest / shortOpenInterest).toFixed(2);

  console.log("Open Positions:", openPositions);
  console.log("Open Interest:", parseInt(openInterest / 1e8));
  console.log("Short Open Interest:", parseInt(shortOpenInterest / 1e8));
  console.log("Long Open Interest:", parseInt(longOpenInterest / 1e8));
  console.log("Long/Short Ratio:", longShortRatio);
  console.log(
    "Vol Weighted Avg Long Leverage:",
    longAvgLeverage.toFixed(2) + "x"
  );
  console.log(
    "Vol Weighted Avg Short Leverage:",
    shortAvgLeverage.toFixed(2) + "x"
  );

}
  
    onMount(GetPositions);
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
    <h2>Protocol Interest</h2>
    <div class="grid">
      <div>Open Positions</div>
      <div style="text-align: right;">{openPositions}</div>
      <div>Open Interest</div>
      <div style="text-align: right;">{Commas(EightLessDecimals(openInterest))}</div>
      <div>Short Open Interest</div>
      <div style="text-align: right;">{Commas(EightLessDecimals(shortOpenInterest))}</div>
      <div>Long Open Interest</div>
      <div style="text-align: right;">{Commas(EightLessDecimals(longOpenInterest))}</div>
      <div>Long/Short Ratio</div>
      <div style="text-align: right;">{longShortRatio}</div>
      <div>Avg Long Leverage By Vol</div>
      <div style="text-align: right;">{longAvgLeverage.toFixed(2)}x</div>
      <div>Avg Short Leverage By Vol</div>
      <div style="text-align: right;">{shortAvgLeverage.toFixed(2)}x</div>
    </div>
  </div>
  </div>
{/if}

  <style>
    .grid-container {
  display: grid;
  grid-template-columns: 3fr 2fr;
  grid-gap: 0.5rem;
  margin-top: 1rem;
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
  
  