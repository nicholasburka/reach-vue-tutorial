import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import * as reach from '@reach-sh/stdlib/ALGO.mjs'

export default new Vuex.Store({
  state: {
    acc: undefined,
    addr: undefined,
    balAtomic: undefined,
    bal: undefined,
    balLoading: false
  },
  mutations: {
    setBalance(state, balAtomic) {
        state.balAtomic = balAtomic
        state.bal = reach.formatCurrency(balAtomic)
    },
    setBalLoading(state, isBalLoading) {
        state.balLoading = isBalLoading
    },
    setAcc(state, {acc, addr}) {
        state.acc = acc
        state.addr = addr
    }
  },
  actions: {
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
    async fundWallet({state, commit, dispatch}) {
        commit('setBalLoading', true)
        try {
            const fundAmt = 10
            await reach.fundFromFaucet(state.acc, reach.parseCurrency(fundAmt))
            dispatch('updateBalance')
        } catch (err) {
            console.log(err)
        }
        commit('setBalLoading', false)
    }
  },
  modules: {
  }
})
