<template>
	<div id="wallet">
		<img src="../assets/wallet.png" id="wallet-icon" v-on:click="connectWallet">
		<p>connect wallet</p>
		<div v-if="addr">
			<p id="addr">{{addr}}</p>
			<p id="bal">{{bal}} ALGO</p>
			<div id="faucet">
				<img src="../assets/faucet.png" id="faucet-icon" v-on:click="fundWallet">
				<p>fund wallet</p>
				<p>(this may take several seconds, devnets only)</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ["addr", "bal", "faucetLoading"],
		methods: {
			connectWallet: function() {
				console.log("conn")
				this.$emit('connectWallet')
			},
			fundWallet: function() {
				this.$emit('fundWallet')
			}
		}
	}
</script>