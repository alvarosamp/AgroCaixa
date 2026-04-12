export type FinancialSummary = {
  income: number;
  expense: number;
  balance: number;
  total_transactions: number;
};

export type ActivityReportItem = {
  activity_id: number;
  activity_name: string;
  income: number;
  expense: number;
  balance: number;
};

export type CategoryReportItem = {
  category: string;
  total: number;
  transactions_count: number;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};
