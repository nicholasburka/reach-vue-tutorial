## Reach + Vue CLI Tutorial
by Nicholas Burka

### Info

This is a starter web dApp project using Reach & Vue, that connects to & funds an Algorand wallet. It can be changed to support ETH in two lines of code, or generalized with a little more effort.

There's also a branch using [Vuex](https://github.com/nicholasburka/reach-vue-tutorial/tree/vuex), for more complex projects (recommended - if you're new to Vue, check it out after you finish this & have a working dApp).

Reach is a blockchain-agnostic programming language that allows you to write smart contracts in Javascript-like syntax, automatically verify them, and compile them to multiple blockchains. Reach currently compiles to Ethereum and Algorand, and plans to expand to more soon. For more information on Reach, check out the Reach [site](https://reach.sh/), [docs](https://docs.reach.sh/), and [Discord server](https://discord.com/invite/AZsgcXu​). If you want to see a live Reach project with Vue, check out ['Serious' Rock Paper Scissors](https://nicholasburka.github.io/rps-gui/dist/index.html)

If you're experienced with Vue & Vuex, then you can skip ahead to where I build the wallet manager using a Vuex store. If you're newer to Vue or to web development in general, I'll walk you through the process of building a wallet manager using Vue - first without Vuex, and then switching over to Vuex. 

The main files of interest are:
- [src/App.vue](https://github.com/nicholasburka/reach-vue-tutorial/blob/vue/src/App.vue)
- and [src/components/Wallet.vue](https://github.com/nicholasburka/reach-vue-tutorial/blob/vue/src/components/Wallet.vue)

### Setup & Installation

You'll need
- [node package manager](https://www.npmjs.com/get-npm)
- and [Vue's Command Line Interface](https://cli.vuejs.org/guide/installation.html), which scaffolds the project, compiles vue files, runs a development server, and produces minified builds for distribution

Create your project using vue create proj_name in the command line
```
vue create vuecli-reach-tut
```
You can use the default build, but if you want to flesh your project out later on, manually select options and add Vuex and Vue Router. There's no harm if you never use them.

cd into the project, and install the Reach executable and Reach front-end stdlib (check the [Reach docs](https://docs.reach.sh/tut-1.html) for more info)
```
cd vuecli-reach-tut 

curl https://raw.githubusercontent.com/reach-sh/reach-lang/master/reach -o reach ; chmod +x reach

npm install @reach-sh/stdlib
```
In src/App.vue
- Delete the HelloWorld component from the template, import, and components

### Connecting a Wallet using Reach
see the [Accounts page of the Reach front-end docs](https://docs.reach.sh/ref-frontends-js-acc.html) for API info
- import the Reach library for Algorand
```
import * as reach from '@reach-sh/stdlib/ALGO.mjs'
```
- Create the data and methods that use the Reach standard library to connect to the wallet
```
data: () => {
    return {
      acc: undefined,
      addr: undefined,
      balAtomic: undefined,
      bal: undefined,
   	}
}
```
- acc - the Reach account interface for the wallet, on which Reach functions are called
- addr - the address of the connected wallet
- balAtomic - the balance of the wallet in atomic units
- bal - the readable formatted balance of the wallet
*note: () => arrow function notation works for data, but do not use arrow functions for Vue methods - arrow functions do not include 'this' in their scope*

```
methods: {
    async updateBalance() {
      try {
        this.balAtomic = await reach.balanceOf(this.acc)
        this.bal = reach.formatCurrency(this.balAtomic)
      } catch (err) {
        console.log(err)
      }
    },
```
- get the balance of the current account interface, and convert the atomic balance to readable ALGO units
- many Reach functions that interface with cryptowallets are asynchronous, and try/catch blocks are helpful for handling the errors that may come up, for example if a network/devnet is inaccessible
```
    async connectWallet() {
      try {
        this.acc = await reach.getDefaultAccount()
        this.addr = await this.acc.getAddress()
        this.updateBalance()
      }
      catch (err) {
        console.log(err)
      }
    },
```
- connect to the default account, and get the account's address and balance
```
    async fundWallet() {
      try {
        const fundAmt = 10
        await reach.fundFromFaucet(this.acc, reach.parseCurrency(fundAmt))
        this.updateBalance()
      } catch (err) {
        console.log(err)
      }
    }
  }
```
- fund the wallet with 10 Algos from the devnet faucet and update the balance


### Building the UI to Connect, Display, and Fund a Wallet
Wallet.vue component to display the interface for our Wallet
- button to connect to a wallet
- if there's an address, display address and balance
- button to fund our wallet on devnets
- labels for each button
```
<template>
	<div id="wallet">
		<div><img src="../assets/wallet.png" id="wallet-icon" v-on:click="connectWallet"><p>connect wallet</p></div>
		<div v-if="addr">
			<p id="addr">{{addr}}</p>
			<p id="bal">{{bal}} ALGO</p>
			<div id="faucet">
				<div><img src="../assets/faucet.png" id="faucet-icon" v-on:click="fundWallet">
				<p>fund wallet</p></div>
				<p>(this may take several seconds, devnets only)</p>
			</div>
		</div>
	</div>
</template>
```
- props: addr & bal
- methods: connectWallet -> emit, fundAccount -> emit
- calling emit runs any code that the parent component has attached to this component's 'connectWallet' or 'fundWallet' events
```
<script>
	export default {
		props: ["addr", "bal"],
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
```

Now we integrate Wallet.vue into App.vue
- import Wallet.vue to App.vue, and add it to App.vue's components object
```
import Wallet from './components/Wallet.vue'

import * as reach from '@reach-sh/stdlib/ALGO.mjs'

export default {
  name: 'App',
  components: {
    Wallet
  },
```
- add the Wallet component to the template, provide the wallet props to the Wallet component, and attach to its events
```
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Wallet v-on:connectWallet="connectWallet" v-on:fundWallet="fundWallet" :addr="this.addr" :bal="this.bal"/>
  </div>
</template>
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
 - extra sauce: add a prop that's passed into Wallet.vue for when the devnet is processing a request for funds from the faucet, and conditionally bind a "loading" class to some explanatory text

-in App.vue
```
data: () => {
    return {
      acc: undefined,
      addr: undefined,
      balAtomic: undefined,
      bal: undefined,
      faucetLoading: false
    }
  },
...
async fundWallet() {
  this.faucetLoading = true
  try {
    const fundAmt = 10
    await reach.fundFromFaucet(this.acc, reach.parseCurrency(fundAmt))
    this.updateBalance()
  } catch (err) {
    console.log(err)
  }
  this.faucetLoading = false
}
```
-in Wallet.vue
```
<template>
	<div id="wallet">
		<div class="row with-hover-label"><img src="../assets/wallet.png" id="wallet-icon" v-on:click="connectWallet"><p class="label">connect wallet</p></div>
		<div v-if="addr">
			<p id="addr">{{addr}}</p>
			<div class="row"><p id="bal">{{bal}} ALGO</p><p id="faucet-loading" class="label subtext" v-bind:class="{loading: faucetLoading}">waiting for devnet...</p></div>
			<div id="faucet" class="with-hover-label">
				<div class="row with-hover-label"><img src="../assets/faucet.png" id="faucet-icon" v-on:click="fundWallet">
				<p class="label">fund wallet</p></div>
				<p class="subtext label">(this may take several seconds, devnets only)</p>
			</div>
		</div>
	</div>
</template>
...
<style scoped>
...
#faucet-loading {
	opacity: 0;
	transition: 1s;
}
#faucet-loading.loading {
	opacity: 100;
	transition: 1s;
}
...
</style>
```

Some ideas for extending this project:
- show wallet errors to the user
- a button to copy your wallet address to the clipboard
- make the faucet rain coins instead of displaying "loading..."
- generalize to allow either ETH or ALGO
- run the RPS tutorial program
- use a style library like Vuetify

Keep in mind:
- ./reach update & update your @reach-sh/stdlib often (I made a bash script to update my project)

