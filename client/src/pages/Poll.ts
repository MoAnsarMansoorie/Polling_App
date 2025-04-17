export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    createdAt: Date;
  }
  
  export interface PollOption {
    id: string;
    text: string;
    votes: number;
  }
  
  export interface CreatePollInput {
    question: string;
    options: string[];
  }