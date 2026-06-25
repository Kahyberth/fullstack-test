import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { CHAT_TOOLS } from 'src/common/helper/tools';
import { toProductSummary } from 'src/common/helper/toProductSummary';
import {
  MAX_TOOL_ITERATIONS,
  OPENAI_CHAT_MODEL,
  OPENAI_CLIENT,
  SYSTEM_PROMPT,
} from 'src/config/app.config';
import { QueryDto } from 'src/products/dto/query.dto';
import { ProductsService } from 'src/products/products.service';
import { ConvertCurrencies } from 'src/tools/dto/convertCurrencies.dto';
import { ToolsService } from 'src/tools/tools.service';

@Injectable()
export class ChatService {
  constructor(
    @Inject(OPENAI_CLIENT) private readonly openai: OpenAI,
    private readonly productsService: ProductsService,
    private readonly toolsService: ToolsService,
  ) {}

  /**
   *  Function calling loop: keep calling the model until it returns a final
   *  answer. Each iteration may request tool calls, whose results are fed back
   *  so the model can decide the next step (search a product, then convert its price)
   *  MAX_TOOL_ITERATIONS guards against infinite loops
   */
  async chat(message: string): Promise<string> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ];
    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      const completion = await this.openai.chat.completions.create({
        model: OPENAI_CHAT_MODEL,
        messages,
        tools: CHAT_TOOLS,
      });
      const responseMessage = completion.choices[0].message;
      messages.push(responseMessage);
      if (!responseMessage.tool_calls?.length) {
        return responseMessage.content ?? '';
      }
      for (const toolCall of responseMessage.tool_calls) {
        const result = await this.executeToolCall(toolCall);
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }
    throw new InternalServerErrorException(
      'The assistant could not complete the request',
    );
  }

  private async executeToolCall(
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  ): Promise<unknown> {
    if (toolCall.type !== 'function') return {};
    const args = JSON.parse(toolCall.function.arguments) as unknown;

    switch (toolCall.function.name) {
      case 'searchProducts': {
        const products = await this.productsService.searchProducts(
          args as QueryDto,
        );
        return products.map(toProductSummary);
      }
      case 'convertCurrencies':
        return this.toolsService.convertCurrencies(args as ConvertCurrencies);
      default:
        return { error: `Unknown tool: ${toolCall.function.name}` };
    }
  }
}
