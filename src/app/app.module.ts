import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { FlowChartComponent } from "../flowChart/flow-chart.component";

@NgModule({
  declarations: [AppComponent, FlowChartComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
