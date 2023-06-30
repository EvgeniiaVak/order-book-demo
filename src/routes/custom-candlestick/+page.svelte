<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { COLORS } from '$lib/constants';

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let candlestickWidth: number;
	interface CandlestickData {
		timestamp: Date;
		open: number;
		high: number;
		low: number;
		close: number;
	}

	// Generate mock data with 1-minute intervals
	let data: CandlestickData[] = [];
	let date = new Date();
	for (let i = 0; i < 60; i++) {
		data.push({
			timestamp: date,
			open: Math.random() * 10 + 10,
			high: Math.random() * 10 + 20,
			low: Math.random() * 10,
			close: Math.random() * 10 + 10
		});
		date = new Date(date.getTime() + 60 * 1000); // Add 1 minute
	}

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Failed to get 2D context');
		}
		context = ctx;
		canvas.width = canvas.offsetWidth; // Set the width of the canvas to be 100% of its container
		candlestickWidth = canvas.width / data.length; // Calculate the width of each candlestick based on the width of the canvas and the number of data points
		drawCandlestickChart();
		window.addEventListener('resize', resizeCanvas);
	});

	afterUpdate(() => {
		if (context) {
			drawCandlestickChart();
		}
	});

	function resizeCanvas() {
		if (!canvas) {
			return;
		}
		canvas.width = canvas.offsetWidth;
		candlestickWidth = canvas.width / data.length;
		if (context) {
			drawCandlestickChart();
		}
	}

	function drawCandlestickChart() {
		if (!context) {
			return;
		}

		let x = 0;

		// Find the minimum and maximum values in the data
		let minValue = Math.min(...data.map((datum) => datum.low));
		let maxValue = Math.max(...data.map((datum) => datum.high));

		// Add a small margin to the minimum and maximum values
		minValue -= minValue * 0.05;
		maxValue += maxValue * 0.05;

		// Reduce the width of each candlestick by 20% to add space between the candlesticks
		let adjustedCandlestickWidth = candlestickWidth * 0.8;

		data.forEach((datum, index) => {
			if (!context) {
				return;
			}
			// Scale the y-coordinates based on the minimum and maximum values
			let high = canvas.height - ((datum.high - minValue) / (maxValue - minValue)) * canvas.height;
			let low = canvas.height - ((datum.low - minValue) / (maxValue - minValue)) * canvas.height;
			let open = canvas.height - ((datum.open - minValue) / (maxValue - minValue)) * canvas.height;
			let close =
				canvas.height - ((datum.close - minValue) / (maxValue - minValue)) * canvas.height;

			// Draw the line from high to low
			context.beginPath();
			context.moveTo(x + adjustedCandlestickWidth / 2, high);
			context.lineTo(x + adjustedCandlestickWidth / 2, low);
			context.strokeStyle = datum.open < datum.close ? COLORS.green : COLORS.red;
			context.stroke();

			// Draw the body of the candlestick
			context.beginPath();
			context.rect(
				x,
				open < close ? open : close,
				adjustedCandlestickWidth,
				Math.abs(open - close)
			);
			context.fillStyle = datum.open < datum.close ? COLORS.green : COLORS.red;
			context.fill();

			// Increase the x-coordinate by the original candlestick width to add space between the candlesticks
			x += candlestickWidth;
		});
	}
</script>

<div class="card bg-neutral p-3 m-6">
	<canvas bind:this={canvas} class="h-full w-full" />

	<!-- positioning each label under the corresponding candle is not easy to achive  -->
	<!-- <div class="text-xs relative">
		{#each data as datum, index (index)}
			{#if index % 4 === 0}
				<span class="label absolute">
					{datum.timestamp.getHours().toString().padStart(2, '0')}:{datum.timestamp
						.getMinutes()
						.toString()
						.padStart(2, '0')}
				</span>
			{/if}
		{/each}
	</div> -->
</div>
