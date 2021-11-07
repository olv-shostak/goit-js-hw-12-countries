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
  searchForm: document.querySelector('.search-form'),
  listCard: document.querySelector('.card-list'),
  form: document.querySelector('.form-control'),
};

refs.searchForm.addEventListener('input', _.debounce(onSearch, 500));
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
  const searchQuery = e.target.value;
  return fetchCountries(searchQuery).then(renderCard);
}

function renderCard(country) {
  let markup;
  console.log(country);
  if (country.length === 1) {
    markup = countryCard(country[0]);
  } else if (country.length < 11) {
    markup = countryList(country);
  } else {
    pnotify();
    return (refs.container.innerHTML = '');
  }

  return (refs.container.innerHTML = markup);
}

function pnotify() {
  error({
    text: 'Too many matches found. Please enter a more specific query!',
    delay: 3000,
  });
}
