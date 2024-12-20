import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { BinanceController } from './controllers/binance.controller';
import { BinanceService } from './services/binance.service';

@Module({
  imports: [DbModule],
  controllers: [BinanceController],
  providers: [BinanceService],
  exports: [],
})
export class BinanceModule {}
