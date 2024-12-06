const BASE_URL ="https://2024-03-06.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  if (!countryCode) {
    console.error(`No country code found for ${currCode}`);
    return;
  }
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};


const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  
  
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const baseCurrency = fromCurr.value.toLowerCase(); // Base currency
  const targetCurrency = toCurr.value.toLowerCase(); // Target currency
  const URL = `${BASE_URL}/${baseCurrency}.json`; // Fetch rates for base currency only

  // const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }
    let data = await response.json();  
    const exchangeRates = data[baseCurrency]; // Get rates object for base currency

    // Extract the rate for the target currency
    const rate = exchangeRates[targetCurrency];    
    if (rate) {
      let finalAmount = (amtVal * rate).toFixed(2);
      console.log(finalAmount);
      
      msg.innerText = `${amtVal} ${baseCurrency.toUpperCase()} = ${finalAmount} ${targetCurrency.toUpperCase()}`;
    } else {
      msg.innerText = `Exchange rate for ${baseCurrency.toUpperCase()} to ${targetCurrency.toUpperCase()} not found.`;
    }
   
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Unable to fetch exchange rate. Try again later.";
  }
};




for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }      
    select.append(newOption);
  }    

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });    
}    


btn.addEventListener("click", (evt) => {  
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});


