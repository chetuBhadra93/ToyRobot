import { Component } from "@angular/core";
import { Command } from "../shared/constants/constants";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  command: Command;
  constructor() {}
  setCommand(event: any): void {
    if (event.value) {
      this.command = event.value;
    }
  }
}
