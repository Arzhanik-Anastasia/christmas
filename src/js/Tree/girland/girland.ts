import { ITree } from '../../../interfaces/interfaces';
import { levelGirland, lightToLevelGirland } from '../../helpers/variables';
import './girland.css';

export default class Girland {
  constuctor():void {}

  renderGirland(color:string):void {
    const containerGirland = document.querySelector('.girland') as HTMLElement;
    containerGirland.innerHTML = '';
    let width = 110;
    let height = 110;
    let countLevel = 0;
    let translate = 30;
    let distanceBetweenLevelGirland = 50;
    const distanceBetweenTranslate = 20;
    const distanceBetweenRotate = 30;
    while (countLevel < levelGirland) {
      let countLight = 0;
      let rotate = 10;
      const level = document.createElement('ul');
      level.classList.add('level-girland');
      level.style.width = `${width}px`;
      level.style.height = `${height}px`;
      width += distanceBetweenLevelGirland;
      height += distanceBetweenLevelGirland;
      containerGirland.appendChild(level);
      countLevel++;
      while (countLight < lightToLevelGirland) {
        const lightElem = document.createElement('li');
        lightElem.classList.add('light');
        lightElem.classList.add(`${color}`);
        lightElem.style.transform = `rotate(${rotate}deg) translate(${translate}px) rotate(${-rotate}deg)`;
        level.appendChild(lightElem);
        countLight++;
        rotate += distanceBetweenRotate;
      }
      translate += distanceBetweenTranslate;
      distanceBetweenLevelGirland += 10;
    }
  }

  changeColorGirland(color:HTMLElement, lastTree:ITree):void {
    const colors = document.querySelectorAll('.girland-item');
    colors.forEach((colorElem) => {
      colorElem.classList.remove('active');
    });
    color.classList.add('active');
    lastTree.treeColorGirland = color.getAttribute('data-color')!;
    localStorage.setItem('lastTree', JSON.stringify(lastTree));
  }
}
