import OpenAI from 'openai';

export const CHAT_TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'searchProducts',
      description:
        'Search the store catalog for products relevant to the user enquiry. Use it whenever the user is looking for, asking about, or wants the price of a product.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'Natural language description of what the user is looking for',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'convertCurrencies',
      description:
        'Convert a monetary amount from one currency to another using live exchange rates.',
      parameters: {
        type: 'object',
        properties: {
          amount: {
            type: 'number',
            description: 'The amount of money to convert',
          },
          fromCurrency: {
            type: 'string',
            description: 'ISO 4217 code of the source currency, e.g. USD',
          },
          toCurrency: {
            type: 'string',
            description: 'ISO 4217 code of the target currency, e.g. EUR',
          },
        },
        required: ['amount', 'fromCurrency', 'toCurrency'],
      },
    },
  },
];
