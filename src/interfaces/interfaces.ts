export interface IToy {
  num:string,
  name:string,
  count:string,
  year:string,
  shape:string,
  color:string,
  size:string,
  favorite:boolean,
  favoriteUser:boolean
}

export interface ITree {
  treeSRC: string,
  treeBG: string,
  treeGirland: boolean,
  treeColorGirland: string,
  treeInnerToys: string,
  remainingToys: string,
}
