<script>
  export let events = [];
  let sortOrder = null
  import { GetProductImage, GetProduct, Commas, EightLessDecimals} from "../utils/utils.js"
  import EventModal from "../components/EventModal.svelte";
  import Loading from "../components/Loading.svelte"
  import { onMount } from 'svelte';



  let selectedEvent = null
  let modalIsOpen = false

  const openModal = (event) => {
  selectedEvent = event;
  modalIsOpen = true;
}


  const columns = [
    // { label: "Transaction Hash", key: "transactionHash" },
    { label: "", key: "logo"},

    { label: "Ago", key: "timestamp"},

    { label: "Trade", key: "type" },

    // { label: "Product", key: "product" },
    // { label: "User", key: "owner" },
    { label: "Margin", key: "margin", align: "right" },
    { label: "Leverage", key: "leverage", align: "right" },
    { label: "Size", key: "size", align: "right" },
    // { label: "PnL", key: "pnl" },

  ];


  const calculateSize = (margin, leverage) => {
    const marginNum = EightLessDecimals(margin);
    const leverageNum = EightLessDecimals(leverage);
    return marginNum * leverageNum;
  };
  const intervals = [
  { label: 'y', seconds: 31536000 },
  { label: 'm', seconds: 2592000 },
  { label: 'd', seconds: 86400 },
  { label: 'h', seconds: 3600 },
  { label: 'm', seconds: 60 },
  { label: 's', seconds: 1 }
];

function timeAgo(time) {
  const seconds = Math.floor((Date.now()/1000) - time)
  const interval = intervals.find(i => i.seconds < seconds);
  const count = Math.floor(seconds / interval.seconds);
 let timeA = `${count}${interval.label}`;
 timeA = timeA.replace(" minutes", "m")
 timeA = timeA.replace(" hours","h")

 timeA = timeA.replace(" hour","h")
 timeA = timeA.replace(" seconds","s")
 timeA = timeA.replace(" ago","")
 return timeA

}


  const formatEvents = () => {
    return events.map((event) => {
      const { margin, leverage } = event;
      const size = calculateSize(margin, leverage);

      return {
        ...event,
        productSymbol: GetProduct(event.productId),
        margin: Commas(EightLessDecimals(margin)),
        leverage: EightLessDecimals(leverage) + "x",
        timestamp: timeAgo(event.timestamp),
        size: Commas(size),
      };
    });
  };
 

  // const sortedEvents = formatEvents().sort((a, b) => {
  //   const aVal = a[key];
  //   const bVal = b[key];

  //   if (aVal < bVal) {
  //     return -1 * sortDirection;
  //   } else if (aVal > bVal) {
  //     return 1 * sortDirection;
  //   } else {
  //     return 0;
  //   }
  // });

  // events = sortedEvents;



</script>


<style>
  @import '../styles/event-table.css';
</style>

 
<center>
  <h2>Recent Pika Protocol Transactions</h2>
  <table>
    <thead>
      <tr>
        <!-- <th>details</th> -->
        {#each columns as column}
        {#if column.label !== "PnL"}
          <th
            style="text-align: {column.align || 'left'}"
            >{column.label}</th
          >
          {/if}
        {/each}
      </tr>
    </thead>
    
    <tbody>
      {#each formatEvents() as event}
        <tr>
     
            {#each columns as column}
            {#if column.key === "type"}
            <td class="type-column" style="text-align: {column.align || 'left'}"  on:click={() => openModal(event)}>
             
       
          
          
               <span class="type-column">
               
                {event["type"]} 
                  {#if !event.wasLiquidated && event.pnl !== null}
                  {#if parseInt(event.pnl) < 0}
                    <img src="red.svg"/>
                   
                  {:else}
                    <img src="green.svg"/>
                  {/if}
                {/if} 
                </span>
                </td>
            
                
                <!-- {:else if column.key === "pnl"}
                <td style="text-align: {column.align || 'right'}">
                  {#if event.pnl !== null}
                  {#if parseInt(event.pnl) < 0}
                    <img src="red.svg" style="position: relative; left: -12px;"/>
                  {:else}
                    <img src="green.svg" style="position: relative; left: -12px;"/>
                  {/if}
                {/if} -->
                {:else if column.key==="logo"}
                <img src={GetProductImage(event.productId)} style="width:20px;padding-top:4px;"/>
            {:else}
              <td style="text-align: {column.align || 'left'}"
                >{event[column.key]}</td
              >
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</center>
<EventModal event={selectedEvent} isOpen={modalIsOpen} on:close={() => modalIsOpen = false}/>



