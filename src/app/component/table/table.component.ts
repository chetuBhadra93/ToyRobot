import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommandService } from '../../services/command.service';
import { CONSTANTS, Command, DIRECTION, COMMAND_DICT } from '../../shared/constants/constants';

import { RobotEngine } from 'src/app/shared/helpers/robot-engine';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input('command') commandName: Command;
  @Output() commandExecute = new EventEmitter();
  directionClass = '';
  DIRECTION = DIRECTION;
  XYDirectionStyle = {
    display: 'block',
    left: '0%',
    top: '0%',
  };
  overlayHidden: boolean = false;
  rows: number[] = Array.from({ length: CONSTANTS.MAXROWS }).map(
    (x, i) => CONSTANTS.MAXROWS - 1 - i
  );
  cols: number[] = Array.from({ length: CONSTANTS.MAXCOLS }).map((x, i) => i);
  static rx = -1;
  static ry = -1;
  reportOutput: any;

  constructor(private commandService: CommandService, public toastController: ToastController) {}
  ngOnInit() {}

  ngOnChanges(changes: any) {
    if (this.commandName) {
      const r: RobotEngine = RobotEngine.getInstance();
      const m: string = r.mapCommand(this.commandName);
      this.XYDirectionStyle.top = r.top;
      this.XYDirectionStyle.left = r.left;
      switch (r.nose) {
        case DIRECTION.NORTH:
          this.directionClass = 'north';
          break;

        case DIRECTION.EAST:
          this.directionClass = 'east';
          break;

        case DIRECTION.SOUTH:
          this.directionClass = 'south';
          break;

        case DIRECTION.WEST:
          this.directionClass = 'west';
          break;
      }
      TableComponent.rx = r.x;
      TableComponent.ry = r.y;
      this.commandExecute.emit({ msg: m });
    }
  }


  onCommandExec(cmd: string) {
    const r: RobotEngine = RobotEngine.getInstance();
    switch (true) {
      case DIRECTION.NORTH.toString() === r.nose.toString() && cmd == DIRECTION.WEST.toString():
        this.onCommand('LEFT');
        this.moveToNextStep('MOVE');
        break;
      case DIRECTION.NORTH.toString() === r.nose.toString() && cmd == DIRECTION.EAST.toString():
          this.onCommand('RIGHT');
          this.moveToNextStep('MOVE');
          break;
      case DIRECTION.NORTH.toString() === r.nose.toString() && cmd == DIRECTION.NORTH.toString():
        this.onCommand('MOVE');
        break;
      case DIRECTION.NORTH.toString() === r.nose.toString() && cmd == DIRECTION.SOUTH.toString():
        this.onCommand('RIGHT');
        this.moveToNextStep('RIGHT');
        this.moveToNextStep('MOVE');
        break;

      case DIRECTION.EAST.toString() === r.nose.toString() && cmd == DIRECTION.EAST.toString():
        this.onCommand('MOVE');
        break;
      case DIRECTION.EAST.toString() === r.nose.toString() && cmd == DIRECTION.NORTH.toString():
        this.onCommand('LEFT');
        this.moveToNextStep('MOVE');
        break;
      case DIRECTION.EAST.toString() === r.nose.toString() && cmd == DIRECTION.WEST.toString():
        this.onCommand('RIGHT');
        this.moveToNextStep('RIGHT');
        this.moveToNextStep('MOVE');
        break;
      case DIRECTION.EAST.toString() === r.nose.toString() && cmd == DIRECTION.SOUTH.toString():
        this.onCommand('RIGHT');
        this.moveToNextStep('MOVE');
        break;

      case DIRECTION.SOUTH.toString() === r.nose.toString() && cmd == DIRECTION.SOUTH.toString():
        this.moveToNextStep('MOVE');
        break;
      case DIRECTION.SOUTH.toString() === r.nose.toString() && cmd == DIRECTION.NORTH.toString():
        this.onCommand('RIGHT');
        this.moveToNextStep('RIGHT');
        this.moveToNextStep('MOVE');
          break;
      case DIRECTION.SOUTH.toString() === r.nose.toString() && cmd == DIRECTION.WEST.toString():
        this.onCommand('RIGHT');
        this.moveToNextStep('MOVE');
        break;
      case DIRECTION.SOUTH.toString() === r.nose.toString() && cmd == DIRECTION.EAST.toString():
        this.onCommand('LEFT');
        this.moveToNextStep('MOVE');
          break;

      case DIRECTION.WEST.toString() === r.nose.toString() && cmd == DIRECTION.EAST.toString():
        this.onCommand('RIGHT');
        this.moveToNextStep('RIGHT');
        this.moveToNextStep('MOVE');
        break;
      case DIRECTION.WEST.toString() === r.nose.toString() && cmd == DIRECTION.NORTH.toString():
        this.onCommand('RIGHT');
        this.moveToNextStep('MOVE');
        break;
      case DIRECTION.WEST.toString() === r.nose.toString() && cmd == DIRECTION.WEST.toString():
        this.onCommand('MOVE');
        break;
      case DIRECTION.WEST.toString() === r.nose.toString() && cmd == DIRECTION.SOUTH.toString():
        this.onCommand('LEFT');
        this.moveToNextStep('MOVE');
        break;
      case DIRECTION.WEST == r.nose:
        this.directionClass = 'West';
        break;
    }
  }

  moveToNextStep(command) {
    setTimeout(() => {
      this.onCommand(command);
    }, 100);
  }

  onCommand(cmd: string) {
    if (cmd) {
      const command: Command = this.commandService.parse(cmd.toUpperCase());
      if (command.cmd === COMMAND_DICT.PLACE) {
        const [, ...args] = cmd.trim().split(' ');
        command.args = args;
      }
      this.reportOutput = {
        value: command,
        msg: CONSTANTS.SYS_MSG[command.cmd],
      };
      this.commandExecute.emit(this.reportOutput);
    }
  }
  public placeRobot() {
    this.onCommand(CONSTANTS.INITIAL_PLACE_COMMAND);
    this.overlayHidden = true;
  }
  async showReport(): Promise<void>{
    const robotEngine: RobotEngine = RobotEngine.getInstance();
    this.commandName.cmd = COMMAND_DICT.REPORT;
    const reportMessage: string = robotEngine.mapCommand(this.commandName);
    const toast = await this.toastController.create({
      message: reportMessage,
      duration: 3000,
    });
    toast.present();
  }
}
