export class Log {
  public static ERROR = 0;
  public static WARNING = 1;
  public static INFO = 2;
  public static DEBUG = 3;

  public static loadSourceMap() {
    try {
      // tslint:disable-next-line
      var SourceMapConsumer = require("source-map").SourceMapConsumer;
      const map = require("main.js.map").d;
      if (map) {
        Log.sourceMap = new SourceMapConsumer(map);
      }
    } catch (err) {
      console.log(err);
    }
  }

  private static sourceMap: any;
  private static stackLineRe = /([^ ]*) \(([^:]*):([0-9]*):([0-9]*)\)/;
  private static color(str: string, color: string): string {
    return "<font color='" + color + "'>" + str + "</font>";
  }
  private static tooltip(str: string, tooltip: string): string {
    return "<abbr title='" + tooltip + "'>" + str + "</abbr>";
  }

  public level: number = Log.ERROR;
  public showSource: boolean = true;
  public decorateLine: boolean = true;
  private maxFileString: number = 0;

  public trace(error: Error): Log {
    if (this.level >= Log.ERROR && error.stack) {
      console.log(this.resolveStack(error.stack));
    }

    return this;
  }

  public error(...args: any[]) {
    if (this.level >= Log.ERROR) {
      console.log.apply(this,
        [
          Log.color("ERROR  ", "red"),
          this.time(),
          this.getFileLine(),
        ].concat([].slice.call(args)));
    }
  }

  public warning(...args: any[]) {
    if (this.level >= Log.WARNING) {
      console.log.apply(this,
        [
          Log.color("WARNING", "yellow"),
          this.time(),
          this.getFileLine(),
        ].concat([].slice.call(args)));
    }
  }

  public info(...args: any[]) {
    if (this.level >= Log.INFO) {
      console.log.apply(this,
        [
          Log.color("INFO   ", "green"),
          this.time(),
          this.getFileLine(),
        ].concat([].slice.call(args)));
    }
  }

  public debug(...args: any[]) {
    if (this.level >= Log.DEBUG) {
      console.log.apply(this,
        [
          Log.color("DEBUG  ", "gray"),
          this.time(),
          this.getFileLine(),
        ].concat([].slice.call(args)));
    }
  }

  public getFileLine(upStack = 3): string {
    if (!this.showSource) {
      return "";
    }

    let stack = new Error("").stack;
    if (stack) {
      let lines = stack.split("\n");
      if (lines.length > upStack) {
        lines = this.resolveLines(_.drop(lines, upStack));
        return Log.tooltip(Log.color(this.adjustFileLine(lines[0]), "gray"), lines.join("&#10;"));
      }
    }
    return "";
  }

  public time(): string {
    return Log.color(Game.time.toString(), "gray");
  }

  private resolve(fileLine: string): string {
    let split = _.trim(fileLine).match(Log.stackLineRe);
    if (!split) {
      return fileLine;
    }

    let pos = { column: parseInt(split[4], 10), line: parseInt(split[3], 10) };

    let original = Log.sourceMap.originalPositionFor(pos);
    return split[1] + " (" + original.source + ":" + original.line + ")";
  }

  private resolveStack(stack: string): string {
    if (!Log.sourceMap) {
      return stack;
    }

    return stack.split("\n").map(this.resolve).join("\n");
  }

  private resolveLines(lines: Array<string>): Array<string> {
    if (!Log.sourceMap) {
      return lines;
    }

    return lines.map(this.resolve);
  }

  private adjustFileLine(line: string): string {
    let newPad = Math.max(line.length, this.maxFileString);
    this.maxFileString = Math.min(newPad, 100);

    return _.padRight(line, this.maxFileString, " ");
  }
}

export var log = new Log();
