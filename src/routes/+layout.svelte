<script>
	import { base } from '$app/paths';
	import '../app.css';
</script>

<div class="m-6">
	<div class="navbar justify-center">
		<a class="btn btn-ghost normal-case" href="{base}/">order-book</a>
		<a class="btn btn-ghost normal-case" href="{base}/custom-candlestick">custom-candlestick</a>
		<a class="btn btn-ghost normal-case" href="{base}/tradingview-candlestick"
			>tradingview-candlestick</a
		>
	</div>

	<slot />
</div>
