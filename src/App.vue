<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Wallet v-on:connectWallet="connectWallet" v-on:fundWallet="fundWallet" :addr="this.addr" :bal="this.bal" :faucetLoading="this.faucetLoading"/>
  </div>
</template>

<script>
import Wallet from './components/Wallet.vue'

//updated syntax, fixed by stanleyseow
//import * as reach from '@reach-sh/stdlib/ALGO.mjs'
import { loadStdlib } from '@reach-sh/stdlib';
const reach = loadStdlib("ALGO");

export default {
  name: 'App',
  components: {
    Wallet
  },
  data: () => {
    return {
      acc: undefined,
      addr: undefined,
      balAtomic: undefined,
      bal: undefined,
      faucetLoading: false
      //currency: undefined
    }
  },
  methods: {
    async updateBalance() {
      try {
        this.balAtomic = await reach.balanceOf(this.acc)
        this.bal = String(reach.formatCurrency(this.balAtomic)).substr(0,6)
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
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
