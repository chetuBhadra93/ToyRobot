import { Injectable } from "@angular/core";

export enum COMMAND_DICT {
  LEFT,
  RIGHT,
  PLACE,
  MOVE,
  REPORT,
}

export enum DIRECTION {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3,
  COUNT = 4,
  NONE = -1,
}

export class Command {
  cmd: COMMAND_DICT;
  args: string[];
}

@Injectable()
export class CONSTANTS {
  public static SYS_MSG = {};
  public static PLACEMENT_CONSTRAINT = -100;
  public static VALIDATION_CONSTRAINT = -101;
  public static UNKNOWN_COMMAND = -102;
  public static SUCCESS = 100;
  public static RIGHT = 1;
  public static LEFT = -1;
  public static INITIAL_PLACE_COMMAND = 'PLACE 0 0 EAST';

  public static get MAXROWS(): number {
    return 5;
  }
  public static get MAXCOLS(): number {
    return 5;
  }

  constructor() {}
}
