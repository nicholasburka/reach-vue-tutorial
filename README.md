## Reach + Vue CLI Tutorial
by Nicholas Burka

### Info

This is a starter web dApp project using Reach & Vue, that connects to & funds an Algorand wallet. It can be changed to support ETH in two lines of code, or generalized with a little more effort.

There's also a branch using [Vuex](), for more complex projects (recommended - if you're new to Vue, check it out after you finish this & have a working dApp).

Reach is a blockchain-agnostic programming language that allows you to write smart contracts in Javascript-like syntax, automatically verify them, and compile them to multiple blockchains. Reach currently compiles to Ethereum and Algorand, and plans to expand to more soon. For more information on Reach, check out the Reach [site](https://reach.sh/), [docs](https://docs.reach.sh/), and [Discord server](https://discord.com/invite/AZsgcXu​).

If you're experienced with Vue & Vuex, then you can skip ahead to where I build the wallet manager using a Vuex store. If you're newer to Vue or to web development in general, I'll walk you through the process of building a wallet manager using Vue - first without Vuex, and then switching over to Vuex. Check the description for the final project code with or without Vuex.

### Setup & Installation

You'll need
- [node package manager](https://www.npmjs.com/get-npm), to install packages for our project
- and [Vue's Command Line Interface](https://cli.vuejs.org/guide/installation.html), which helps us scaffold the project, compile vue files, run a development server, and produce minified builds for distribution

- Reach install info (steps replicated here): https://docs.reach.sh/tut-1.html 

Create your project using vue create proj_name in the command line
```
vue create vuecli-reach-tut
```
You can use the default build, but if you want to flesh your project out later on, manually select options and add Vuex and Vue Router. There's no harm if you never use them.

cd into the project, and install the Reach executable and Reach front-end stdlib
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
- data: acc, addr, balRaw, and bal
```
data: () => {
    return {
      acc: undefined,
      addr: undefined,
      balRaw: undefined,
      bal: undefined,
   	}
}
```
*note: do not use () => notation for Vue methods - arrow functions do not include 'this' in their scope*
- methods: updateBalance, connectWallet, fundWallet
```
methods: {
    async updateBalance() {
      try {
        this.balRaw = await reach.balanceOf(this.acc)
        this.bal = String(reach.formatCurrency(this.balRaw)).substr(0,6)
      } catch (err) {
        console.log(err)
      }
      
    },
    async connectWallet() {
      try {
        this.acc = await reach.getDefaultAccount()
        this.addr = await this.acc.getAddress()
        this.bal = await reach.balanceOf(this.acc)
      }
      catch (err) {
        console.log(err)
      }
    },
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
```
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
```
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

### Testing
Try it:
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
- Write classes:
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
      balRaw: undefined,
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

Create a Wallet.vue component file that will connect to an Algorand wallet, display the address and balance

Complex architecture.
vue create vuecli-reach-tut
manually select features
select Vuex, you'll likely also want Router

store/index.js
- import * as reach 
- state vars
- acc - the Reach account abstraction for the wallet, on which Reach functions are called
- addr - the address of the connected wallet
- balRaw - the balance of the wallet in atomic units
- bal - the readable formatted balance of the wallet

- mutations
- setBalance
 - take the rawBalance and set state.balRaw and state.bal
- setAcc

- actions
- updateBalance
- get the balance of the account and commit it

- connectWallet
- try to get the default account and its address, then commit these

- fundAccount 
- call 

App.vue
-Wallet component

Some ideas for extending this project:
- show wallet errors to the user
- a button to copy your wallet address to the clipboard
- make the faucet rain coins instead of displaying "loading..."
- generalize to allow either ETH or ALGO
- run the RPS tutorial program

Keep in mind:
- ./reach update & update your @reach-sh/stdlib often (I made a bash script to update my project)

We'll create a basic project template by running vue create in the terminal. Vue CLI will prompt you for some architectural decisions - we'll use the default options.

Since Vue is stateless on its own, for any project larger than a mostly static single page application I recommend using Vuex and handling wallet state within a store. I've built a complete wallet management module using Reach that's available here. If not, it's doable to manage state within the data & methods of the top-level vue file. I'll talk about this later.

Go ahead and download Reach to your project directory. The reach executable allows you to compile smart contracts & run them locally. You can also run local developer networks for supported blockchains. In this video I'm only using Reach's Algorand developer network.

Use npm to install the reach javascript library.

Now that we've constructed the frame for our project, we can start coding. In order to interact with any smart contract I create in Reach, I need to be able to connect to a cryptocurrency wallet. Reach's javascript standard library provides an easy interface to connect to any supported chain's browser-based wallet - I've used MetaMask on Ethereum and Algosigner on Algorand. 

It's good practice to keep asynchronous code blocks within try/catch. There can be all kinds of errors during the blockchain dev process and you'll want to know whether these are related to your code or your connection to the wallet or blockchain.

All kinds of things we could add to this. Add a loading icon.

-Integrate the reach package
Let's start by building the code that will interface with the browser wallets, using Reach.

Open store/index.js 

To incorporate the chain you want to support in your app - just import the stdlib. If you want to support multiple chains, you can import each stdlib & a variable for the current currency. The compiled smart contracts are within the same file. The logic to run the smart contract between each chain is the same, but the logic for getting wallet metadata is slightly different.

import reach stdlib

-Create the html for the connect wallet button
Since the wallet is a fundamental component of any blockchain app, we'll make a wallet manager Vue component file that can be displayed on any page of the app.

Wallet.Vue

-Integrate the connect wallet button html with reach

-Download and setup a test algosigner wallet

-Create a fund wallet option as a dropdown of the button

When you're developing your application, Reach provides an interface to create local devnets where you can fund test wallets and run your program for free. Let's create a fund button that prompts the Reach stdlib to request some money from the "faucet" of these devnets.

First we'll set up a fundFromFaucet function in store/index.js.

Then we'll add a faucet icon to Wallet.Vue 

-Bring in vuetify and style

Now we have a functional wallet manager to connect and fund wallets for Algorand 

-Final wrap up