/* eslint-disable @typescript-eslint/no-use-before-define */
import { ITree, IToy } from '../../interfaces/interfaces';
import './snow.css';
import { maxCountFavorite, countBackground } from '../helpers/variables';
import Girland from './girland/girland';

const dataTransfer = new DataTransfer();
const audioElem = document.querySelector('.music') as HTMLAudioElement;
let allToys:Array<IToy> = [];
let countSavedTree = JSON.parse(localStorage.getItem('savedTree') as string) || 0;

const snowButton = document.querySelector('.snow') as HTMLElement;
snowButton.addEventListener('click', toggleSnow);

const buttonSound = document.querySelector('.audio') as HTMLDivElement;
buttonSound.addEventListener('click', turnSound);
const girland = new Girland();

let lastTree:ITree = {
  treeSRC: '1',
  treeBG: '1',
  treeGirland: false,
  treeColorGirland: 'multicolor',
  treeInnerToys: '',
  remainingToys: '',
};

function loadSetting() {
  lastTree = JSON.parse(localStorage.getItem('lastTree')!);
  const activeTree = document.querySelector(`[data-tree='${lastTree.treeSRC}']`) as HTMLElement;
  changeTree(activeTree);
  const activeBG = document.querySelector(`[data-background='${lastTree.treeBG}`) as HTMLElement;
  changeBackground(activeBG);
  if (lastTree.treeGirland) {
    const checkboxGirland = document.querySelector('.checkbox') as HTMLInputElement;
    checkboxGirland.checked = true;
    const activeColor = document.querySelector(`[data-color='${lastTree.treeColorGirland}']`) as HTMLElement;
    girland.changeColorGirland(activeColor, lastTree);
    girland.renderGirland(lastTree.treeColorGirland);
  }
  (document.querySelector('.area') as HTMLElement).innerHTML = lastTree.treeInnerToys;
  const toys = document.querySelectorAll('.item-toys-img');
  toys.forEach((toy) => {
    (toy as HTMLElement).addEventListener('dragstart', drag);
  });
}

function renderFavoriteToys(data:Array<IToy>):void {
  const containerCardToys = document.querySelector('.favorite__toys') as HTMLElement;
  containerCardToys.innerHTML = '';
  const favoriteToys = JSON.parse(localStorage.getItem('favor')!) || [];
  if (favoriteToys.length > 0) {
    favoriteToys.forEach((toy:string) => {
      const cardToys = document.createElement('div') as HTMLDivElement;
      cardToys.classList.add('card-item-toys');
      cardToys.setAttribute('data-number', toy);
      let dopId = 1;
      let number = +data[+toy].count;
      cardToys.innerHTML = `
        <p class="item-toys-count" data-number=${toy}>${data[+toy].count}</p>`;
      while (number > 0) {
        cardToys.innerHTML += `<img class="item-toys-img" src="./assets/toys/${toy}.png" alt="favorite-toys"
        draggable='true' id='${toy}-${dopId}'/>`;
        number--;
        dopId++;
      }
      containerCardToys?.appendChild(cardToys);
    });
  } else {
    let i = 1;
    while (i <= maxCountFavorite) {
      const cardToys = document.createElement('div') as HTMLDivElement;
      cardToys.classList.add('card-item-toys');
      cardToys.setAttribute('data-number', i.toString());
      let number = +`${data[i].count}`;
      let dopId = 1;
      cardToys.innerHTML = `
        <p class="item-toys-count" data-number='${i}'>${data[i].count}</p>`;
      while (number > 0) {
        cardToys.innerHTML += `<img class="item-toys-img" src="./assets/toys/${i}.png" alt="favorite-toys"
        draggable='true' id='${i}-${dopId}'/>`;
        number--;
        dopId++;
      }
      containerCardToys?.appendChild(cardToys);
      i++;
    }
  }
  const toys = Array.from(document.querySelectorAll('.item-toys-img'));
  const tree = document.querySelector('.tree-map') as HTMLElement;
  const containerToys = document.querySelector('.favorite__toys') as HTMLElement;
  if (localStorage.getItem('lastTree')) {
    lastTree = JSON.parse(localStorage.getItem('lastTree')!);
    containerToys.innerHTML = lastTree.remainingToys;
  } else {
    lastTree.remainingToys = containerToys.innerHTML;
  }
  tree.addEventListener('dragover', allowDrop);
  containerToys.addEventListener('dragover', allowDrop);
  toys.forEach((toy) => {
    (toy as HTMLElement).addEventListener('dragstart', drag);
  });
  tree.addEventListener('drop', drop);
  (containerToys as HTMLElement).addEventListener('drop', drop);
}

