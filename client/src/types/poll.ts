export interface Option {
  _id: string;
  text: string;
  votes: number;
}

export interface Poll {
  _id: string;
  question: string;
  options: Option[];
  totalVotes: number;
  createdAt: string;
} 