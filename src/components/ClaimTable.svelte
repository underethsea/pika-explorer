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
      { label: "", key: "claimFee"},
    ];

  
  
    const formatEvents = () => {
      return events.map((event) => {
       
  
        return {
          ...event,
          account: event.account.substring(0,6)
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
   
const totalClaimed = Commas(Math.round(parseInt(totals.claimed)/1e18))
const totalReturned = Commas(Math.round(parseInt(totals.vestingFee)/1e18))
const totalStaked = Commas(Math.round(parseInt(totals.staked)/1e18))
const percentStaked = parseInt(totals.staked) / parseInt(totals.claimed)
const totalRedeemed = Commas(Math.round(parseInt(totals.redeemed) / 1e18))
const claims = totals.claims
console.log("totals in component",totals)
  
  </script>
  <style>
    @import '../styles/event-table.css';
  </style>
  
  <center>
    <h2>
      Recent Pika Airdrop Claims
      </h2>
      <span style="color:white">
    {Commas(claims)} Claimed <img src="../pika.webp" style="width:14px;" alt="pika"/>&nbsp;{totalClaimed}&nbsp;&nbsp;&nbsp;&nbsp;
    {(percentStaked * 100).toFixed(2)}% Staked <img src="../pika.webp" style="width:14px;" alt="pika"/> {totalStaked} 
    &nbsp;&nbsp;&nbsp;&nbsp;
    PIKA Redeemed <img src="../pika.webp" style="width:14px;" alt="pika"/> {totalRedeemed}
    &nbsp;&nbsp;&nbsp;&nbsp;
    Returned to Treasury <img src="../pika.webp" style="width:14px;" alt="pika"/> {totalReturned}
    
</span>
<br><br>
<table>
    <thead>
      <tr>
        <!-- <th>details</th> -->

        <th style="text-align:left;font-size:10px;">Address</th>
            <th style="text-align:right;padding-right:3px;font-size:10px;}">Amount</th>
            <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
            <th style="text-align:left;font-size:10px;">Address</th>
                <th style="text-align:right;padding-right:3px;font-size:10px;}">Amount</th>
                <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>

                <th style="text-align:left;font-size:10px;">Address</th>
        
                    <th style="text-align:right;padding-right:3px;font-size:10px;}">Amount</th>
                    <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>

                 
                    <th style="text-align:left;font-size:10px;">Address</th>
            
                        <th style="text-align:right;padding-right:3px;font-size:10px;}">Amount</th>
                        <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>

                    <th style="text-align:left;font-size:10px;">Address</th>
            
                    <th style="text-align:right;padding-right:3px;font-size:10px;}">Amount</th>
                    <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
                    <th style="text-align:left;font-size:10px;">Address</th>
            
                        <th style="text-align:right;padding-right:3px;font-size:10px;}">Amount</th>
                        <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
                        <th style="text-align:left;font-size:10px;">Address</th>

                    <th style="text-align:right;padding-right:3px;font-size:10px;}">Amount</th>
                    <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
                    <th style="text-align:left;font-size:10px;">Address</th>
            
                        <th style="text-align:right;padding-right:3px;font-size:10px;}">Amount</th>
                        <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
                        <th style="text-align:left;font-size:10px;">Address</th>


          
                        <th style="text-align:right;padding-right:3px;font-size:10px;}">Amount</th>
                        <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
                        <th style="text-align:left;font-size:10px;">Address</th>
                
                            <th style="text-align:right;padding-right:3px;font-size:10px;}">Amount</th>
                            <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
    
        
                      

          
      </tr>
    </thead><tbody>
        {#each Array(Math.ceil(formatEvents().length / 10)) as _, rowIndex}
          <tr>
            
            {#each formatEvents().slice(rowIndex * 10, rowIndex * 10 + 10) as event}
           
              <td style="text-align:left;color:#c9c5c5;font-size:8px">
               
              {event.account}
              {#if event.claimFee}
              <span style="color:red;">RIP</span>&nbsp;
            {/if}
            </td>
              <td style="text-align: right;color:#c9c5c5;font-size:8px">
                <img src="../pika.webp" style="width:5px;" alt="pika"/>
                {Math.round(parseInt(event.amount)/1e18)}
              </td>
              <td></td>
            {/each}
          </tr>
        {/each}
      </tbody>
      
</table>
 
</center>

  
  
  