function renderCardBackground():void {
  let count = 1;
  while (countBackground >= count) {
    const containerCardBackground = document.querySelector('.change-background');
    const cardBackground = document.createElement('div');
    cardBackground.classList.add('background-item');
    cardBackground.setAttribute('data-background', count.toString());
    containerCardBackground?.appendChild(cardBackground);
    count++;
  }
}

function changeTree(tree:HTMLElement) {
  const trees = document.querySelectorAll('.tree-item');
  trees.forEach((treeElem) => {
    treeElem.classList.remove('active');
  });
  tree.classList.add('active');
  const treeContainer = document.querySelector('.tree-image') as HTMLImageElement;
  treeContainer.src = `./assets/tree/${tree.getAttribute('data-tree')}.png`;
  lastTree.treeSRC = `${tree.getAttribute('data-tree')}`;
  localStorage.setItem('lastTree', JSON.stringify(lastTree));
}

function changeBackground(image:HTMLElement) {
  const backgrounds = document.querySelectorAll('.background-item');
  backgrounds.forEach((background) => {
    background.classList.remove('active');
  });
  image.classList.add('active');
  const backgroundContainer = document.querySelector('.tree-menu-container') as HTMLImageElement;
  backgroundContainer.style.backgroundImage = `url('./assets/background/${image.getAttribute('data-background')}.jpg'`;
  lastTree.treeBG = image.getAttribute('data-background')!;
  localStorage.setItem('lastTree', JSON.stringify(lastTree));
}

function mounted() {
  const containerTree = document.querySelector('.menu-container') as HTMLElement;
  containerTree.addEventListener('click', (e:Event) => {
    if ((e.target as HTMLElement).classList.contains('tree-item')) {
      changeTree(e.target as HTMLElement);
    }
  });
  const containerBackground = document.querySelector('.change-background ') as HTMLElement;
  containerBackground.addEventListener('click', (e:Event) => {
    if ((e.target as HTMLElement).classList.contains('background-item')) {
      changeBackground(e.target as HTMLElement);
    }
  });
  renderCardBackground();
  if (localStorage.getItem('lastTree')) {
    loadSetting();
  }
  if (localStorage.getItem('savedTree')) {
    const count = JSON.parse(localStorage.getItem('savedTree') as string);
    loadAllTree(count);
  }
  const checkboxGirland = document.querySelector('.checkbox') as HTMLInputElement;
  checkboxGirland.addEventListener('change', () => {
    if (checkboxGirland.checked) {
    /*   renderGirland(lastTree.treeColorGirland); */
      girland.renderGirland(lastTree.treeColorGirland);
      document.querySelector(`[data-color=${lastTree.treeColorGirland}]`)?.classList.add('active');
      lastTree.treeGirland = true;
    } else {
      const containerGirland = document.querySelector('.girland') as HTMLElement;
      containerGirland.innerHTML = '';
      const btnChangeColorGirland = document.querySelectorAll('.girland-item');
      btnChangeColorGirland.forEach((btn) => {
        btn.classList.remove('active');
      });
      lastTree.treeGirland = false;
    }
    localStorage.setItem('lastTree', JSON.stringify(lastTree));
  });
  const btnChangeColorGirland = document.querySelectorAll('.girland-item');
  btnChangeColorGirland.forEach((btn) => {
    btn.addEventListener('click', (e:Event) => {
      const color = btn.getAttribute('data-color') as string;
      girland.changeColorGirland(e.target as HTMLElement, lastTree);
      if (!checkboxGirland.checked) {
        checkboxGirland.checked = true;
      }
      lastTree.treeGirland = checkboxGirland.checked;
      localStorage.setItem('lastTree', JSON.stringify(lastTree));
      girland.renderGirland(color);
    });
  });
  const buttonReset = document.querySelector('.reset') as HTMLElement;
  buttonReset.addEventListener('click', reset);
  const buttonSave = document.querySelector('.save__tree') as HTMLElement;
  buttonSave.addEventListener('click', saveTree);
  if (localStorage.getItem('sound') === 'true') {
    buttonSound.classList.add('active');
    audioElem.play();
  }
  if (localStorage.getItem('snow') === 'true') {
    snowButton.classList.add('active');
    const snowFlake = document.querySelectorAll('.snowflake');
    snowFlake.forEach((snow) => {
      snow.classList.add('active');
    });
  }
}

