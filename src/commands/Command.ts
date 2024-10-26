export class Command {
  type: string;
  payload: any;
  timestamp: number;

  constructor(type: string, payload: any) {
    this.type = type;
    this.payload = payload;
    this.timestamp = Date.now();
  }
}
