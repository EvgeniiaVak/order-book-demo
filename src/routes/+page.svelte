<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { generateOrderBook } from '$lib/mockOrderbookData';
	import type { OrderbookRow } from '$lib/mockOrderbookData';

	let bids: OrderbookRow[] = [];
	let asks: OrderbookRow[] = [];
	let price: number = 0;
	let maxPossibleCumulativeQuantity: number = 100;
	let intervalId: NodeJS.Timeout;

	const updateOrderBook = () => {
		const { bids: generatedBids, asks: generatedAsks } = generateOrderBook(10, 31000);
		bids = generatedBids;
		asks = generatedAsks;
		price = bids[0].price;
		maxPossibleCumulativeQuantity =
			Math.max(bids[bids.length - 1].cumulativeQuantity, asks[0].cumulativeQuantity) * 1.5;
	};

	onMount(() => {
		updateOrderBook();
		intervalId = setInterval(updateOrderBook, 2000); // Update every second
	});

	onDestroy(() => {
		clearInterval(intervalId); // Clear the interval when the component is destroyed
	});
</script>

<div class="flex justify-center p-5">
	<div class="card w-96 bg-neutral">
		<div class="card-body items-center text-center">
			<table class="table table-xs">
				{#each asks as ask (ask.price)}
					<tr
						class="ask-row"
						style="--quantity: {(ask.cumulativeQuantity / maxPossibleCumulativeQuantity) * 100}%"
					>
						<td>{ask.price.toFixed(2)}</td>
						<td>{ask.quantity.toFixed(2)}</td>
						<td>{ask.cumulativeQuantity.toFixed(2)}</td>
					</tr>
				{/each}
			</table>

			<h2>{price.toFixed(2)}</h2>

			<table class="table table-xs">
				{#each bids as bid (bid.price)}
					<tr
						class="bid-row"
						style="--quantity: {(bid.cumulativeQuantity / maxPossibleCumulativeQuantity) * 100}%"
					>
						<td>{bid.price.toFixed(2)}</td>
						<td>{bid.quantity.toFixed(2)}</td>
						<td>{bid.cumulativeQuantity.toFixed(2)}</td>
					</tr>
				{/each}
			</table>
		</div>
	</div>
</div>

<style>
	.ask-row {
		background: linear-gradient(
			to left,
			#6e001de0 0%,
			#6e001de0 var(--quantity),
			hsl(var(--n) / var(--tw-bg-opacity)) var(--quantity),
			hsl(var(--n) / var(--tw-bg-opacity)) 100%
		);
	}
	.bid-row {
		background: linear-gradient(
			to left,
			#005d22e0 0%,
			#005d22e0 var(--quantity),
			hsl(var(--n) / var(--tw-bg-opacity)) var(--quantity),
			hsl(var(--n) / var(--tw-bg-opacity)) 100%
		);
	}
</style>