export default function renderTreePage(data:Array<IToy>):void {
  const btnSnow = document.querySelector('.snow') as HTMLElement;
  btnSnow.classList.remove('hidden');
  const btnAudio = document.querySelector('.audio') as HTMLElement;
  btnAudio.classList.remove('hidden');
  const treePageContainer = document.querySelector('.tree-page')!;
  treePageContainer.innerHTML = `
   <div class="background">
   <div class="tree-container">
     <div class="tree-menu">
        <div class="menu-container tree__title">
          <div class="tree-item active" data-tree="1"></div>
          <div class="tree-item" data-tree="2"></div>
          <div class="tree-item" data-tree="3"></div>
          <div class="tree-item" data-tree="4"></div>
          <div class="tree-item" data-tree="5"></div>
          <div class="tree-item" data-tree="6"></div>
        </div>
       <div class="change-background tree__title">
        </div>
       <div class="change-girland tree__title">
         <button class="girland-item" data-color='multicolor'></button>
         <button class="girland-item" data-color='red'></button>
         <button class="girland-item" data-color='blue'></button>
         <button class="girland-item" data-color='green'></button>
         <button class="girland-item" data-color='yellow'></button>
         <label class="girland-label" for="girland-checkbox">
           <input
             type="checkbox"
             id="girland-checkbox"
             class="checkbox"/>
           <div class="slider round"></div>
         </label>
       </div>
       <button class="save__tree">Сохранить</button>
       <button class="reset">Очистить</button>
     </div>
     <div class="tree-menu-container">
       <div class="snowflakes">
       <div class="snow1 snowflake"></div>
       <div class="snow2 snowflake"></div>
       <div class="snow3 snowflake"></div>
       </div>
       <div class="girland"></div>
       <map name="tree-map" class="tree-map">
         <area class="area" coords="254,7,222,41,210,70,196,88,182,118,177,150,171,177,153,195,157,217,139,
         236,151,262,129,277, 104,298,105,325,120, 366,82,376,95,412,90,437,68,456,68,482,49,493,68,519,43,
         531,67,568,24,557,35,591,12,634,98,642,137, 659,120,689,144,701,212,670,280,675,311,689,362,690,
         406,655,477,648,485,607,482,583,474,527,449,448,370,244" shape="poly">
         </area>
       </map>
       <img class="tree-image" src="./assets/tree/1.png" alt="tree" usemap="#tree-map"/>
       </div>
     <div class="menu-favorite">
       <div class="favorite__toys tree__title"></div>
       <div class="favorite__tree tree__title">
       <div class="container-tree-decorate">
       </div>
       </div>
     </div>
   </div>
 </div>
    `;
  allToys = data;
  renderFavoriteToys(data);
  mounted();
}

