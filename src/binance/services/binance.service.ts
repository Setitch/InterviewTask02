import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import { AxiosInstance } from 'axios/index';
import { HistoryDbService } from '../../db/services/history.db-service';

@Injectable()
export class BinanceService {
  protected readonly axios: AxiosInstance = Axios.create({
    baseURL: process.env.BINANCE_API || 'https://api.binance.com',
  });
  
  constructor(
    protected readonly historyDbService: HistoryDbService,
  ) {}
  
  
  async fetchPeriod(startTime: number, endTime: number) {
    let rows = await this.historyDbService.fetchPeriod(startTime, endTime);
    if (rows.length === 0) {
      rows = await this.downloadPeriod(startTime, endTime);
    }
    
    return rows;
  }
  
  protected async downloadPeriod(startTime: number, endTime: number) {
    this.axios.get('/api/v3/aggTrades', {
      params: {
        startTime,
        endTime,
      },
    });
    return [];
  }
}
