import { Controller, Get, Param, Query } from '@nestjs/common';
import { FetchDto } from '../dto/fetch.dto';
import { BinanceService } from '../services/binance.service';

@Controller('/binance')
export class BinanceController {
  constructor(
    private readonly binanceService: BinanceService,
  ) {}
  @Get('/execute')
  async execute(@Param() dto: FetchDto) {
    return await this.binanceService.analyze(dto);
  }
}
