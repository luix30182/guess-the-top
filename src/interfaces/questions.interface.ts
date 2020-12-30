export interface Questions {
  id?: string;
  question?: string;
  answers?: Array<Answer>;
}

export interface Answer {
  answer: string;
  rank: number;
  status: boolean;
}
