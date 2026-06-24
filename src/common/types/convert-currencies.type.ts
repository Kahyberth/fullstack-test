export type IConvertResponse = {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: Record<string, number>;
};

export type ErrorResponse = {
  error: boolean;
  status: number;
  message: string;
  description: string;
};
