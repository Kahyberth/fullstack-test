import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { OpenAiModule } from 'src/openai/openai.module';
import { ProductsController } from './products.controller';

@Module({
  imports: [OpenAiModule],
  providers: [ProductsService],
  exports: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
