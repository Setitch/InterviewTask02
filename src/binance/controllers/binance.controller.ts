import { Controller, Get } from '@nestjs/common';
import { BinanceService } from '../services/binance.service';

@Controller('/binance')
export class BinanceController {
  constructor(
    private readonly binanceService: BinanceService,
  ) {}
  
  @Get('/fetch')
  async fetchData() {
    
  }
  
  @Get('/analyze')
  async analyze() {
    
  }
  
  @Get('/display')
  async display() {
    
  }
  
  
  @Get('/execute')
  async execute() {
    
  }
}
