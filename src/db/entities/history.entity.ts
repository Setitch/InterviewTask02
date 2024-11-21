import { AllowNull, Column, DataType, Index, Model, Table } from 'sequelize-typescript';

export interface HistoryEntityCreationAttributes {
  tradeId: number;
  price: string;
  quantity: string;
  firstTradeId: number;
  lastTradeId: number;
  timestamp: number;
  wasMaker: boolean;
  wasBestMatch: boolean;
}

export interface HistoryEntityAttributes extends HistoryEntityCreationAttributes {
  id: number;
}


@Table({
  tableName: 'history',
  timestamps: false,
  paranoid: false,
})
export class HistoryEntity extends Model<HistoryEntityAttributes, HistoryEntityCreationAttributes> {
  @AllowNull(false)
  @Column(DataType.INTEGER)
  tradeId: number;
  
  @AllowNull(false)
  @Column(DataType.STRING)
  price: string;
  
  @AllowNull(false)
  @Column(DataType.STRING)
  quantity: string;
  
  @AllowNull(false)
  @Column(DataType.INTEGER)
  firstTradeId: number;
  
  @AllowNull(false)
  @Column(DataType.INTEGER)
  lastTradeId: number;
  
  @Index
  @AllowNull(false)
  @Column(DataType.INTEGER)
  timestamp: number;
  
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  wasMaker: boolean;
  
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  wasBestMatch: boolean;
}
