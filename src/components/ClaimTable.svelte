<script>
    export let events = [];
    export let totals = {}
    let sortOrder = null
    import { GetProductImage, GetProduct, Commas, EightLessDecimals} from "../utils/utils.js"
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
      { label: "Address", key: "account"},
      { label: "Amount", key: "amount"},
      { label: "Vested", key: "claimFee"},
    ];
  
//     const intervals = [
//     { label: 'y', seconds: 31536000 },
//     { label: 'm', seconds: 2592000 },
//     { label: 'd', seconds: 86400 },
//     { label: 'h', seconds: 3600 },
//     { label: 'm', seconds: 60 },
//     { label: 's', seconds: 1 }
//   ];
  
//   function timeAgo(time) {
//     const seconds = Math.floor((Date.now()/1000) - time)
//     const interval = intervals.find(i => i.seconds < seconds);
//     const count = Math.floor(seconds / interval.seconds);
//    let timeA = `${count}${interval.label}`;
//    timeA = timeA.replace(" minutes", "m")
//    timeA = timeA.replace(" hours","h")
  
//    timeA = timeA.replace(" hour","h")
//    timeA = timeA.replace(" seconds","s")
//    timeA = timeA.replace(" ago","")
//    return timeA
  
//   }
  
  
    const formatEvents = () => {
      return events.map((event) => {
       
  
        return {
          ...event,
        //   amount: EightLessDecimals(event.amount)
        //   productSymbol: GetProduct(event.productId),
        //   margin: Commas(EightLessDecimals(margin)),
        //   leverage: EightLessDecimals(leverage) + "x",
        //   timestamp: timeAgo(event.timestamp),
        //   size: Commas(size),
        //   isAddress: true,
        };
      });
    };
   
const totalClaimed = Commas(Math.round(parseInt(totals.claimed)/1e18,2))
const totalReturned = Commas(Math.round(parseInt(totals.vestingFee)/1e18),2)
console.log("totals in component",totals)
  
  </script>
  <style>
    @import '../styles/event-table.css';
  </style>
  
  <!-- {#if events[0]?.isAddress} -->
  <!-- <div style="position:fixed;left:5px;top:5px" on:click={refreshPage}> -->
    <!-- <a href="/" on:click|preventDefault={refreshPage}>
  <img src="backarrow.svg" style="width:20px;paddingtop:10px"/></a>
   -->
  <!-- </div> -->
  <!-- {/if} -->
  
  <center>
    <h2>
      Recent Pika Airdrop Claims
      </h2>
      <span style="color:white">
 Claimed           <img src="../pika.webp" style="width:14px;" alt="pika"/>&nbsp;{totalClaimed}&nbsp;&nbsp;&nbsp;&nbsp;
Returned to Treasury {totalReturned}
</span>

    <table>
        <thead>
          <tr>
            <!-- <th>details</th> -->
            {#each columns as column}
            {#if column.key==="amount"}
            <td
            style="text-align: {column.align || 'right'}"
            >Amount</td
          >
            {:else}
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
         
          {#if column.key==="amount"}
          <td
          style="text-align: {column.align || 'right'}"
          >
          <img src="../pika.webp" style="width:14px;" alt="pika"/>

          {parseInt(event.amount)/1e18}</td
        >
        {:else if column.key==="claimFee"}
        {#if event.claimFee}
        <td
        style="text-align: {column.align || 'right'}"
        ><span style="color:red">RIP</span></td
      >
{/if}
          {:else}
        
            <td style="text-align: {column.align || 'left'}">{event[column.key]}</td>
          {/if}
        {/each}
    </tr>
         

      
      {/each}
    </tbody>
  </table>
 
 
</center>

  
  
  