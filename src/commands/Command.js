export class Command {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
    this.timestamp = Date.now();
  }
}