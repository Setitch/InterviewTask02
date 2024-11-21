import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { HistoryEntity } from '../entities/history.entity';

@Injectable()
export class HistoryDbService {
  constructor(
    @Inject('DB_ENTITY--HISTORY') protected readonly history: typeof HistoryEntity,
  ) {}
  
  async fetchPeriod(from: number, to: number) {
    const exists = await this.history.count({
      where: {
        [Op.and]: [
          {
            timestamp: {
              [Op.gte]: from,
            },
          },
          {
            timestamp: {
              [Op.lte]: to,
            },
          },
        ],
      },
    });
    
    if (exists === 0) {
      return [];
    }
    
    
    return this.history.findAll({
      where: {
        // timestamp: {[Op.between]: [from, to]}
        [Op.and]: [
          {
            timestamp: {
              [Op.gte]: from,
            },
          },
          {
            timestamp: {
              [Op.lte]: to,
            },
          },
        ],
      },
    });
  }
}
