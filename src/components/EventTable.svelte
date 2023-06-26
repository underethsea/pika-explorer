<script>
  export let events = [];
  export let totals = {}
  let sortOrder = null
  import { GetProductImage, GetProduct, Commas, EightLessDecimals} from "../utils/utils.js"
  import EventModal from "../components/EventModal.svelte";
  import Loading from "../components/Loading.svelte"
  import { onMount } from 'svelte';
  import { isAddress } from "ethers/lib/utils.js";

  let showMore = false;

function toggleDiv() {
  showMore = !showMore;
}

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
        isAddress: true,
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

  function getPnlColor() {
    return totals.pnl < 0 ? "rgb(250, 115, 56)": "rgb(104, 226, 104)";
  }
  console.log("total pnl in component",totals.pnl)
  function refreshPage() {
  let newPath = '/';
  const queryParams = new URLSearchParams(window.location.search);
  if (selectedEvent) {
    queryParams.set('address', selectedEvent.owner.substring(0, 7));
    newPath += `?${queryParams.toString()}`;
  }
  window.location.href = newPath;
}

</script>
<style>
  @import '../styles/event-table.css';
</style>

{#if events[0]?.isAddress}
<!-- <div style="position:fixed;left:5px;top:5px" on:click={refreshPage}> -->
  <a href="/" on:click|preventDefault={refreshPage}>
<img src="backarrow.svg" style="width:20px;paddingtop:10px"/></a>

<!-- </div> -->
{/if}
<center>
  <h2>
   
    Recent Pika Protocol Transactions <span style="color:{getPnlColor()};font-size:14px">{Commas(EightLessDecimals(totals.pnl))}</span>
    {#if !events[0]?.isAddress}
    <button on:click={toggleDiv} style="background-color: transparent; border: none;">
    AD
  </button>
  {/if}
  </h2>
  
  {#if events[0]?.isAddress}
  <span style="color:#d5d6bb">
    <a href={"https://optimistic.etherscan.io/address/" + events[0].owner} style="text-decoration:none;color:#d5d6bb" target="_blank" referrer="norefferer">
    {events[0].owner}</a></span><br><br>
  {/if}

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
        <th></th>
        {#if !events[0]?.isAddress}
        
        <th></th>{/if}
        
      </tr>
    </thead>
    
    <tbody>
      {#each formatEvents() as event}
        <tr>
     
          {#each columns as column}
          {#if column.key === "type"}
            <td class="type-column" style="text-align: {column.align || 'left'}">
              <!-- <span class="type-column"> -->
                {event["type"]} 
                {#if event.pnl !== null && parseInt(event.pnl) < 0}
                  <!-- {#if showMore} -->
                   {" "} <span style="color:#fa7338;font-size:14px">&nbsp;{EightLessDecimals(event.pnl)}</span>
                  <!-- {:else} -->
                    <!-- <img src="red.svg" alt="red"/> -->
                  <!-- {/if} -->
                {:else if event.pnl !== null}
                  <!-- {#if showMore} -->
                  <span style="color:#68e268;font-size:14px">&nbsp;{EightLessDecimals(event.pnl)}</span>
                  <!-- {:else} -->
                    <!-- <img src="green.svg" alt="green"/> -->
                  <!-- {/if} -->
                {/if}
              <!-- </span> -->
            </td>
          {:else if column.key === "logo"}
            <td>
              <img src={GetProductImage(event.productId)} style="width:20px;padding-top:4px;"/>
            </td>
          {:else if column.key === "size"}
            <td>{event.size}</td>
            <td>
              <img src="/arrow.svg" style="width:12px;position:relative;left:-12px;cursor:pointer;" on:click={() => openModal(event)}/>
            </td>
          {:else}
            <td style="text-align: {column.align || 'left'}">{event[column.key]}</td>
          {/if}
        {/each}
        
          
        {#if events[0]?.isAddress}
        {""} 
        {:else}

  <td>
    <a href={"/?address="+event.owner} target="_blank">

   
      
      {event.owner.substring(0, 7)}</a></td>   {/if}
      </tr>
   


   
      {/each}
    </tbody>
  </table>
</center>
<EventModal event={selectedEvent} isOpen={modalIsOpen} on:close={() => modalIsOpen = false}/>



