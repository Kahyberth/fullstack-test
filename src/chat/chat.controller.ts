import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a message to the chatbot' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The final natural language answer from the chatbot',
    schema: {
      example: {
        response:
          'We have the iPhone 12 (900 USD) and the iPhone 13 (1099 USD).',
      },
    },
  })
  async chat(@Body() chatDto: ChatDto): Promise<{ response: string }> {
    const response = await this.chatService.chat(chatDto.message);
    return { response };
  }
}
