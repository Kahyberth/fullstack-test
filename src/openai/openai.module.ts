import { Module, Provider } from '@nestjs/common';
import OpenAI from 'openai';
import { envs } from 'src/common/envs/app.envs';
import { OPENAI_CLIENT } from 'src/config/app.config';

const openAiProvider: Provider = {
  provide: OPENAI_CLIENT,
  useFactory: () => new OpenAI({ apiKey: envs.OPENAI_API_KEY }),
};

@Module({
  providers: [openAiProvider],
  exports: [openAiProvider],
})
export class OpenAiModule {}
