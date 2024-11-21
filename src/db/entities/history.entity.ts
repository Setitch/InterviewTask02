import { AllowNull, Column, DataType, Index, Model, PrimaryKey, Table } from 'sequelize-typescript';

export interface HistoryEntityCreationAttributes {
  tradeId: number;
  currency: string;
  price: string;
  quantity: string;
  firstTradeId: number;
  lastTradeId: number;
  timestamp: number;
  wasMaker: boolean;
  wasBestMatch: boolean;
}

export interface HistoryEntityAttributes extends HistoryEntityCreationAttributes {
  id: never;
}


@Table({
  tableName: 'history',
  timestamps: false,
  paranoid: false,
})
export class HistoryEntity extends Model<HistoryEntityAttributes, HistoryEntityCreationAttributes> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER)
  tradeId: number;
  
  @Index
  @AllowNull(false)
  @Column(DataType.STRING)
  currency: string;
  
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
