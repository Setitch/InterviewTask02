export interface BinanceAggregatedResponseType {
  a: number;        // Aggregate tradeId
  p: string;        // Price
  q: string;        // Quantity
  f: number;        // First tradeId
  l: number;        // Last tradeId
  T: number;        // Timestamp
  m: boolean;       // Was the buyer the maker?
  M: boolean;       // Was the trade the best price match?
}

