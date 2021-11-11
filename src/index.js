import './sass/main.scss';
import * as _ from 'lodash';
import fetchCountries from './js/fetchCountries.js';
import countryList from './templates/country-list.hbs';
import countryCard from './templates/country-card.hbs';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  container: document.querySelector('.js-container'),
  listCard: document.querySelector('.card-list'),
  form: document.querySelector('.form-control'),
};

refs.form.addEventListener('input', _.debounce(onSearch, 500));
refs.container.addEventListener('click', onClickList);

function onClickList(e) {
  console.dir(e.target.nodeName);
  if (e.target.nodeName === 'LI') {
    const searchQuery = e.target.textContent;
    refs.form.value = searchQuery;
    fetchCountries(searchQuery).then(renderCard);
    refs.form.value = '';
  }
}

function onSearch(e) {
  e.preventDefault();
  let inputValue = e.target.value.trim();
  if (!inputValue) {
    refs.form.value = '';
    errorRequest('Invalid request. Please try again');
    return;
  };
  const searchQuery = e.target.value;
  return fetchCountries(searchQuery).then(renderCard);
}

function renderCard(country) {
  let markup;
  console.log(country);
  if (country.length === 1) {
    markup = countryCard(country[0]);
    refs.form.value = '';
  } else if (country.length <= 10 && country.length >= 2) {
    markup = countryList(country);
  } else if (country.status === 404) {
    errorRequest('Nothing found. Please try again');
    refs.form.value = '';
    return refs.container.innerHTML = '';
  } else {
    errorRequest('Too many matches found. Please enter a more specific query!');
    return (refs.container.innerHTML = '');
  }

  return (refs.container.innerHTML = markup);
}

function errorRequest(message){
  error({
    text: message,
    delay: 2500,  
  }); 
};
