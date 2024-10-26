export interface Value {
    title: string;
    description: string;
  }
  
  export interface Category {
    'Very Important': Value[];
    'Quite Important': Value[];
    'Important': Value[];
    'Of Some Importance': Value[];
    'Not Important': Value[];
  }
  
  export interface Session {
    id: string;
    timestamp: number;
    targetCoreValues: number;
    rounds: number;
  }
  
  export interface Command {
    type: string;
    payload: any;
    timestamp: number;
  }
  
  export interface Round {
    sessionId: string;
    roundNumber: number;
    commands: Command[];
  }
  