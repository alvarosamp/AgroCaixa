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
  farm_id: number;
  name: string;
  type: string;
  status: string;
};

export type FarmResponse = {
  id: number;
  user_id: number;
  name: string;
  city: string;
  state: string;
  production_type: string;
};

export type TransactionItem = {
  id: number;
  user_id: number;
  activity_id: number | null;
  type: "income" | "expense";
  amount: number;
  date: string;
  description: string | null;
  activity_name?: string | null;
  category: string | null;
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
