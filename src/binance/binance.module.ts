import { Module } from '@nestjs/common';
import { BinanceController } from './controllers/binance.controller';
import { BinanceService } from './services/binance.service';

@Module({
  imports: [],
  controllers: [BinanceController],
  providers: [BinanceService],
  exports: [],
})
export class BinanceModule {}
