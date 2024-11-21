import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BinanceModule } from './binance/binance.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [ DbModule, BinanceModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
