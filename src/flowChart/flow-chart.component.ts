import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  ChangeDetectorRef,
  ViewChild
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
  @Input() dinstanceElVertical = 50;
  @Input() direction = "vertical"; // horizontal | vertical
  @Input() flowDirection = 2;
  @Input() adjustOnChange = true;
  @Input() canvasWidth = 500;
  @Input() canvasHeight: any = 500;
  @Input() autoResize = true;

  private _content: ChartElement[];
  private initPos = 0;
  private arrowSize = 10;

  @Output() onAddElement = new EventEmitter();
  @Output() onRemoveElement = new EventEmitter();

  @ViewChildren("innerContent") templateContents;
  @ViewChildren("arrow") arrows;
  @ViewChild("container") container;
  @ViewChild("arrowsContainer") arrowsContainer;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    this.setupChart();

    setTimeout(() => {
      if (this.autoResize) {
        const comp = this.container.nativeElement;
        this.canvasWidth = comp.clientWidth;
        this.canvasHeight = "100";
      }
      this.container.nativeElement.parentNode.style.height =
        this.canvasHeight + (this.autoResize ? "%" : "px");
      this.container.nativeElement.parentNode.style.width =
        this.canvasWidth + "px";

      this.arrowsContainer.nativeElement.style.height =
        this.canvasHeight + (this.autoResize ? "%" : "px");
      this.arrowsContainer.nativeElement.style.width = this.canvasWidth + "px";
      this.initPos =
        this.container.nativeElement[
          this.direction === "horizontal" ? "clientHeight" : "clientWidth"
        ] / 2;
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

  setPositions(hasToInit = true) {
    const els = this.templateContents["_results"] || [];
    const arrows = this.arrows["_results"] || [];
    let pos = this.initPos;
    const self = this;

    if (hasToInit) {
      //set sizes
      els.forEach(element => {
        const domEl = element["nativeElement"];
        const ref = this._content[+domEl.id.replace("el-", "")];

        ref.width = domEl.offsetWidth + (this.withEl || 0);
        ref.height = domEl.offsetHeight + (this.heightEl || 0);
      });

      els.forEach(element => {
        const domEl = element["nativeElement"];
        const ref = this._content[+domEl.id.replace("el-", "")];

        if (ref.parent) {
          if (this.direction === "horizontal") {
            let dis = -ref.height;
            ref.parent.children.forEach((e, i) => {
              dis += e.height + (i ? this.dinstanceElVertical : 0);
            });
            dis *= ref.childIndex - 0.5;

            ref.posX =
              ref.parent.posX + this.dinstanceElHorizontal + ref.parent.width;
            ref.posY = ref.parent.posY + dis;
          } else {
            let dis = -ref.width;
            ref.parent.children.forEach((e, i) => {
              dis += e.width + (i ? this.dinstanceElHorizontal : 0);
            });
            dis *= ref.childIndex - 0.5;

            ref.posY =
              ref.parent.posY + this.dinstanceElVertical + ref.parent.height;
            ref.posX = ref.parent.posX + dis;
          }
        } else {
          if (this.direction === "horizontal") {
            ref.posX = this.dinstanceElVertical;
            ref.posY = pos + ref.height / 2;
          } else {
            ref.posY = this.dinstanceElHorizontal;
            ref.posX = pos + ref.width / 2;
          }
        }

        domEl.parentNode.style.left = ref.posX + "px";
        domEl.parentNode.style.top = ref.posY + "px";
      });
    }

    arrows.forEach(arrow => {
      const domEl = arrow["nativeElement"];
      const refEl = this._content[+domEl.id.replace("arrow-", "")];
      let ref = { ...refEl };
      if (self.flowDirection !== 1) {
        let p = { ...ref.parent };
        ref = p;
        ref.parent = { ...refEl };
      }

      domEl.setAttribute(
        "x1",
        this.container.nativeElement.offsetLeft + ref.posX + ref.width / 2
      );
      domEl.setAttribute(
        "y1",
        this.container.nativeElement.offsetTop + ref.posY + ref.height / 2
      );
      domEl.parentNode.style.width = this.canvasWidth * 100 + "px";
      domEl.parentNode.style.height = this.canvasHeight * 100 + "px";

      if (this.direction === "horizontal") {
        domEl.setAttribute(
          "x2",
          this.container.nativeElement.offsetLeft +
            ref.parent.posX +
            (self.flowDirection !== 1
              ? -this.arrowSize * 2
              : ref.parent.width) +
            this.arrowSize
        );
        domEl.setAttribute(
          "y2",
          this.container.nativeElement.offsetTop +
            ref.parent.posY +
            ref.parent.height / 2
        );
      } else {
        domEl.setAttribute(
          "y2",
          this.container.nativeElement.offsetTop +
            ref.parent.posY +
            (self.flowDirection !== 1
              ? -this.arrowSize * 2
              : ref.parent.height) +
            this.arrowSize
        );
        domEl.setAttribute(
          "x2",
          this.container.nativeElement.offsetLeft +
            ref.parent.posX +
            ref.parent.width / 2
        );
      }
    });
  }

  onDropElement(event) {
    if (event) {
      const id = event.target.id || event.target.children[0].id;
      let ref = this._content[+id.replace("el-", "")];
      ref.posX = event.left;
      ref.posY = event.top;
    }
    this.setPositions(false);
  }
}
