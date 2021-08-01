import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { HomePage } from "./home.page";

import { HomePageRoutingModule } from "./home-routing.module";
import { TableComponentModule } from "../component/table/table.module";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HomePageRoutingModule,
    TableComponentModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
