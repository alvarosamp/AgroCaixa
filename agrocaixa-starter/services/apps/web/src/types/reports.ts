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

export type FinancialAlert = {
  id: number;
  user_id: number;
  message: string;
  date: string;
  type: string;
  read: boolean;
};

export type UnreadAlertsResponse = {
  unread_count: number;
};

export type ActivityOption = {
  id: number;
  name: string;
  type: string;
  status: string;
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
