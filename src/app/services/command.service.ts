import { Injectable } from "@angular/core";
import { Command, COMMAND_DICT } from "../shared/constants/constants";
@Injectable({
  providedIn: "root",
})
export class CommandService {
  constructor() {}
  public parse(inputCommand: string): Command {
    let command: Command = new Command();
    let cmd: string = inputCommand.trim().split(" ")[0]; 
    command.cmd = COMMAND_DICT[cmd];
    return command;
  }
}
