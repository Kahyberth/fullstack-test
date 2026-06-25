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
