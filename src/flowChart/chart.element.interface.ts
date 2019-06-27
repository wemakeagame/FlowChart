export interface ChartElement {
  id: number;
  nextId?: number;
  content: string;
  children?: ChartElement[];
  parent?: ChartElement;
  posX?: number;
  posY?: number;
  index?: number;
  childIndex?: number;
  width?: number;
  height?: number;
}

export interface ChartPoints {
  ax: number;
  ay: number;
  bx: number;
  by: number;
}
