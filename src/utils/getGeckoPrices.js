import { PRODUCTS } from "../constants/constants.js";
import fetch from "cross-fetch";

export const GetGeckoPrices = async () => {
  const geckoElements = Object.values(PRODUCTS)
    .filter(element => element.gecko !== undefined)
    .map(element => element.gecko);

  const coingeckoUrl =
    "https://api.coingecko.com/api/v3/simple/price?ids=" +
    geckoElements.join(",") +
    "&vs_currencies=usd";

  try {
    const response = await fetch(coingeckoUrl);
    const data = await response.json();

    const productIdsWithPrice = Object.entries(data).map(([geckoId, priceData]) => {
      const element = Object.entries(PRODUCTS).find(
        ([id, product]) => product.gecko === geckoId
      );
      const id = element ? element[0] : undefined;
      return { id, price: priceData.usd };
    });

    // return productIdsWithPrice;
    const priceMap = {};

productIdsWithPrice.forEach(priceObj => {
  priceMap[priceObj.id] = priceObj.price;
});
return priceMap
  } catch (error) {
    console.error("Error fetching data from Coingecko API:", error);
    throw error;
  }
};
