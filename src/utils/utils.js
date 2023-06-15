import { PRODUCTS } from "../constants/constants.js";

  export const EightLessDecimals = (num) => {
    return Math.round(parseFloat(num) / 1e8);
   
  };

  export const EightLessDecimalsPrecise = (num) => 
  {
    num = parseFloat(num) / 1e8;
    if(num < 100) {
        return num.toFixed(2)
    }else {return Math.round(num)}
  };

  export const Commas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  export const GetProductImage = (productId) => {
    console.log("product id for image",productId)
    if (
      PRODUCTS[productId.toString()] &&
      typeof PRODUCTS[productId.toString()].name !== "undefined"
    ) {
      let returnUrl = PRODUCTS[productId.toString()]?.image
      console.log(returnUrl)
      return returnUrl
    } else {
      return productId;
    }
  }
  export const GetProduct = (productId) => {
    
    if (
      PRODUCTS[productId.toString()] &&
      typeof PRODUCTS[productId.toString()].name !== "undefined"
    ) {
      return PRODUCTS[productId.toString()].name;
    } else {
      return productId;
    }
  };
