<script>

import { ethers } from "ethers";
const { BigNumber } = ethers;

  import ClaimTable from "../../components/ClaimTable.svelte";
  import { ABI } from "../../constants/abi.js";
  import { PROVIDER } from "../../constants/providers.js";
  import { EVENTS } from "../../constants/constants.js";
  import Loading from "../../components/Loading.svelte"

const airdropClaimedTopic = "0xd8138f8a3f377c5259ca548e70e4c2de94f129f5a11036a15b69513cba2b426a"
  let events = [];
  let totals = {}

  async function fetchEvents() {
    let airdropContract = new ethers.Contract(
      "0x67a9e34A763395266612FFc8c9305eB2Fca4d4bE",
      ABI.AIRDROP,
      PROVIDER.OPTIMISM
    );

    let vestesPikaContract = new ethers.Contract(
      "0x21a4a5c00ab2fd749ebec8282456d93351459f2a",
      ABI.VEST,
      PROVIDER.OPTIMISM
    );


    const airdropClaimedFilter = {
      address: "0x67a9e34A763395266612FFc8c9305eB2Fca4d4bE",
      topics: [airdropClaimedTopic],
      fromBlock: -200000,
      toBlock: "latest",
    };
    const vestesPikaFilter = {
      address: "0x21a4a5c00ab2fd749ebec8282456d93351459f2a",
      topics: ["0x45c072aa05b9853b5a993de7a28bc332ee01404a628cec1a23ce0f659f842ef1"],
      fromBlock: -200000,
      toBlock: "latest",
    };

  

    const airdropClaimedLogsPromise = PROVIDER.OPTIMISM.getLogs(
      airdropClaimedFilter,
      -200000,
      "latest"
    );
    const vestesPikaLogsPromise = PROVIDER.OPTIMISM.getLogs(
      vestesPikaFilter,
      -200000,
      "latest"
    );


     const [airdropClaimedEvents, vestesPikaEvents] = await Promise.all([
      airdropClaimedLogsPromise, vestesPikaLogsPromise
      ,
    ]);

    const decodedClaimLogs = airdropClaimedEvents.map((open) => {
      const decodedLog = airdropContract.interface.parseLog(open);
    
      return decodedLog.args
    });

    const decodedVestLogs = vestesPikaEvents.map((open) => {
      const decodedLog = vestesPikaContract.interface.parseLog(open);
    
      return decodedLog.args
    });
  
    // let logs = decodedOpenLogs.concat(decodedCloseLogs);
    // logs = logs.sort((a, b) => a.blockNumber - b.blockNumber).reverse();

    // Create a map of burns based on the address
const burnMap = new Map(decodedVestLogs.map(burn => [burn.user, burn.claimFee]));
console.log(burnMap)
// Iterate over the claims array and add the fee if the address exists in the burn map
const updatedClaims = decodedClaimLogs.map(claim => {
  if (burnMap.has(claim.account)) {
    const claimFee = burnMap.get(claim.account);
    return { ...claim, claimFee };
  }
  return claim;
});

const totalClaimFee = decodedVestLogs.reduce((total, claim) => {
  if (claim.claimFee) {
    return total.add(claim.claimFee); // Assuming the claimFee values are instances of the BigNumber class
  }
  return total;
}, BigNumber.from(0)); // Assuming you're using ethers.js and BigNumber class

const totalClaimed = updatedClaims.reduce((total, claim) => {
  if (claim.amount) {
    return total.add(claim.amount); // Assuming the claimFee values are instances of the BigNumber class
  }
  return total;
}, BigNumber.from(0)); // Assuming you're using ethers.js and BigNumber class

console.log("total claimed",parseInt(totalClaimed)/1e18)
console.log("total claim fee",parseInt(totalClaimFee)/1e18)

 totals = {claimed:totalClaimed,vestingFee:totalClaimFee}
console.log("totals",totals)
    events = updatedClaims.reverse()
    console.log(updatedClaims)
    // Update the events array
    $: events;
    $: totals;
  }

  fetchEvents();
</script>
<style>
    :global(html) { 
    font-family: "Inter-var", sans-serif;
      background-color: black;
    }
  </style>
  
{#if events.length > 0}
  <ClaimTable {events} {totals} />
{:else}
 
<div class="loading-spinner-container">
  <Loading size="128px" />  </div>
{/if}