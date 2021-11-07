export default function fetchCountries(value) {
    return fetch(`https://restcountries.com/v2/name/${value}`).then(response => {
      return response.json();
    });
  }