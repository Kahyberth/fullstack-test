import axios from 'axios';
import { join } from 'path';

export const axiosClient = axios.create({
  baseURL: 'https://openexchangerates.org/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const PRODUCTS_LIST_FILENAME = 'products_list.csv';
export const DATA_DIR = join('src', 'data');
export const OPENAI_CLIENT = 'OPENAI_CLIENT';
export const OPENAI_EMBEDDING_MODEL = 'text-embedding-3-small';
export const OPENAI_CHAT_MODEL = 'gpt-4o-mini';
export const PRODUCTS_TO_RETURN = 2;
export const MAX_TOOL_ITERATIONS = 3;
export const SYSTEM_PROMPT = `You are a helpful customer support and sales assistant for an online store.
You can search the product catalog and convert currencies using the available tools.
When the user asks for a price in another currency, first find the product, then convert its price.
Always use ISO 4217 codes (e.g. EUR, USD, CAD) when calling the currency tool.
Reply in the same language as the user, concisely and naturally.`;
