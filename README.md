## Reach + Vue CLI + Vuex Tutorial
by Nicholas Burka

### Info

This is a starter web dApp project using Reach & Vue, that connects to & funds an Algorand wallet. It can be changed to support ETH in two lines of code, or generalized with a little more effort.

Reach is a blockchain-agnostic programming language that allows you to write smart contracts in Javascript-like syntax, automatically verify them, and compile them to multiple blockchains. Reach currently compiles to Ethereum and Algorand, and plans to expand to more soon. For more information on Reach, check out the Reach [site](https://reach.sh/), [docs](https://docs.reach.sh/), and [Discord server](https://discord.com/invite/AZsgcXu​). If you want to see a live Reach project with Vue, check out ['Serious' Rock Paper Scissors](https://nicholasburka.github.io/rps-gui/dist/index.html)

This branch uses Vuex, handling all wallet state within the Vuex store in src/store/index.js. This simplifies the rest of the code by removing the need for wallet-related props and event passing between components, as all state access + management can happen directly through the store.

### Setup & Installation

You'll need
- [node package manager](https://www.npmjs.com/get-npm)
- and [Vue's Command Line Interface](https://cli.vuejs.org/guide/installation.html), which scaffolds the project, compiles vue files, runs a development server, and produces minified builds for distribution

Create your project using vue create proj_name in the command line
```
vue create vuecli-reach-tut
```
Manually select your options, and choose Vuex and whatever other options you want, like Vue Router. 

cd into the project, and install the Reach executable and Reach front-end stdlib (check the [Reach docs](https://docs.reach.sh/tut-1.html) for more info)
```
cd vuecli-reach-tut 

curl https://raw.githubusercontent.com/reach-sh/reach-lang/master/reach -o reach ; chmod +x reach

npm install @reach-sh/stdlib
```
In src/App.vue
- Delete the HelloWorld component from the template, import, and components

### Connecting a Wallet using Reach
see the [Accounts page of the Reach front-end docs](https://docs.reach.sh/ref-frontends-js-acc.html) for API info, and check out the [Vuex core concepts](https://vuex.vuejs.org/guide/state.html) as needed if this is new to you
- in src/store/index.js import the Reach library for Algorand
```
import * as reach from '@reach-sh/stdlib/ALGO.mjs'
```
- make your wallet state vars
```
export default new Vuex.Store({
  state: {
    acc: undefined,
    addr: undefined,
    balRaw: undefined,
    bal: undefined
  },
```
- acc - the Reach account interface for the wallet, on which Reach functions are called
- addr - the address of the connected wallet
- balRaw - the balance of the wallet in atomic units
- bal - the readable formatted balance of the wallet

- mutations
```
mutations: {
  setBalance(state, balAtomic) {
      state.balAtomic = balAtomic
      state.bal = reach.formatCurrency(balAtomic)
  },
  setAcc(state, {acc, addr}) {
      state.acc = acc
      state.addr = addr
  }
},
```
- setBalance
 - use the atomic balance to set state.balAtomic and state.bal
- setAcc
 - store the reach account interface & the wallet address

- actions
- updateBalance
- get the balance of the account and commit it
```
async updateBalance({state, commit}) {
        try {
          console.log(state.acc)
          const balAtomic = await reach.balanceOf(state.acc)
          console.log(state.acc)
          console.log(balAtomic)
          commit('setBalance', balAtomic)  
      } catch (err) {
          console.log(err)
      }
    },
```
- connectWallet
- try to get the default account and its address, then commit these
```
async connectWallet({commit, dispatch}) {
        try {
            const acc = await reach.getDefaultAccount()
            console.log(acc)
            const addr = await acc.getAddress()
            commit('setAcc', {acc,addr})
            dispatch('updateBalance')
        }
        catch (err) {
            console.log(err)
        }
    },
```
- fundWallet
- try to call reach.fundFromFaucet to fund the wallet from the devnet
```
async fundWallet({state, commit, dispatch}) {
        try {
            const fundAmt = 10
            await reach.fundFromFaucet(state.acc, reach.parseCurrency(fundAmt))
            dispatch('updateBalance')
        } catch (err) {
            console.log(err)
        }
    }
```

### Building the UI to Connect, Display, and Fund a Wallet
- create a Wallet.vue component to call wallet functions & display the wallet address and balance
```
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
```
- to get the state from store within the Wallet component, import & call [mapState](https://vuex.vuejs.org/guide/state.html#the-mapstate-helper) to the computed variables of the component
```
<script>
	import {mapState} from 'vuex'

	export default {
		computed: {
			...mapState({
				addr: state => state.addr,
				bal: state => state.bal
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
```
- to call the wallet functions, we access the store directly and dispatch the corresponding actions

In App.vue
- Add the wallet to the template & in the App components object
```
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Wallet/>
  </div>
</template>

<script>
import Wallet from './components/Wallet.vue'

export default {
  name: 'App',
  components: {
    Wallet
  },
  data: () => {
    return {
    }
  },
  methods: {
  }
}
</script>
```

### Testing
To try it, run
- In one shell: 
```
REACH_CONNECTOR_MODE=ALGO ./reach/reach devnet
```
- And in another:
```
npm run serve 
```

### Styling
- position wallet div in top left corner
```
#wallet {
	position: absolute;
	top: 1vh;
	left: 1vw;
	margin-top: .5vh;
	margin-bottom: 0vh;
	text-align: left;
}
```
- Write CSS classes:
 - row : place items side by side using flex
 - with-hover-label : reveal button icon labels on hover
 - label : label to reveal on hover
 - others: sizing and little tweaks
```
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
```
- assign classes / ID's to elements
- add row divs to align images and labels
```
<template>
	<div id="wallet">
		<div class="row with-hover-label"><img src="../assets/wallet.png" id="wallet-icon" v-on:click="connectWallet"><p class="label">connect wallet</p></div>
		<div v-if="addr">
			<p id="addr">{{addr}}</p>
			<p id="bal">{{bal}} ALGO</p>
			<div id="faucet" class="with-hover-label">
				<div class="row with-hover-label"><img src="../assets/faucet.png" id="faucet-icon" v-on:click="fundWallet">
				<p class="label">fund wallet</p></div>
				<p class="subtext label">(this may take several seconds, devnets only)</p>
			</div>
		</div>
	</div>
</template>
```

Some ideas for extending this project:
- show wallet errors to the user
- a button to copy your wallet address to the clipboard
- make the faucet rain coins instead of displaying "loading..."
- generalize to allow either ETH or ALGO
- run the RPS tutorial program

Keep in mind:
- ./reach update & update your @reach-sh/stdlib often (I made a bash script to update my project)
