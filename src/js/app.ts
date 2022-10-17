/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-use-before-define */
import './Toys/toys.css';
import './Tree/tree.css';
import noUiSlider, { target } from 'nouislider';
import '../../node_modules/nouislider/dist/nouislider.css';
import gsap from 'gsap';
import { IToy } from '../interfaces/interfaces';
import renderTreePage from './Tree/Tree';
import {
  allowedForms, allowedColors, allowedSizes, allowedFavorite, allowedFavoriteGrand,
  countFavorite, defaultSliderStartToys, defaultSliderEndToys, defaultSliderStartYear, defaultSliderEndYear,
} from './helpers/variables';

const homePage = document.querySelector('.start-page')!;
const toysPage = document.querySelector('.toys-page')!;
const treePage = document.querySelector('.tree-page')!;
let favoriteToys = JSON.parse(localStorage.getItem('favor')!) || [];
const btnsToysPage = [document.querySelector('.switch-start-page')! as HTMLElement,
  document.querySelector('.switch-page-game')! as HTMLElement];
const searchInput = document.querySelector('.header__search') as HTMLInputElement;
searchInput.addEventListener('input', () => {
  searchElementFromInput(filteredData);
});
const favoriteCountHeader = (document.querySelector('.header__select')!) as HTMLDivElement;
favoriteCountHeader.textContent = favoriteToys.length;
const selected = document.querySelector('.sort-select') as HTMLInputElement;
let allToys:Array<IToy> = [];
let filteredData:Array<IToy> = [];
btnsToysPage.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    homePage.classList.add('hidden');
    toysPage.classList.remove('hidden');
    treePage.classList.add('hidden');
    searchInput.classList.remove('hidden');
    searchInput.focus();
    createFilter();
  });
});

const countSlider = <target>document.getElementById('count-slider')!;
const yearSlider = <target>document.getElementById('year-slider')!;

let startCountToys:string | number = defaultSliderStartToys;
let endCountToys:string | number = defaultSliderEndToys;
let startYear:string | number = defaultSliderStartYear;
let endYear:string | number = defaultSliderEndYear;

const clearButton = document.querySelector('.clear') as HTMLButtonElement;
clearButton.addEventListener('click', clear);

function loadFilters() {
  const forms = JSON.parse(localStorage.getItem('forms') as string) || null;
  const colors = JSON.parse(localStorage.getItem('colors') as string) || null;
  const sizes = JSON.parse(localStorage.getItem('sizes') as string) || null;
  const sort = localStorage.getItem('sort') as string || null;
  if (forms && forms.length !== allowedForms.length) {
    forms.forEach((form:string) => {
      document.querySelector(`[data-filter='${form}']`)?.classList.add('active');
    });
  }
  if (colors && colors.length !== allowedColors.length) {
    colors.forEach((color:string) => {
      document.querySelector(`[data-color='${color}']`)?.classList.add('active');
    });
  }
  if (sizes && sizes.length !== allowedSizes.length) {
    sizes.forEach((size:string) => {
      document.querySelector(`[data-size='${size}']`)?.classList.add('active');
    });
  }
  if (sort) {
    selected.value = sort;
    changeSort(selected.value);
  }
  if (JSON.parse(localStorage.getItem('sliderCount')!)) {
    const localValue = JSON.parse(localStorage.getItem('sliderCount')!);
    startCountToys = localValue[0];
    endCountToys = localValue[1];
  }
  if (JSON.parse(localStorage.getItem('sliderYear')!)) {
    const localValue = JSON.parse(localStorage.getItem('sliderYear')!);
    startYear = localValue[0];
    endYear = localValue[1];
  }
  createSlider();
}

loadFilters();

function createSlider() {
  noUiSlider.create(countSlider, {
    start: [startCountToys, endCountToys],
    connect: true,
    range: {
      min: 1,
      max: 12,
    },
    step: 1,
  });
  noUiSlider.create(yearSlider, {
    start: [startYear, endYear],
    connect: true,
    range: {
      min: 1940,
      max: 2020,
    },
    step: 10,
  });
}

