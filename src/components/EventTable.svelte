<script>
  export let events = [];
  export let totals = {}
  let sortOrder = null
  import { GetProductImage, GetProduct, Commas, EightLessDecimals} from "../utils/utils.js"
  import EventModal from "../components/EventModal.svelte";
  import ProtocolInterest from "../components/ProtocolInterest.svelte";
  import OneDay from "../components/OneDay.svelte";

  import Loading from "../components/Loading.svelte"
  import { onMount } from 'svelte';
  import { isAddress } from "ethers/lib/utils.js";
  

  // Modal state
let isProtocolOpen = false;
let interestModalIsOpen = false
let isOneDayOpen = false

// Function to open the modal
const openProtocol = () => {
  isProtocolOpen = true;
};

// Function to close the modal
const closeProtocol = () => {
  isProtocolOpen = false;
};

const closeOneDay = () => {
  isOneDayOpen = false;
};

const openOneDay = () => {
  isOneDayOpen = true;
};

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
const openInterestModal = () => {
  interestModalIsOpen = true;
}

const unrealizedPnl = (openPrice,currentPrice,amount) => {
  const amount8 = amount /1e8
  const openPrice8 = openPrice /1e8
  const shares = amount8 / openPrice8; // Calculate the number of shares
  const uPnl = (currentPrice - openPrice8) * shares
  return uPnl
  // return currentPrice - openPrice8 * shares
}
  const columns = [
    // { label: "Transaction Hash", key: "transactionHash" },
    { label: "", key: "logo"},

    { label: "Ago", key: "time"},

    { label: "Trade", key: "type" },

    // { label: "Product", key: "product" },
    // { label: "User", key: "owner" },
    { label: "Margin", key: "margin", align: "right" },
    { label: "Leverage", key: "leverage", align: "right" },
    { label: "Size", key: "size", align: "right" },
    // { label: "positionId", key: "positionId", align: "right" },


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
console.log("events broken",events)
  const formatEvents = () => {
    return events.map((event) => {
      const { margin, leverage } = event;
      const size = calculateSize(margin, leverage);

      return {
        ...event,
        productSymbol: GetProduct(event.productId),
        margin: Commas(EightLessDecimals(margin)),
        leverage: EightLessDecimals(leverage) + "x",
        time: timeAgo(event.timestamp),
        date: new Date(event.timestamp * 1000).toLocaleString(),
        size: Commas(size),
        isAddress: true,
        // positionId: event.positionId.slice(-5),
                // positionId: event.positionId,


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
  function refreshPage() {
  let newPath = '/';
  const queryParams = new URLSearchParams(window.location.search);
  if (selectedEvent) {
    queryParams.set('address', selectedEvent.owner.substring(0, 7));
    newPath += `?${queryParams.toString()}`;
  }
  window.location.href = newPath;
}
// console.log("totals",totals)
</script>
<style>
  @import '../styles/event-table.css';
  .button {
    background-color:#d8d889;
    border-radius:10px;
    display:inline-block;
    color: black;
    padding:7px;
    font-size:13px;
    cursor:pointer;

    
  }
  .button:hover {
    background-color:#efefb4
  }
</style>



{#if events[0]?.isAddress}
<!-- <div style="position:fixed;left:5px;top:5px" on:click={refreshPage}> -->
  <a href="/" on:click|preventDefault={refreshPage}>
<img src="backarrow.svg" style="width:20px;paddingtop:10px"/></a>

<!-- </div> -->
{/if}
<center>
  <h1>
   
    Recent Pika Protocol Transactions <span style="color:{getPnlColor()};font-size:14px">
<!--       
      {Commas(parseInt(totals.pnl))}</span> -->
      {#if !events[0]?.isAddress}
<br>
      <div on:click={() => openInterestModal()} class="button">PROTOCOL INTEREST</div>&nbsp;&nbsp;&nbsp;
      <div on:click={() => openOneDay()} class="button">24HR STATS</div>
{/if}
</span>
    <!-- {#if !events[0]?.isAddress}
    <button on:click={toggleDiv} style="background-color: transparent; border: none;">
    AD
  </button>
  {/if} -->
  </h1>
  
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
        
        <th>Address</th>{/if}
        
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
                {#if event.pnl === null}
               
                {#if unrealizedPnl(event.price,event.currentPrice,event.amount) > 0}
                <span style="color:#68e268;font-size:14px">&nbsp;{unrealizedPnl(event.price,event.currentPrice,event.amount).toFixed(0)}</span>
                {:else}
                <span style="color:#fa7338;font-size:14px">&nbsp;{unrealizedPnl(event.price,event.currentPrice,event.amount).toFixed(0)}</span>
                {/if}
              
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

  <ProtocolInterest isOpen={interestModalIsOpen}  on:close={() => interestModalIsOpen = false}/>
    <OneDay isOpen={isOneDayOpen}  on:close={() => isOneDayOpen = false}/>




