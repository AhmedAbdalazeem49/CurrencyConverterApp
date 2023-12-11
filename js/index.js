const dropList = document.querySelectorAll(".drop-list select");

const getButton = document.querySelector("form button");

let fromCurrency = document.querySelector(".from select");

let toCurrency = document.querySelector(".to select");

let exchangeIcon = document.querySelector(".drop-list .icon");

exchangeIcon.addEventListener("click", () => {
  let temp = toCurrency.value;
  toCurrency.value = fromCurrency.value;
  fromCurrency.value = temp;
  loadFlag(toCurrency);
  loadFlag(fromCurrency);
  getExchangeRate();
});

for (let i = 0; i < dropList.length; i++) {
  for (currencyCode in countryCode) {
    // Selecting USD by default as FROM currency and NPR as To Currency
    let selected;
    if (i == 0) {
      selected = currencyCode == "USD" ? "selected" : "";
    } else if (i == 1) {
      selected = currencyCode == "NPR" ? "selected" : "";
    }
    // Creating option tag with passing currency code as a text and value.
    let optionTag = `<option value=${currencyCode} ${selected}>${currencyCode}</option>`;
    // inserting options tag inside select tag
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    // Calling loadFlag with passing target element as an argument
    loadFlag(e.target);
  });
}

function getExchangeRate() {
  let exchangeRateText = document.querySelector(".exchange-rate");
  let amount = document.querySelector(".amount input");
  let amountValue = amount.value;
  // if user don't enter any value or enter 0 then we will put 1 value be default in the input field
  if (amountValue === "" || amountValue === "0") {
    amount.value = "1";
    amountValue = 1;
  }

  exchangeRateText.innerHTML = `Getting Exchange Rate...`;

  let url = `https://v6.exchangerate-api.com/v6/d154e122fee91b24eb85fda0/latest/${fromCurrency.value}`;
  // Fetching api response and returning it with parsing into js obj and in another then method receiving that obj.
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExchangeRate = (amountValue * exchangeRate).toFixed(2);
      exchangeRateText.innerHTML = `<span class="number">${amountValue}</span> <span class="currency">${fromCurrency.value}</span>
          <span class="equal">=</span> <span class="number">${totalExchangeRate}</span>
          <span class="currency">${toCurrency.value}</span>`;
    })
    .catch(() => (exchangeRateText.innerHTML = `Something Went Wrong.`));
}

function loadFlag(element) {
  for (code in countryCode) {
    // If currency code of country list is equal to option value
    if (code === element.value) {
      // Selecting img tag of particular drop list
      let imgTag = element.parentElement.querySelector("img");
      // Passing country code of a selected currency code in a img url
      imgTag.src = `https://flagsapi.com/${countryCode[code]}/flat/64.png`;
    }
  }
}

getButton.addEventListener("click", (e) => {
  // Preventing form from submitting
  e.preventDefault();
  getExchangeRate();
});

window.addEventListener("load", () => {
  getExchangeRate();
});
