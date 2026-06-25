import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { OpenAiModule } from 'src/openai/openai.module';

@Module({
  imports: [OpenAiModule],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
