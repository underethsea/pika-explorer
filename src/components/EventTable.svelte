<script>
  export let events = [];
  let sortOrder = null
  import { GetProduct, Commas, EightLessDecimals} from "../utils/utils.js"
  import EventModal from "../components/EventModal.svelte";

  let selectedEvent = null
  let modalIsOpen = false

  const openModal = (event) => {
  selectedEvent = event;
  modalIsOpen = true;
}

  const columns = [
    // { label: "Transaction Hash", key: "transactionHash" },
    { label: "Trade", key: "type" },
    { label: "Product", key: "product" },
    { label: "User", key: "user" },
    { label: "Margin", key: "margin", align: "right" },
    { label: "Leverage", key: "leverage", align: "right" },
    { label: "Size", key: "size", align: "right" },
  ];


  const calculateSize = (margin, leverage) => {
    const marginNum = EightLessDecimals(margin);
    const leverageNum = EightLessDecimals(leverage);
    return marginNum * leverageNum;
  };

  const formatEvents = () => {
    return events.map((event) => {
      const { margin, leverage } = event;
      const size = calculateSize(margin, leverage);

      return {
        ...event,
        product: GetProduct(event.productId),
        margin: Commas(EightLessDecimals(margin)),
        leverage: EightLessDecimals(leverage) + "x",
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

{#if events.length > 0}
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
            {#if column.key === "user"}
              <td style="text-align: {column.align || 'left'}"
                >
                <a
                  href="https:/optimistic.etherscan.io/address/{event['user']}"
                  target="_blank"
                >
                  {event[column.key].slice(0, 8)}</a
                ></td
              >
            {:else if column.key === "type"}
              <td style="text-align: {column.align || 'left'}"  on:click={() => openModal(event)}
                >
                
                <!-- <a
                  href="https:/optimistic.etherscan.io/tx/{event[
                    'transactionHash'
                  ]}"
                  target="_blank"
                > -->
                  {event["type"]}
                  <!-- </a
                > -->
                
                </td
              >
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


{:else}
  <p>Loading...</p>
{/if}
