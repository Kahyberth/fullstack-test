import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async chat(@Body() chatDto: ChatDto): Promise<{ response: string }> {
    const response = await this.chatService.chat(chatDto.message);
    return { response };
  }
}