function toggleSnow() {
  const snowFlake = document.querySelectorAll('.snowflake');
  if (snowButton.classList.contains('active')) {
    snowButton.classList.remove('active');
    snowFlake.forEach((snow) => {
      snow.classList.remove('active');
    });
    localStorage.setItem('snow', 'false');
  } else {
    snowButton.classList.add('active');
    snowFlake.forEach((snow) => {
      snow.classList.add('active');
    });
    localStorage.setItem('snow', 'true');
  }
}

/* DRAG and Drop */
function allowDrop(e:Event) {
  e.preventDefault();
}

function drag(e:DragEvent) {
  dataTransfer.setData('id', (e.target as HTMLElement).id);
}

function drop(e:MouseEvent) {
  const idToy = dataTransfer.getData('id');
  const dataNumber = idToy.split('-')[0];
  const moveToy = document.getElementById(idToy) as HTMLElement;
  if ((e.target as HTMLElement).classList.contains('area')) {
    const parent = moveToy.parentNode as HTMLElement;
    const countToy = parent.firstElementChild as HTMLElement;
    document.querySelector('.tree-map area')!.append(moveToy);
    const count = parent.querySelectorAll('.item-toys-img').length;
    countToy.textContent = count.toString();
    moveToy.style.left = `  ${e.pageX - moveToy.offsetWidth / 2}px`;
    moveToy.style.top = `${e.pageY - moveToy.offsetHeight - moveToy.offsetHeight}px`;
  } else {
    const parent = document.querySelector(`[data-number='${dataNumber}']`) as HTMLElement;
    parent!.append(moveToy);
    const count = parent.querySelectorAll('.item-toys-img').length;
    const countToy = (parent!.querySelector(`[data-number='${dataNumber}']`) as HTMLElement);
    countToy!.textContent = count.toString();
    moveToy.style.left = '10px';
    moveToy.style.top = '10px';
  }
  lastTree.remainingToys = (document.querySelector('.favorite__toys') as HTMLElement).innerHTML;
  const toysOfTree = document.querySelector('.tree-menu-container') as HTMLElement;
  const toys = Array.from(toysOfTree.querySelectorAll('.item-toys-img'));
  lastTree.treeInnerToys = '';
  toys.forEach((toy: { outerHTML: string; }) => {
    lastTree.treeInnerToys += toy.outerHTML;
  });
  localStorage.setItem('lastTree', JSON.stringify(lastTree));
}

function reset() {
  const tree = document.querySelector('[data-tree="1"]') as HTMLElement;
  changeTree(tree);
  const bg = document.querySelector('[data-background="1"]') as HTMLElement;
  changeBackground(bg);
  const checkboxGirland = document.querySelector('.checkbox') as HTMLInputElement;
  checkboxGirland.checked = false;
  const containerGirland = document.querySelector('.girland') as HTMLElement;
  containerGirland.innerHTML = '';
  const colors = document.querySelectorAll('.girland-item');
  colors.forEach((color) => {
    color.classList.remove('active');
  });
  (document.querySelector('.area') as HTMLElement).innerHTML = '';
  snowButton.classList.remove('active');
  buttonSound.classList.remove('active');
  audioElem.pause();
  const snowFlake = document.querySelectorAll('.snowflake');
  snowFlake.forEach((snow) => {
    snow.classList.remove('active');
  });
  const containerDecorate = document.querySelector('.container-tree-decorate') as HTMLDivElement;
  containerDecorate.innerHTML = '';
  countSavedTree = 0;
  lastTree = {
    treeSRC: '1',
    treeBG: '1',
    treeGirland: false,
    treeColorGirland: 'multicolor',
    treeInnerToys: '',
    remainingToys: '',
  };
  localStorage.clear();
  renderFavoriteToys(allToys);
}

function turnSound():void {
  if (buttonSound.classList.contains('active')) {
    buttonSound.classList.remove('active');
    audioElem.pause();
    localStorage.setItem('sound', JSON.stringify(false));
  } else {
    buttonSound.classList.add('active');
    audioElem.play();
    audioElem.addEventListener('ended', () => {
      audioElem.play();
    });
    localStorage.setItem('sound', JSON.stringify(true));
  }
}

