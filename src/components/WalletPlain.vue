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

<style scoped>
#wallet {
	position: absolute;
	top: 1vh;
	left: 1vw;
	margin-top: .5vh;
	margin-bottom: 0vh;
	text-align: left;
}
#faucet-loading {
	opacity: 0;
	transition: 1s;
}
#faucet-loading.loading {
	opacity: 100;
	transition: 1s;
}
.row {
	display: flex;
	flex-direction: row;
}
.label {
	margin-left: .5vw;
}
.with-hover-label .label {
	opacity: 0;
	transition: 1s;
}
.with-hover-label:hover > .label {
	opacity: 100;
	transition: 1s;
}
p {
	margin-top: .5vh;
	margin-bottom: 0vh;
	align-self: center;
}
.subtext {
	font-size: 1vw;
}
#wallet-icon {
	max-height: 10vh;
	width: auto;
	display: block;
}
#faucet-icon {
	max-height: 7vh;
	left: 2vw;
	width: auto;
}
#addr {
	font-size: .5vw;
}
#bal {
	font-size: 2vw;
}
</style>