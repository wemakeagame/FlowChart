import { Directive, HostListener, Output, EventEmitter } from "@angular/core";

@Directive({ selector: "[dragndrop]" })
export class DragNDrop {
  @Output() onDrop = new EventEmitter<any>();
  private target = null;
  private container = null;
  private _container = null;
  private posContainer = { x: 0, y: 0 };
  private posClickContainer = { x: 0, y: 0 };

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
      this.target.style.top =
        event.clientY -
        this.target.offsetHeight / 2 -
        this._container.offsetTop +
        "px";
      this.target.style.left =
        event.clientX -
        this.target.offsetWidth / 2 -
        this._container.offsetLeft +
        "px";

      this.onDrop.emit({
        top:
          event.clientY -
          this.target.offsetHeight / 2 -
          this._container.offsetTop,
        left:
          event.clientX -
          this.target.offsetWidth / 2 -
          this._container.offsetLeft,
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
}
