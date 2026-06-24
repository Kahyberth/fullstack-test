import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  OPENAI_API_KEY: string;
  OPEN_EXCHANGE_APP_ID: string;
}

const envsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required(),
    OPENAI_API_KEY: joi.string().required(),
    OPEN_EXCHANGE_APP_ID: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env) as {
  error: joi.ValidationError | undefined;
  value: EnvVars;
};

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  OPENAI_API_KEY: envVars.OPENAI_API_KEY,
  OPEN_EXCHANGE_APP_ID: envVars.OPEN_EXCHANGE_APP_ID,
};
