import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  ChangeDetectorRef
} from "@angular/core";
import { ChartElement } from "./chart.element.interface";

@Component({
  selector: "flow-chart",
  templateUrl: "./flow-chart.component.html",
  styleUrls: ["./flow-chart.component.css"]
})
export class FlowChartComponent implements OnChanges {
  @Input() content: ChartElement[];
  @Input() withEl: number;
  @Input() heightEl: number;
  @Input() dinstanceElHorizontal = 40;
  @Input() dinstanceElVertical = 80;
  @Input() direction = "horizontal"; // horizontal | vertical
  @Input() adjustOnChange = true;

  private _content: ChartElement[];
  private initPos = 10;

  @Output() onAddElement = new EventEmitter();
  @Output() onRemoveElement = new EventEmitter();

  @ViewChildren("innerContent") templateContents;
  @ViewChildren("arrow") arrows;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    this.setupChart();

    setTimeout(() => {
      this.setPositions();
    }, 100);
  }

  setupChart() {
    this._content = [...this.content];

    this._content.sort((a, b) => {
      return a.nextId - b.nextId;
    });

    this._content.forEach((el, i) => {
      el.index = i;
      if (el.nextId) {
        const parent = this._content.filter(p => p.id === el.nextId)[0];
        el.parent = parent;

        if (!parent.children) {
          parent.children = [];
        }
        el.childIndex = parent.children.length;
        parent.children.push(el);
      }
    });
  }

  setPositions() {
    const els = this.templateContents["_results"] || [];
    const arrows = this.arrows["_results"] || [];
    let pos = this.initPos;

    els.forEach(element => {
      const domEl = element["nativeElement"];
      const ref = this._content[+domEl.id.replace("el-", "")];

      ref.width = domEl.offsetWidth + (this.withEl || 0);
      ref.height = domEl.offsetHeight + (this.heightEl || 0);

      if (ref.parent) {
        ref.posX =
          ref.parent.posX + this.dinstanceElHorizontal + ref.parent.width;
        ref.posY =
          ref.parent.posY -
          ((ref.parent.children.length - 1) * this.dinstanceElVertical) / 2 +
          ref.childIndex * this.dinstanceElVertical;
      } else {
        ref.posX = pos;
        ref.posY = pos + this.dinstanceElVertical;
      }

      domEl.parentNode.style.left = ref.posX + "px";
      domEl.parentNode.style.top = ref.posY + "px";
    });

    arrows.forEach(arrow => {
      const domEl = arrow["nativeElement"];
      const ref = this._content[+domEl.id.replace("arrow-", "")];

      domEl.setAttribute("x1", ref.posX);
      domEl.setAttribute("y1", ref.posY + ref.height / 2);

      domEl.setAttribute("x2", ref.parent.posX + ref.parent.width);
      domEl.setAttribute("y2", ref.parent.posY + ref.parent.height / 2);
    });
  }
}
