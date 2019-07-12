import { Component } from "@angular/core";
import { ChartElement } from "../flowChart/chart.element.interface";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  flow = 1;
  direction = "horizontal";
  contentChart: ChartElement[] = [
    {
      id: 1,
      content: "first Chart"
    },
    {
      id: 2,
      content: "sencond Chart",
      nextId: 1
    },
    {
      id: 3,
      content: "third Chart",
      nextId: 2
    },
    {
      id: 4,
      content: "fourth Chart",
      nextId: 3
    },
    {
      id: 5,
      content: "Fifth Chart",
      nextId: 3
    },
    {
      id: 6,
      content: "Sixth Chart",
      nextId: 5
    },
    {
      id: 7,
      content: "third 2 Chart",
      nextId: 2
    }
  ];

  toggleDirection() {
    this.direction =
      this.direction === "horizontal" ? "vertical" : "horizontal";
  }

  toggleFlow() {
    this.flow = this.flow === 1 ? 2 : 1;
  }
}
