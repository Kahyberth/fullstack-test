

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


## FullStack Test - Kahyberth Gonzalez



## Tech Stack

- **Nestjs** 
- **TypeScript**
- **OpenAI SDK**
- **Open Exchange Rates API**
- **Class-validator**


## How it works

When a user message arrives, the service follows the function calling flow:

1. The user message is sent to the LLM together with the available tool definitions
2. The LLM decides whether to call a tool and with which arguments
3. The tool is executed locally (product search or currency conversion)
4. The result is sent back to the LLM so it can produce the final natural language answer

A loop supports chained tool calls (e.g "What is the price of the watch in Euros" runs `searchProducts` and then `convertCurrencies`)

## Prerequisites

- Node and npm or other node package manager
- An **OpenAI API Key**
- An **Open Exchange Rates App ID**


## Setup

1. Git clone

```bash
git clone git@github.com:Kahyberth/fullstack-test.git
```
2. Move to **fullstack-test** folder

3. Install dependencies

```bash
npm install
```

4. Create a `.env` file in the project root
  - You can use `.env.template` as reference

```env
OPENAI_API_KEY=api_key
OPEN_EXCHANGE_APP_ID=api_id
PORT=8080
```

## Running the App

1. Run the project

```bash
npm run start:dev
```

## Note:
- On startup the service loads the product catalog and builds the embedding index once (you will see `Embedding index built for 90 products` in the logs)


## API

### `POST /chat`

Send a user enquiry to the chatbot

** Request body **
```json
{
  "message": "I am looking for a phone"
}
```

**Response**

```json
{
    "response": "I found a phone for you: \n\n- **iPhone SE**\n  - Price: $180.00 USD\n  - Variants: Color (Black, Blue), Capacity (64GB, 256GB)\n  - [View Product](https://wizybot-demo-store.myshopify.com/products/iphone-se)\n\nLet me know if you need more information or if you're looking for something else!"
}
```
### Swagger
Interactive API documentation is available at `http://localhost:<PORT>/docs` once the app is running


## Project Structure

```
src/
├── chat/         # Chat endpoint + function calling
├── products/     # Product loading, embedding index and semantic search
├── tools/        # Currency conversion tool
├── openai/       # OpenAI client provider
├── common/       # Shared types and helpers
├── config/       # App constants and configuration
└── data/         # products_list.csv
```

## Note:
- Product search: the source CSV contains unescaped double quotes (used as inch marks), which are sanitized before parsing so commas inside quoted fields are preserved

- The embedding index is built in memory at startup and reused for every request