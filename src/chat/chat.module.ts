import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { OpenAiModule } from 'src/openai/openai.module';
import { ProductsModule } from 'src/products/products.module';
import { ToolsModule } from 'src/tools/tools.module';

@Module({
  imports: [OpenAiModule, ProductsModule, ToolsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
