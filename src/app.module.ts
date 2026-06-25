import { Module } from '@nestjs/common';
import { ToolsModule } from './tools/tools.module';

import { ProductsModule } from './products/products.module';
import { ChatModule } from './chat/chat.module';

import './common/envs/app.envs';

@Module({
  imports: [ToolsModule, ProductsModule, ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
