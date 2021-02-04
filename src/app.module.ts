import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, MyService, KakaoLogin } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MyService, KakaoLogin],
})
export class AppModule {}
