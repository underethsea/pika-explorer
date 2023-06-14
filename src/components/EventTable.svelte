<script>
  export let events = [];
  let sortOrder = null
  import { GetProduct, Commas, EightLessDecimals} from "../utils/utils.js"
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
    { label: "Time", key: "timestamp"},
    { label: "Trade", key: "type" },
    { label: "Product", key: "product" },
    { label: "User", key: "owner" },
    { label: "Margin", key: "margin", align: "right" },
    { label: "Leverage", key: "leverage", align: "right" },
    { label: "Size", key: "size", align: "right" },
  ];


  const calculateSize = (margin, leverage) => {
    const marginNum = EightLessDecimals(margin);
    const leverageNum = EightLessDecimals(leverage);
    return marginNum * leverageNum;
  };
  const intervals = [
  { label: 'year', seconds: 31536000 },
  { label: 'month', seconds: 2592000 },
  { label: 'day', seconds: 86400 },
  { label: 'hour', seconds: 3600 },
  { label: 'minute', seconds: 60 },
  { label: 'second', seconds: 1 }
];

function timeAgo(time) {
  const seconds = Math.floor((Date.now()/1000) - time)
  const interval = intervals.find(i => i.seconds < seconds);
  const count = Math.floor(seconds / interval.seconds);
  return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
}


  const formatEvents = () => {
    return events.map((event) => {
      const { margin, leverage } = event;
      const size = calculateSize(margin, leverage);

      return {
        ...event,
        product: GetProduct(event.productId),
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
          <th
            style="text-align: {column.align || 'left'}"
            >{column.label}</th
          >
        {/each}
      </tr>
    </thead>
    
    <tbody>
      {#each formatEvents() as event}
        <tr>
        
            {#each columns as column}
            {#if column.key === "owner"}
              <td style="text-align: {column.align || 'left'}"
                >
                <a
                  href="https:/optimistic.etherscan.io/address/{event['owner']}"
                  target="_blank"
                >
                  {event[column.key].slice(0, 8)}</a
                ></td
              >
            {:else if column.key === "type"}
              <td class="type-column" style="text-align: {column.align || 'left'}"  on:click={() => openModal(event)}>
               <span class="type-column">
                <img src="arrow.svg" style="width: 12px"/> {event["type"]} 
                </span>
                </td>
                

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



