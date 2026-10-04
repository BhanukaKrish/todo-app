import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { type Connection } from 'mongoose';

@Controller('health')
export class AppController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  health() {
    return {
      status: 'ok',
      database:
        this.connection.readyState === mongoose.ConnectionStates.connected
          ? 'up'
          : 'down',
    };
  }
}
