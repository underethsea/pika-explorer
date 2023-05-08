// import dotenv from "dotenv";
// dotenv.config();
import {ethers} from 'ethers'

const optimismEndpoint = "https://opt-mainnet.g.alchemy.com/v2/" + "7jP1o6CcxN7uRt7ACbAp8P_OT6WsnG4R"

const PROVIDER = {
  OPTIMISM: new ethers.providers.JsonRpcProvider(optimismEndpoint),
};

export { PROVIDER };
