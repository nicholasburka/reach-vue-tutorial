<template>
	<div id="wallet">
		<img src="../assets/wallet.png" id="wallet-icon" v-on:click="connectWallet">
		<div v-if="addr">
			<p id="addr">{{addr}}</p>
			<p id="bal">{{bal}} ALGO</p>
			<div id="faucet">
				<img src="../assets/faucet.png" id="faucet-icon" v-on:click="fundAccount">
				<p>click here to fund your account</p>
				<p class="subtext">(this may take several seconds, devnets only)</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ["addr", "bal"],
		methods: {
			connectWallet: function() {
				console.log("conn")
				this.$emit('connectWallet')
			},
			fundAccount: function() {
				this.$emit('fundAccount')
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
p {
	margin-top: .5vh;
	margin-bottom: 0vh;
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
#faucet {
	color: white;
	transition: .5s;
}
#faucet:hover {
	color: black;
	transition: .5s;
}
</style>