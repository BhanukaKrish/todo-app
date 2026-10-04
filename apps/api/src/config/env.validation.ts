import { plainToInstance } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  @IsString()
  MONGODB_URI: string = 'mongodb://localhost:27017/todos';

  /** Comma-separated list of allowed CORS origins. */
  @IsString()
  CORS_ORIGIN: string = 'http://localhost:5173';
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const env = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(env, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(`Invalid environment configuration:\n${errors.toString()}`);
  }
  return env;
}