countSlider.noUiSlider!.on('update', () => {
  const countSliderGet = countSlider.noUiSlider!.get(true);
  startCountToys = typeof countSliderGet === 'object' ? countSliderGet[0] : countSliderGet;
  endCountToys = typeof countSliderGet === 'object' ? countSliderGet[1] : countSliderGet;
  const wrapperStartCount = (document.querySelector('.start-count-toys') as HTMLElement);
  wrapperStartCount.textContent = (Math.round(+(startCountToys))).toString();
  const wrapperEndCount = (document.querySelector('.end-count-toys') as HTMLElement);
  wrapperEndCount.textContent = (Math.round(+(endCountToys))).toString();
  createFilter();
});

yearSlider.noUiSlider!.on('update', () => {
  const yearSliderGet = yearSlider.noUiSlider!.get(true);
  startYear = typeof yearSliderGet === 'object' ? yearSliderGet[0] : yearSliderGet;
  endYear = typeof yearSliderGet === 'object' ? yearSliderGet[1] : yearSliderGet;
  (document.querySelector('.start-year') as HTMLElement).textContent = (Math.round(+(startYear))).toString();
  (document.querySelector('.end-year') as HTMLElement).textContent = (Math.round(+(endYear))).toString();
  createFilter();
});

const btnStartPage = document.querySelector('.header__logo')!;
btnStartPage.addEventListener('click', (e:Event) => {
  e.preventDefault();
  toysPage.classList.add('hidden');
  treePage.classList.add('hidden');
  searchInput.classList.add('hidden');
  homePage.classList.remove('hidden');
});

const btnTreePage = document.querySelector('.switch-page-tree')!;
btnTreePage.addEventListener('click', (e:Event) => {
  e.preventDefault();
  toysPage.classList.add('hidden');
  homePage.classList.add('hidden');
  renderTreePage(allToys);
  treePage.classList.remove('hidden');
});
const controlsForms = document.querySelector('.controls__forms')! as HTMLElement;
controlsForms.addEventListener('click', (e) => {
  (e.target as HTMLElement).classList.toggle('active');
  createFilter();
});
const controlsColor = document.querySelector('.controls__colors')!;
controlsColor.addEventListener('click', (e:Event) => {
  (e.target as HTMLElement).classList.toggle('active');
  createFilter();
});
const controlsSizes = document.querySelector('.controls__sizes')!;
controlsSizes.addEventListener('click', (e:Event) => {
  (e.target as HTMLElement).classList.toggle('active');
  createFilter();
});
const checkBoxFavorite = document.querySelector('.favorite-toys-input')!;
checkBoxFavorite.addEventListener('change', () => {
  createFilter();
});
const checkBoxFavoriteGrand = document.querySelector('.favorite-toys-input-grand')!;
checkBoxFavoriteGrand.addEventListener('change', () => {
  createFilter();
});
const buttonReset = document.querySelector('.btn-reset')!;
buttonReset.addEventListener('click', resetFilter);

function renderCardToys(data:Array<IToy>) {
  const containerCard = document.querySelector('.card-container')!;
  if (data.length === 0) {
    containerCard.innerHTML = '<div class="error">Извините, совпадений не найдено</div>';
  } else {
    containerCard.innerHTML = '';
    data.forEach((item: IToy) => {
      let ribbonClass = 'ribbon';
      const card = document.createElement('div');
      card.classList.add('card-item');
      let favoriteUser = 'нет';
      const favorite = (item.favorite === false) ? 'нет' : 'да';
      if (item.favoriteUser) {
        favoriteUser = 'да';
        ribbonClass = 'ribbon favorite';
      }
      card.innerHTML = `<h3 class='card-title'>${item.name}</h3>
                          <div class='card-item-description'>
                          <img src='./assets/toys/${item.num}.png' alt='toys' />
                          <div class='card-description'>
                            <p class='count'>Количество: <span>${item.count}</span></p>
                            <p class='year'>Год: <span>${item.year}</span></p>
                            <p class='shape'>Форма: <span>${item.shape}</span></p>
                            <p class='size'>Размер: <span>${item.size}</span></p>
                            <p class='favorite'>Любимая: <span>${favoriteUser}</span></p>
                            <p class='favorite-grand'>Любимая бабушки: <span>${favorite}</span></p>
                          </div>
                        </div>
                        <div class='${ribbonClass}'>
                          <span></span>
                        </div>`;
      containerCard.append(card);
      card.addEventListener('click', () => {
        addFavorite(card, item.num);
      });
    });
  }
  createAnimation();
}

