import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { FlowChartComponent } from "./flow-chart.component";
import { DragNDrop } from "./flow-chart-drag-drop-directive";

@NgModule({
  declarations: [FlowChartComponent, DragNDrop],
  imports: [BrowserModule],
  providers: [],
  exports: [FlowChartComponent, DragNDrop]
})
export class FlowChartModule {}
