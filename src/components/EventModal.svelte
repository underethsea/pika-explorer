<script>
  import { GetProduct, Commas, EightLessDecimalsPrecise, EightLessDecimals} from "../utils/utils.js"
  import { createEventDispatcher } from 'svelte';

    export let isOpen = false;
    export let event = {};
  
    const dispatch = createEventDispatcher();

    const handleClose = () => {
  dispatch('close');
  isOpen = false
};
  </script>
  
  {#if isOpen}
  {console.log(event)}
  {console.log(event.margin)}
  <div class="modal">
    <div class="modal-content">
      <span class="close" on:click={handleClose}>&times;</span>
      <h2>{event.type} {event.type === "LIQUIDATED" || event.type === "CLOSE" ? event.isLong ? "LONG" : "SHORT" : ""}
         {event.productSymbol} {event.leverage} 
        &nbsp;&nbsp;<a href={"https://optimistic.etherscan.io/tx/" + event.txHash}><img src="etherscan.svg" style="width:18px"/></a></h2>
      <div class="grid">
       
        {#if event.type === "LONG" || event.type === "SHORT"}
        <div>Margin</div>
        <div style="text-align: right;">{Commas(event.margin)}</div>
        <div>Size</div>
        <div style="text-align: right;">{Commas(event.size)}</div>
        <div>Price</div>
        <div style="text-align: right;">{Commas(EightLessDecimalsPrecise(event.price))}</div>
        {#if parseFloat(event.oraclePrice/1e8).toFixed(2) !== parseFloat(event.price/1e8).toFixed(2)}
        <!-- <div>Oracle Price</div>
        
        <div style="text-align: right;">{Commas(EightLessDecimalsPrecise(event.oraclePrice))}</div> -->
        {/if}
        {:else}
        <div>Margin</div>
        <div style="text-align: right;">{Commas(event.margin)}</div>
        <div>Size</div>
        <div style="text-align: right;">{Commas(event.size)}</div>
   
        <!-- <div>Entry Price</div>
        <div style="text-align: right;">{Commas(EightLessDecimalsPrecise(event.price))}</div> -->
        
        <div>Close Price</div>
        <div style="text-align: right;">{Commas(EightLessDecimalsPrecise(event.price))}</div>
    
        <div>PNL</div>
        <div style="text-align: right;">{Commas(EightLessDecimals(event.pnl))}</div>
        {#if event.fundingPayment / 1e8 >= 1}
        <div>Funding Payment</div>
        <div style="text-align: right;">{Commas(EightLessDecimals(event.fundingPayment))}</div>
        {/if}
        {/if}
      </div>
    </div>
  </div>
  
  {/if}
  
  <style>
    .grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 10px;
}

.right-align {
  text-align: right;
}
  </style>
  