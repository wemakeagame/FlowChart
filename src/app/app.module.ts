import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { FlowChartModule } from "../flowChart/flow-chart.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FlowChartModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
