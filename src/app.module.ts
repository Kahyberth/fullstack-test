import { Module } from '@nestjs/common';
import { ToolsModule } from './tools/tools.module';
import './common/envs/app.envs';

@Module({
  imports: [ToolsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
