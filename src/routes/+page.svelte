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


  let events = [];
  const oneDayAgo = parseInt((Date.now()/1000) -(24*60*60))
  const subgraphURL = "https://api.thegraph.com/subgraphs/name/ethandev0/pikaperpv3_optimism"
  // const subgraphURL = "https://api.thegraph.com/subgraphs/name/pooltogether/v5-eth-goerli-twab-controller"
  async function fetchGraphEvents() {
    console.log("graph events fetching")
    console.log("one day ago",oneDayAgo)
    const queryString = `{
  transactions(first: 200,
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
  }
}`
let trades
    try {
      const response = await axios.post(subgraphURL, { query: queryString });
      trades = response.data.data.transactions;

 console.log("trades",trades)
    } catch (error) {
      console.error("GraphQL query error:", error);
    }
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
    events = trades
    
      $: events;
    
  }
  async function fetchEvents() {
    let pikaPerp = new ethers.Contract(
      "0xD5A8f233CBdDb40368D55C3320644Fb36e597002",
      ABI.PERPV3,
      PROVIDER.OPTIMISM
    );
    const newPositionFilter = {
      address: "0xD5A8f233CBdDb40368D55C3320644Fb36e597002",
      topics: [EVENTS.NEWPOSITION.TOPIC],
      fromBlock: -200000,
      toBlock: "latest",
    };
    const closePositionFilter = {
      address: "0xD5A8f233CBdDb40368D55C3320644Fb36e597002",
      topics: [EVENTS.CLOSEPOSITION.TOPIC],
      fromBlock: -200000,
      toBlock: "latest",
    };

    //   const closeLogsPromise = pikaPerp.queryFilter(
    //     [pikaPerp.interface.getEventTopic("ClosePosition")],
    //     -200000,
    //     "latest"
    //   );
    //   const openLogsPromise = pikaPerp.queryFilter(
    //     [pikaPerp.interface.getEventTopic("NewPosition")],
    //     -200000,
    //     "latest"
    //   );

    const openLogsPromise = PROVIDER.OPTIMISM.getLogs(
      newPositionFilter,
      -200000,
      "latest"
    );

    const closeLogsPromise = PROVIDER.OPTIMISM.getLogs(
      closePositionFilter,
      -200000,
      "latest"
    );

    const [closeLogs, openLogs] = await Promise.all([
      closeLogsPromise,
      openLogsPromise,
    ]);

    const decodedOpenLogs = openLogs.map((open) => {
      const decodedLog = pikaPerp.interface.parseLog(open);
      const type = decodedLog.args.isLong ? "LONG" : "SHORT";
      return {
        blockNumber: open.blockNumber,
        transactionHash: open.transactionHash,
        type: type,
        ...decodedLog.args,
      };
    });
    const decodedCloseLogs = closeLogs.map((close) => {
      const decodedLog = pikaPerp.interface.parseLog(close);
      const type = decodedLog.args.wasLiquidated ? "LIQUIDATED" : "CLOSE";

      return {
        blockNumber: close.blockNumber,
        transactionHash: close.transactionHash,
        type: type,
        ...decodedLog.args,
      };
    });
    let logs = decodedOpenLogs.concat(decodedCloseLogs);
    logs = logs.sort((a, b) => a.blockNumber - b.blockNumber).reverse();

    // events = logs;
    // Update the events array
    // $: events;
  }
  fetchGraphEvents()
  fetchEvents();
</script>

{#if events.length > 0}
  <EventTable {events} />
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
