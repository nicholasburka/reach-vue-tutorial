Reach + Vue CLI Tutorial
by Nicholas Burka

Info

This is a basic starter project to connect to & fund an Algorand wallet for building blockchain dApps on the web using Reach and Vue. It can be changed to support ETH in two lines of code, or generalized with a little more effort.

There's also a branch using [Vuex](), for more complex projects (recommended - if you're new to Vue, check it out after you finish this & have a working dApp).

Reach is a blockchain-agnostic programming language that allows you to write smart contracts in Javascript-like syntax, automatically verify them, and compile them to multiple blockchains. Reach currently compiles to Ethereum and Algorand, and plans to expand to more soon. For more information on Reach, check out the Reach [site](), [docs](), and [Discord server]().

If you're experienced with Vue & Vuex, then you can skip ahead to where I build the wallet manager using a Vuex store. If you're newer to Vue or to web development in general, I'll walk you through the process of building a wallet manager using Vue - first without Vuex, and then switching over to Vuex. Check the description for the final project code with or without Vuex.

Setup & Installation

You'll need
- [node package manager](), to install packages for our project
- and [Vue's Command Line Interface](), which helps us scaffold the project, compile vue files, run a development server, and produce minified builds for distribution

- you'll also want to install Reach in your project directory after you create your scaffolding
- Reach: https://docs.reach.sh/tut-1.html 

Create your project using vue create proj_name in the command line

vue create vuecli-reach-tut
curl reach

App.vue
- Delete the HelloWorld component from the template, import, and components

Connecting a Wallet using Reach
- import the Reach library for Algorand
- Create the data and methods that use the Reach standard library to connect to the wallet
- data: acc, addr, balRaw, and bal
- methods: connectWallet, fundAccount, updateBalance

Building the UI to Connect, Display, and Fund a Wallet
Wallet.vue component to display the interface for our Wallet
- display address and balance,
- button to connect to a wallet
- button to fund our wallet on devnets
- labels for each button

- props: addr & bal
- methods: connectWallet -> emit, fundAccount -> emit
- Interface:
- image to connect to wallet
- if there's an addr, then display info and the fund button

Testing
- Try it: 
- REACH_CONNECTOR_MODE=ALGO ./reach/reach devnet
- npm run serve 

Styling
- semantic classes:
 - row : place items side by side using flex
 - with-hover-label : reveal button icon labels on hover
 - label : label to reveal on hover
 - others: sizing and little tweaks
 - extra sauce: add a prop that's passed into Wallet.vue for when the devnet is processing a request for funds from the faucet, and conditionally bind a "loading" class to some explanatory text

- position wallet div in top left corner
- give every element a slight margin between
- align on left


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