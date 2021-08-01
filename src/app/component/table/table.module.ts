import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { TableComponent } from "./table.component";

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [TableComponent],
  exports: [TableComponent],
})
export class TableComponentModule {}