function saveTree() {
  const containerDecorate = document.querySelector('.container-tree-decorate') as HTMLDivElement;
  let countTree = containerDecorate.children.length;
  if (countTree === 0) {
    countTree = 1;
  } else {
    countTree++;
  }
  const decorateTree = document.createElement('div');
  decorateTree.classList.add('tree-decorate');
  decorateTree.setAttribute('data-tree', `${countTree}`);
  const imageTree = document.createElement('img');
  imageTree.src = (document.querySelector('.tree-image') as HTMLImageElement).src;
  decorateTree.appendChild(imageTree);
  containerDecorate.appendChild(decorateTree);
  const trees = document.querySelectorAll('.tree-decorate');
  trees.forEach((tree) => {
    tree.addEventListener('click', (e) => {
      loadTree(e);
    });
  });
  countSavedTree++;
  localStorage.setItem(`tree${countTree}`, JSON.stringify(lastTree));
  localStorage.setItem('savedTree', countSavedTree);
}

function loadAllTree(count:number) {
  let index = 1;
  while (index <= count) {
    const treeFromLocalStorage = JSON.parse(localStorage.getItem(`tree${index}`)!);
    const decorateTree = document.createElement('div');
    decorateTree.classList.add('tree-decorate');
    decorateTree.setAttribute('data-tree', `${index}`);
    const imageTree = document.createElement('img');
    decorateTree.appendChild(imageTree);
    imageTree.src = `../assets/tree/${treeFromLocalStorage.treeSRC}.png`;
    (document.querySelector('.container-tree-decorate') as HTMLElement).appendChild(decorateTree);
    index++;
  }
  const trees = document.querySelectorAll('.tree-decorate');
  trees.forEach((tree) => {
    tree.addEventListener('click', (e) => {
      loadTree(e);
    });
  });
}

function loadTree(e:Event) {
  let tree = e.target as HTMLElement;
  if (!tree.classList.contains('tree-decorate')) {
    tree = tree.parentNode as HTMLElement;
  }
  const treeLoadFromLocalStorage = JSON.parse(localStorage.getItem(`tree${tree.getAttribute('data-tree')}`)!);
  const activeTree = document.querySelector(`[data-tree='${treeLoadFromLocalStorage.treeSRC}`) as HTMLElement;
  changeTree(activeTree);
  (document.querySelector('.area') as HTMLElement).innerHTML = `${treeLoadFromLocalStorage.treeInnerToys}`;
  const checkboxGirland = document.querySelector('.checkbox') as HTMLInputElement;
  const colors = document.querySelectorAll('.girland-item');
  colors.forEach((color) => {
    color.classList.remove('active');
  });
  if (treeLoadFromLocalStorage.treeGirland === true) {
    checkboxGirland.checked = true;
    const colorActiveButton = document.querySelector(`[data-color='${treeLoadFromLocalStorage.treeColorGirland}']`);
    (colorActiveButton as HTMLElement).classList.add('active');
    girland.renderGirland(treeLoadFromLocalStorage.treeColorGirland);
  } else {
    checkboxGirland.checked = false;
    const containerGirland = document.querySelector('.girland') as HTMLElement;
    containerGirland.innerHTML = '';
  }
  const bg = document.querySelector(`[data-background='${treeLoadFromLocalStorage.treeBG}']`) as HTMLElement;
  changeBackground(bg);
  const favoriteToys = document.querySelector('.favorite__toys') as HTMLElement;
  favoriteToys.innerHTML = treeLoadFromLocalStorage.remainingToys;
  const toys = document.querySelectorAll('.item-toys-img');
  toys.forEach((toy) => {
    (toy as HTMLElement).addEventListener('dragstart', drag);
  });
  lastTree = JSON.parse(localStorage.getItem(`tree${tree.getAttribute('data-tree')}`)!);
  localStorage.setItem('lastTree', JSON.stringify(lastTree));
}
