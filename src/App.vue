<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Wallet v-on:connectWallet="connectWallet" v-on:fundAccount="fundAccount" :addr="this.addr" :bal="this.bal"/>
  </div>
</template>

<script>
import Wallet from './components/Wallet.vue'

import * as reach from '@reach-sh/stdlib/ALGO.mjs'

export default {
  name: 'App',
  components: {
    Wallet
  },
  data: () => {
    return {
      acc: undefined,
      addr: undefined,
      balRaw: undefined,
      bal: undefined
      //currency: undefined
    }
  },
  methods: {
    async updateBalance() {
      this.balRaw = await reach.balanceOf(this.acc)
      this.bal = String(reach.formatCurrency(this.balRaw)).substr(0,6)
    },
    async connectWallet() {
      console.log('conn')
      console.log(this)
      console.log(this.acc)
      this.acc = await reach.getDefaultAccount()
      this.addr = await this.acc.getAddress()
      this.bal = await reach.balanceOf(this.acc)
      console.log(this.acc)
    },
    async fundAccount() {
      const fundAmt = 10
      await reach.fundFromFaucet(this.acc, reach.parseCurrency(fundAmt))
      console.log('funded')
      this.updateBalance()
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
