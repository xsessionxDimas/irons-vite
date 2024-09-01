import { substractDateByDurationHelper } from "../helpers/date-format";

export default class TimerClass {
  /* variables */
  public clock = '00:00:00';
  private timeBegan: Date | null = null;
  private timeStopped: Date | null = null;
  private running = false;
  private started: number | undefined = undefined;
  private stoppedDuration = 0;

  public start() {
    if (this.running) return;

    if (this.timeBegan === null) {
      this.reset();
      this.timeBegan = new Date();
    }
    if (this.timeStopped !== null) {
      this.stoppedDuration += (new Date().getTime() - this.timeStopped.getTime());
    }
    this.started = setInterval(() => {
      this.clock = this.clockRunning(this.timeBegan as Date, this.stoppedDuration);
    }, 1000) as unknown as number;
    this.running = true;
  }

  public continue() {
    if (this.running) return;
    this.timeBegan = new Date()
    const dateSubtractedByCurrentClock = substractDateByDurationHelper(this.timeBegan, this.clock)
    this.timeBegan = new Date(dateSubtractedByCurrentClock.format())
    if (this.timeBegan === null) {
      this.reset();
      this.timeBegan = new Date();
    }
    if (this.timeStopped !== null) {
      this.stoppedDuration += (new Date().getTime() - this.timeStopped.getTime());
    }
    this.started = setInterval(() => {
      this.clock = this.clockRunningFromContinue(this.timeBegan as Date, this.stoppedDuration);
    }, 1000) as unknown as number;
    this.running = true;
  }

  public stop() {
    this.running = false;
    this.timeStopped = new Date();
    clearInterval(this.started as number);
  }

  public reset() {
    this.running = false;
    clearInterval(this.started as number);
    this.stoppedDuration = 0;
    this.timeBegan = null;
    this.timeStopped = null;
    this.clock = "00:00:00";
  }

  private clockRunningFromContinue(timeBegan: Date, stoppedDuration: number) {
    const currentTime = new Date();
    const timeElapsed = new Date(currentTime.getTime() - timeBegan.getTime() - stoppedDuration);
    const hour = timeElapsed.getUTCHours();
    const min = timeElapsed.getUTCMinutes();
    const sec = timeElapsed.getUTCSeconds();

    return `${this.zeroPrefix(hour, 2)}:${this.zeroPrefix(min, 2)}:${this.zeroPrefix(sec, 2)}`;
  }

  private clockRunning(timeBegan: Date, stoppedDuration: number) {
    const currentTime = new Date();
    const timeElapsed = new Date(currentTime.getTime() - timeBegan.getTime() - stoppedDuration);
    const hour = timeElapsed.getUTCHours();
    const min = timeElapsed.getUTCMinutes();
    const sec = timeElapsed.getUTCSeconds();

    return `${this.zeroPrefix(hour, 2)}:${this.zeroPrefix(min, 2)}:${this.zeroPrefix(sec, 2)}`;
  }

  private zeroPrefix(num, digit) {
    let zero = '';
    for (let i = 0; i < digit; i++) {
      zero += '0';
    }
    return (zero + num).slice(-digit);
  }

  public updateCLock(val) {
    this.clock = val
  }
}
