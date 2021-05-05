<template>
	<div id="wallet">
		<div class="row with-hover-label"><img src="../assets/wallet.png" id="wallet-icon" v-on:click="connectWallet"><p class="caption">connect wallet</p></div>
		<div v-if="addr">
			<p id="addr">{{addr}}</p>
			<div class="row"><p id="bal">{{bal}} ALGO</p><p id="bal-loading" class="caption subtext" v-bind:class="{loading: balLoading}">waiting for devnet...</p></div>
			<div id="faucet" class="with-hover-label">
				<div class="row with-hover-label"><img src="../assets/faucet.png" id="faucet-icon" v-on:click="fundWallet">
				<p class="caption">fund wallet</p></div>
				<p class="subtext caption">(this may take several seconds, devnets only)</p>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex'

	export default {
		computed: {
			...mapState({
				addr: state => state.addr,
				bal: state => state.bal,
				balLoading: state => state.balLoading
			})
		},
		methods: {
			connectWallet: function() {
				this.$store.dispatch('connectWallet')
			},
			fundWallet: function() {
				this.$store.dispatch('fundWallet')
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
#bal-loading {
	opacity: 0;
	transition: 1s;
}
#bal-loading.loading {
	opacity: 100;
	transition: 1s;
}
.row {
	display: flex;
	flex-direction: row;
}
.caption {
	margin-left: .5vw;
}
.with-hover-label .caption {
	opacity: 0;
	transition: 1s;
}
.with-hover-label:hover > .caption {
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