async function getData() {
  const res = await fetch('./data/data.json');
  const data = await res.json();
  allToys = data;
  allToys.forEach((item) => {
    if (favoriteToys.includes(item.num)) {
      item.favoriteUser = true;
    }
  });
  renderCardToys(allToys);
}

getData();

function addFavorite(card:HTMLElement, num:string) {
  const ribbon = card.querySelector('.ribbon')!;
  if (favoriteToys.includes(num)) {
    ribbon.classList.remove('favorite');
    allToys[Number(num) - 1].favoriteUser = false;
    if (favoriteToys.includes(num)) {
      favoriteToys.splice(favoriteToys.indexOf(num), 1);
    }
    card.querySelector('.favorite')!.innerHTML = 'Любимая: <span>нет</span>';
  } else if (favoriteToys.length >= countFavorite) {
    window.scrollTo(0, 0);
    openModal();
  } else {
    allToys[Number(num) - 1].favoriteUser = true;
    ribbon.classList.add('favorite');
    if (!favoriteToys.includes(num)) {
      favoriteToys.push(num);
    }
    card.querySelector('.favorite')!.innerHTML = 'Любимая: <span>да</span>';
  }
  localStorage.setItem('favor', JSON.stringify(favoriteToys));
  favoriteCountHeader.textContent = favoriteToys.length;
}

function openModal() {
  const modal = document.querySelector('.modal')!;
  const overlay = document.querySelector('.modal-overlay')!;
  modal.classList.add('active');
  overlay.classList.add('active');
  const closeBtn = modal.querySelector('.close')!;
  closeBtn.addEventListener('click', closeModal);
}

function closeModal() {
  const modal = document.querySelector('.modal')!;
  const overlay = document.querySelector('.modal-overlay')!;
  modal.classList.remove('active');
  overlay.classList.remove('active');
}

function searchElementFromInput(data:Array<IToy>) {
  if (searchInput.value !== '') {
    const result = data.filter((item:IToy) => (item.name.toLowerCase().includes(searchInput.value.toLowerCase())));
    renderCardToys(result);
  } else {
    createFilter();
  }
}

function applyFilter(forms:Array<string>, colors:Array<string>,
  sizes:Array<string>, favorite:Array<boolean>, favoriteGrand:Array<boolean>, select:string) {
  (document.querySelector('.header__search') as HTMLInputElement).value = '';
  filteredData = allToys.filter(
    (item) => (forms.indexOf(item.shape) !== -1
      && colors.indexOf(item.color) !== -1
      && sizes.indexOf(item.size) !== -1
      && favorite.indexOf(item.favoriteUser) !== -1
      && favoriteGrand.indexOf(item.favorite) !== -1
      && item.count >= startCountToys
      && item.count <= endCountToys
      && item.year >= startYear
      && item.year <= endYear
    ),
  );
  changeSort(select);
  return filteredData;
}

