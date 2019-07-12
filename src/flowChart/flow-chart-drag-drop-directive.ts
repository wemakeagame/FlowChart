import {
  Directive,
  HostListener,
  Input,
  Output,
  EventEmitter
} from "@angular/core";

@Directive({ selector: "[dragndrop]" })
export class DragNDrop {
  @Output() onDrop = new EventEmitter<any>();
  private target = null;
  private container = null;
  private _container = null;
  private posContainer = { x: 0, y: 0 };
  private posClickContainer = { x: 0, y: 0 };
  @Input() maxZoom = 2;
  private currentZoom = 1;

  @HostListener("mousedown", ["$event"]) onMouseDown(e) {
    const target = e.target;
    if (!target) {
      return;
    } else {
      const className = (target.className && target.className.toString()) || "";
      const parentClassName =
        (target.parentNode &&
          target.parentNode.className &&
          target.parentNode.className.toString()) ||
        "";
      const isSVG = className && className.includes("SVG");
      const isWrapper = className && className.includes("wrapper");
      const isContainer = isSVG || isWrapper;

      const isInnerContent = className && className.includes("inner-content");
      const isElement = className && className.includes("element");
      const isSpanContent =
        parentClassName && parentClassName.includes("inner-content");

      this.target = null;
      if (isInnerContent) {
        this.target = target.parentNode;
      }

      if (isElement) {
        this.target = target;
      }

      if (isContainer && !this.container) {
        const t = isSVG
          ? target.parentNode.parentNode.children[0]
          : target.children[0];
        this.container = t;
        this._container = t;
        this.posContainer.x = this._container.offsetLeft;
        this.posContainer.y = this._container.offsetTop;
        this.posClickContainer.x = e.clientX;
        this.posClickContainer.y = e.clientY;
      }

      if (isSpanContent) {
        this.target = target.parentNode.parentNode;
      }
    }
  }

  @HostListener("document:mouseup", ["$event"]) onMouseUp(event) {
    this.target = null;
    this.container = null;
  }

  @HostListener("document:click", ["$event"]) onClick(event) {
    this.target = null;
    this.container = null;
  }

  @HostListener("mousemove", ["$event"]) onMousemove(event) {
    if (this.target) {
      if (!this._container) {
        this._container = this.target.parentNode;
      }
      let posY =
        event.clientY / this.currentZoom -
        this.target.offsetHeight / 2 +
        (this.currentZoom !== 1
          ? (this.target.offsetHeight / 2) * this.currentZoom
          : 0) -
        this._container.offsetTop -
        this._container.parentNode.offsetTop;
      let posX =
        event.clientX / this.currentZoom -
        this.target.offsetWidth / 2 -
        this._container.offsetLeft -
        this._container.parentNode.offsetLeft;

      console.log(this.target.offsetHeight);
      console.log(this.target.offsetWidth);

      this.target.style.top = posY + "px";
      this.target.style.left = posX + "px";

      this.onDrop.emit({
        top: posY,
        left: posX,
        target: this.target
      });
    }

    if (this.container && !this.target) {
      this.container.style.top =
        event.clientY - this.posClickContainer.y + this.posContainer.y + "px";
      this.container.style.left =
        event.clientX - this.posClickContainer.x + this.posContainer.x + "px";
      this.onDrop.emit();
    }
  }

  @HostListener("mousewheel", ["$event"]) onWheelScrool(event) {
    if (this._container) {
      const items = this._container.parentNode.children[0];
      const arrows = this._container.parentNode.children[1];

      if (event.wheelDelta > 0) {
        this.currentZoom += 0.1;
      } else {
        this.currentZoom -= 0.1;
      }

      if (this.currentZoom > this.maxZoom) {
        this.currentZoom = this.maxZoom;
      }

      if (this.currentZoom < 1) {
        this.currentZoom = 1;
      }

      items.style.zoom = this.currentZoom;
      arrows.style.zoom = this.currentZoom;
    }
  }
}
