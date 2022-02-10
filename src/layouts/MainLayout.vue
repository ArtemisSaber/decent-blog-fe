<template>
  <q-layout view="lHh Lpr lFf">
    <q-banner
      v-show="showBanner"
      inline-actions
      rounded
      class="bg-orange text-white"
    >
      Thank you for buying me a coffee! Your transaction hash is: {{ txHash }}

      <template v-slot:action>
        <q-btn flat label="Dismiss" @click="showBanner = false" />
      </template>
    </q-banner>
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Stellar Saber </q-toolbar-title>
        <q-btn
          v-if="etherAccount.length > 0"
          color="secondary"
          icon="fab fa-ethereum"
          :label="etherAccount[0]"
          @click="walletConnect"
        />
        <q-btn
          v-else
          color="secondary"
          icon="fab fa-ethereum"
          label="Connect Wallet"
          @click="walletConnect"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-img src="~assets/image/sorey.jpg" :ratio="21 / 9" />
      <q-list>
        <q-item-label header> About Me </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-item clickable tag="span" target="_blank" @click="buyMeCoffee">
          <q-item-section avatar>
            <q-icon name="fab fa-ethereum" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Buy Me a Coffee</q-item-label>
            <q-item-label caption> stellarsaber.nft </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue';
const linksList = [
  {
    title: 'GitHub',
    caption: 'My GitHub',
    icon: 'fab fa-github',
    link: 'https://github.com/ArtemisSaber/',
  },
  {
    title: 'Upwork',
    caption: 'My Upwork profile',
    icon: 'work',
    link: 'https://upwork.com/freelancers/~01a4b9ff23b6351d97',
  },
  {
    title: 'Final Fantasy XIV',
    caption: 'My Final Fantasy XIV Character',
    icon: 'gamepad',
    link: 'https://na.finalfantasyxiv.com/lodestone/character/24142891/',
  },
  {
    title: 'E-Mail',
    caption: 'chenhao.w@gmail.com',
    icon: 'mail',
    link: 'mailto:chenhao.w@gmail.com',
  },
];

import { defineComponent, ref } from 'vue';
const Web3 = require('web3/dist/web3.min.js');
export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  data() {
    return {
      web3: new Web3(),
      etherAccount: new Array<string>(),
      showBanner: false,
      txHash: '',
    };
  },
  methods: {
    initEthereum() {
      if (typeof window.ethereum === undefined) {
        alert('Please install MetaMask to use this dApp.');
        return;
      } else {
        this.web3 = new Web3(window.ethereum);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.web3.eth.getAccounts().then((accounts: any) => {
          this.etherAccount = accounts;
        });
      }
    },
    async walletConnect() {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log(accounts);
        if (accounts && (accounts as Array<string>).length > 0) {
          this.etherAccount = accounts as Array<string>;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async buyMeCoffee() {
      const account = this.etherAccount[0];
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const netId = await this.web3.eth.net.getId();
        let transactionValue = '0.01';
        if (netId === 137) {
          transactionValue = '2';
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const receipt = await this.web3.eth.sendTransaction({
          from: account,
          to: '0xa81e1C83805A9Fc4e4e59522d0d446165fAc5221',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          value: this.web3.utils.toWei(transactionValue, 'ether'),
        });
        this.txHash = receipt;
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.initEthereum();
  },
});
</script>
