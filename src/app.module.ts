import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, MyService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MyService],
})
export class AppModule {}
