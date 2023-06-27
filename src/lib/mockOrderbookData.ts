// mockOrderbookData.ts

export interface Order {
	price: number;
	quantity: number;
}

export interface OrderbookRow extends Order {
	cumulativeQuantity: number;
}

function bidsCumulative(bids: Order[]): OrderbookRow[] {
	// sort bids by price descending
	bids.sort((a, b) => b.price - a.price);
	let cumulativeQuantity = 0;
	return bids.map((bid) => {
		cumulativeQuantity += bid.quantity;
		return { ...bid, cumulativeQuantity };
	});
}

function asksCumulative(asks: Order[]): OrderbookRow[] {
	// sorting in reverse for calculating cumulative quantity
	asks.sort((a, b) => a.price - b.price);
	let cumulativeQuantity = 0;
	let result = asks.map((ask) => {
		cumulativeQuantity += ask.quantity;
		return { ...ask, cumulativeQuantity };
	});

	// reverse back the order of the asks
	return result.reverse();
}

export function generateOrderBook(
	depth: number,
	aroundPrice: number
): { bids: OrderbookRow[]; asks: OrderbookRow[] } {
	let bids: Order[] = [];
	let asks: Order[] = [];

	for (let i = 0; i < depth; i++) {
		const bid: Order = {
			price: aroundPrice - Math.random() * 100,
			quantity: 10 + Math.random() * 1000
		};
		const ask: Order = {
			price: aroundPrice + Math.random() * 100,
			quantity: 10 + Math.random() * 1000
		};

		bids.push(bid);
		asks.push(ask);
	}

	let bidsWithCumulative: OrderbookRow[] = bidsCumulative(bids);
	let asksWithCumulative: OrderbookRow[] = asksCumulative(asks);

	return { bids: bidsWithCumulative, asks: asksWithCumulative };
}
