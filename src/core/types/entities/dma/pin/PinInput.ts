export class PinInput {
  public value: string
  public isError: boolean

  constructor() {
    this.value = ''
    this.isError = false
  }

  toggleIsError(status) {
    this.isError = status
  }

  resetPIN() {
    this.value = ''
    this.isError = false
  }
}
