import { CONSTANTS, Command, COMMAND_DICT, DIRECTION } from "../constants/constants";

export class RobotEngine {
  //Singleton? May be look for a better way in future
  x: number = -1;
  y: number = -1;
  nose: DIRECTION = DIRECTION.NONE;
  top: string = 80 + "%";
  left: string = 0 + "%";
  public static r: RobotEngine;
  public static getInstance() {
    if (!RobotEngine.r) {
      RobotEngine.r = new RobotEngine();
    }
    return RobotEngine.r;
  }

  robotHasBeenPlaced = false;

  initialize() {
    this.x = this.y = -1;
    this.nose = DIRECTION.NONE;
  }

  public mapCommand(command: Command): string {
    if (command) {
      if (this.robotHasBeenPlaced) {
        switch (command.cmd) {
          case COMMAND_DICT.LEFT:
            this.rotate(CONSTANTS.LEFT);
            return CONSTANTS.SYS_MSG[COMMAND_DICT.LEFT];
          case COMMAND_DICT.RIGHT:
            this.rotate(CONSTANTS.RIGHT);
            return CONSTANTS.SYS_MSG[COMMAND_DICT.RIGHT];
          case COMMAND_DICT.REPORT:
            return this.report();
          case COMMAND_DICT.MOVE:
            return this.move();
          default:
            return CONSTANTS.SYS_MSG[CONSTANTS.UNKNOWN_COMMAND];
        }
      }
      if (!this.robotHasBeenPlaced && command.cmd == COMMAND_DICT.PLACE) {
        return this.placeValidate(command.args);
      } else return CONSTANTS.SYS_MSG[CONSTANTS.PLACEMENT_CONSTRAINT];
    }
    return CONSTANTS.SYS_MSG[CONSTANTS.UNKNOWN_COMMAND];
  }

  rotate(direction: number): void {
    //Will just move the direction
    //direction == -1 for LEFT
    //direction == 1 for RIGHT

    this.nose = (DIRECTION.COUNT + this.nose + direction) % DIRECTION.COUNT;
  }

  move(): string {
    //Will just move the position based on direction
    let validation: boolean = false;

    switch (this.nose) {
      case DIRECTION.NORTH:
        //increase y
        validation = this.validate(this.x, this.y + 1);
        this.y = validation ? this.y + 1 : this.y;
        if (this.y > 0) {
          this.top = 80 - this.y * 20 + "%";
        } else {
          this.top = "80%";
        }
        break;

      case DIRECTION.EAST:
        //increase x
        validation = this.validate(this.x + 1, this.y);
        this.x = validation ? this.x + 1 : this.x;
        if (this.x < 80) {
          this.left = this.x * 20 + "%";
        } else {
          this.left = "0%";
        }
        break;

      case DIRECTION.SOUTH:
        //decrease y
        validation = this.validate(this.x, this.y - 1);
        this.y = validation ? this.y - 1 : this.y;
        if (this.y < 80) {
          this.top = 80 - this.y * 20 + "%";
        } else {
          this.top = "80%";
        }
        break;

      case DIRECTION.WEST:
        //decrease x
        validation = this.validate(this.x - 1, this.y);
        this.x = validation ? this.x - 1 : this.x;
        if (this.x > 0) {
          this.left = this.x * 20 + "%";
        } else {
          this.left = "0%";
        }
        break;
    }
    return validation
      ? CONSTANTS.SYS_MSG[COMMAND_DICT.MOVE]
      : CONSTANTS.SYS_MSG[CONSTANTS.UNKNOWN_COMMAND];
  }

  private setDirection(f: string) {
    switch (f.toLowerCase()) {
      case "n":
        this.nose = DIRECTION.NORTH;
        break;

      case "e":
        this.nose = DIRECTION.EAST;
        break;

      case "s":
        this.nose = DIRECTION.SOUTH;
        break;

      case "w":
        this.nose = DIRECTION.WEST;
        break;
    }
  }

  private validate(x: number, y: number): boolean {
    return x >= 0 && x < CONSTANTS.MAXROWS && y >= 0 && y < CONSTANTS.MAXCOLS;
  }

  private placeValidate(args: string[]): string {
    //console.log(args);
    //debugger;
    if (
      args.length == 3 &&
      this.validate(+args[0], +args[1]) &&
      args[2][0].toLowerCase().match("[nesw]")
    ) {
      if (parseInt(args[0]) > 0) {
        this.left = 20 * parseInt(args[0]) + "%";
      }
      if (parseInt(args[1]) > 0) {
        this.top = 80 - 20 * parseInt(args[1]) + "%";
      }
      this.place(+args[0], +args[1]);
      this.setDirection(args[2][0]);
      this.robotHasBeenPlaced = true;
      return this.report();
    }
    return CONSTANTS.SYS_MSG[CONSTANTS.VALIDATION_CONSTRAINT];
  }

  private place(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  private report(): string {
    //Will report
    let r: string = `Output: ${this.x}, ${this.y}, ${DIRECTION[this.nose]}`;
    return r;
  }
}
