import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import { AxiosInstance } from 'axios/index';
import { HistoryDbService } from '../../db/services/history.db-service';
import { FetchDto } from '../dto/fetch.dto';
import { BinanceAggregatedResponseType } from '../types/binance.type';

@Injectable()
export class BinanceService {
  protected readonly axios: AxiosInstance = Axios.create({
    baseURL: process.env.BINANCE_API || 'https://api.binance.com',
  });
  
  constructor(
    protected readonly historyDbService: HistoryDbService,
  ) {}
  
  
  async analyze(dto: FetchDto) {
    const rows = await this.fetchPeriod(dto.currency, dto.startTime, dto.endTime);
    if (rows.length === 0) return null;
    
    
  }
  
  protected async fetchPeriod(currency: string, startTime: number, endTime: number) {
    // const rows = await this.historyDbService.fetchPeriod(startTime, endTime);
    // needs better logic for that....  (table with timestamps that are downloaded for given currency, and also range merger there)
    // if (rows.length === 0) {
      return this.downloadPeriod(currency, startTime, endTime);
    // }
    
    // return rows;
  }
  
  protected async downloadPeriod(currency: string, startTime: number, endTime: number) {
    try {
      await this.delayForLimits();
      const response = await this.axios.get<BinanceAggregatedResponseType[]>('/api/v3/aggTrades', {
        params: {
          symbol: currency,
          startTime,
          endTime,
        },
      });
      
      // TODO: check header for limits of API
      
      
      // this should put data into database, but for now - we just need to analyze them 
      {
        // for (let row of response.data) {
        //   await this.historyDbService.upsert({
        //     tradeId: row.a,
        //     currency,
        //     price: row.p,
        //     quantity: row.q,
        //     firstTradeId: row.f,
        //     lastTradeId: row.l,
        //     timestamp: row.T,
        //     wasMaker: row.m,
        //     wasBestMatch: row.M,
        //   });
        // }
      }
      
      // return this.fetchPeriod(currency, startTime, endTime);
      return response.data.map(row => ({
        tradeId: row.a,
        currency,
        price: row.p,
        quantity: row.q,
        firstTradeId: row.f,
        lastTradeId: row.l,
        timestamp: row.T,
        wasMaker: row.m,
        wasBestMatch: row.M,
      }));
    } catch (err) {
      console.log(err);
      // TODO: check error codes, and header for limits of API
      throw err;
    }
  }
  
  
  protected async delayForLimits() {
    // todo: this function must delay for some time (given in last response headers) or fail if delay is longer than mere seconds
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
}
