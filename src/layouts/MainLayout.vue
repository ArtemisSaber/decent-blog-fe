<template>
  <q-layout view="lHh Lpr lFf">
    <q-dialog v-model="showBanner">
      <q-card>
        <q-card-section>
          <div class="text-h6">Thank you</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Thank you for buying me a coffee! Your transaction hash is:
          {{ txHash }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
          :label="
            etherAccount[0].slice(0, 9) + '...' + etherAccount[0].slice(-4)
          "
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
    <q-dialog v-model="changeChain">
      <q-card>
        <q-card-section>
          <div class="text-h6">Cannot complete transaction</div>
        </q-card-section>
        <q-card-section>
          Please switch to Ethereum mainnet or Polygon mainnet to continue
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import EssentialLink from 'components/EssentialLink.vue';
import { abi, contractAddress, chainId } from '../config/index';
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
      isCreator: false,
      creatorPass: '',
      changeChain: false,
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
          if (accounts) {
            this.etherAccount = accounts;
          }
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
        const netId = await this.web3.eth.net.getId();
        if (netId !== chainId) {
          this.changeChain = true;
          return;
        }
        const contract = new this.web3.eth.Contract(abi, contractAddress);
        let transactionValue = await contract.methods.getDonateAmount().call();
        let ownerAddress = await contract.methods.getOwner().call();
        // if (netId === 137) {
        //   transactionValue = '2';
        // } else {
        //   this.changeChain = true;
        //   return;
        // }

        const receipt = await this.web3.eth.sendTransaction({
          from: account,
          to: ownerAddress,
          value: transactionValue,
        });
        this.txHash = receipt.transactionHash;
        console.log(receipt);
        this.showBanner = true;
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
