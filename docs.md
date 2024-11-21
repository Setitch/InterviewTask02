https://data-api.binance.vision/

test | GET /api/v3/ping  || 
server time | GET /api/v3/time ||  
symbols | GET /api/v3/exchangeInfo |symbol=? | 20
data | GET /api/v3/aggTrades | symbol	STRING	YES, fromId	LONG	NO	ID to get aggregate trades from INCLUSIVE., startTime	LONG	NO	Timestamp in ms to get aggregate trades from INCLUSIVE., endTime	LONG	NO	Timestamp in ms to get aggregate trades until INCLUSIVE., limit	INT	NO	Default 500; max 1000. | 2