function createFilter() {
  let forms:Array<string> = [];
  let colors:Array<string> = [];
  let sizes:Array<string> = [];
  let favorite = [(document.querySelector('.favorite-toys-input') as HTMLInputElement).checked];
  let favoriteGrand = [(document.querySelector('.favorite-toys-input-grand') as HTMLInputElement).checked];
  if (!favorite[0]) {
    (favorite = allowedFavorite);
  }
  if (!favoriteGrand[0]) {
    (favoriteGrand = allowedFavoriteGrand);
  }
  const activeForms = Array.from(document.querySelectorAll('.forms-item.active')) as HTMLElement[];
  activeForms.forEach((form) => {
    if (form.dataset.filter) {
      forms.push(form.dataset.filter);
    }
  });
  const activeColors = Array.from(document.querySelectorAll('.colors-item.active')) as HTMLElement[];
  activeColors.forEach((color) => {
    if (color.dataset.color) {
      colors.push(color.dataset.color);
    }
  });
  const activeSizes = Array.from(document.querySelectorAll('.sizes-item.active')) as HTMLElement[];
  activeSizes.forEach((size) => {
    if (size.dataset.size) {
      sizes.push(size.dataset.size);
    }
  });
  if (forms.length === 0) {
    forms = allowedForms;
  }
  if (colors.length === 0) {
    colors = allowedColors;
  }
  if (sizes.length === 0) {
    sizes = allowedSizes;
  }
  filteredData = applyFilter(
    forms,
    colors,
    sizes,
    favorite,
    favoriteGrand,
    selected.value,
  );
  saveLocal(forms, colors, sizes, favorite, favoriteGrand, selected.value);
  renderCardToys(filteredData);
}

function saveLocal(forms:Array<string>, colors:Array<string>,
  sizes:Array<string>, favorite:Array<boolean>, favoriteGrand:Array<boolean>, select:string) {
  localStorage.setItem('forms', JSON.stringify(forms));
  localStorage.setItem('colors', JSON.stringify(colors));
  localStorage.setItem('sizes', JSON.stringify(sizes));
  localStorage.setItem('favorite', JSON.stringify(favorite));
  localStorage.setItem('favoriteGrand', JSON.stringify(favoriteGrand));
  localStorage.setItem('sort', select);
  localStorage.setItem('sliderCount', JSON.stringify([startCountToys, endCountToys]));
  localStorage.setItem('sliderYear', JSON.stringify([startYear, endYear]));
}

selected.addEventListener('change', () => {
  changeSort(selected.value);
});

function changeSort(value = 'sort-name-max') {
  if (value === 'sort-name-max') {
    filteredData = filteredData.sort((a, b) => (a.name > b.name ? 1 : -1));
    renderCardToys(filteredData);
  } else if (value === 'sort-name-min') {
    filteredData = filteredData.sort((a, b) => (a.name < b.name ? 1 : -1));
    renderCardToys(filteredData);
  } else if (value === 'sort-year-max') {
    filteredData = filteredData.sort((a, b) => (+(a.year) > +(b.year) ? 1 : -1));
    renderCardToys(filteredData);
  } else if (value === 'sort-year-min') {
    filteredData = filteredData.sort((a, b) => (+(a.year) < +(b.year) ? 1 : -1));
    renderCardToys(filteredData);
  }
  localStorage.setItem('sort', selected.value);
}

function resetFilter() {
  const buttonsForms = document.querySelectorAll('.forms-item');
  buttonsForms.forEach((btn) => { btn.classList.remove('active'); });
  const buttonsColors = document.querySelectorAll('.colors-item');
  buttonsColors.forEach((btn) => { btn.classList.remove('active'); });
  const buttonsSizes = document.querySelectorAll('.sizes-item');
  buttonsSizes.forEach((btn) => { btn.classList.remove('active'); });
  (document.querySelector('.favorite-toys-input') as HTMLInputElement).checked = false;
  (document.querySelector('.favorite-toys-input-grand') as HTMLInputElement).checked = false;
  countSlider.noUiSlider!.set([defaultSliderStartToys, defaultSliderEndToys]);
  yearSlider.noUiSlider!.set([defaultSliderStartYear, defaultSliderEndYear]);
  createFilter();
  changeSort(selected.value);
}

function clear() {
  favoriteToys = [];
  favoriteCountHeader.textContent = '0';
  selected.value = 'sort-name-max';
  allToys.forEach((toy) => {
    toy.favoriteUser = false;
  });
  filteredData = allToys;
  resetFilter();
  localStorage.clear();
}

function createAnimation() {
  gsap.to('.card-item', {
    x: 0,
    y: 0,
    duration: 1,
    stagger: 0.1,
    scale: 1,
  });
}
