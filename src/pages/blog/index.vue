<template>
  <div class="blog-container">
    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />

    <div
      class="blog-banner"
      :style="{ backgroundImage: `url(${blogPost.bannerImage})` }"
    >
      <div class="text-h2">{{ blogPost.title }}</div>
      <div class="text-subtitle1">{{ blogPost.author }}</div>
    </div>
    <div class="blog-content">
      <div class="text-body2" v-html="sanitizedHTML()"></div>
    </div>
    <div class="blog-footer">This blog id is {{ blogPost.id }}</div>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent } from 'vue';
import sanitizeHtml from 'sanitize-html';
const Web3 = require('web3/dist/web3.min.js');
import { abi, contractAddress, chainId } from '../../config/index';

export default defineComponent({
  props: {
    id: String,
  },
  data() {
    return {
      web3: new Web3(),
      etherAccount: [],
      blogPost: {
        title: '',
        author: '',
        bannerImage: '',
        backgroundColor: '',
        content: '',
        id: '',
      },
    };
  },
  methods: {
    sanitizedHTML() {
      return String(sanitizeHtml(this.blogPost.content));
    },
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
    async getBlog() {
      const netId = await this.web3.eth.net.getId();
      if (netId !== chainId) {
        alert('Please connect to the correct network.');
        return;
      }
      const barRef = this.$refs['bar'] as any;
      barRef.start();
      const contract = new this.web3.eth.Contract(abi, contractAddress);
      const blogPost = await contract.methods.getPost(this.id).call();
      console.log(blogPost);
      const getAuthor = await contract.methods
        .getAuthor(blogPost['authorAddress'])
        .call();
      const author = getAuthor['name'];
      barRef.stop();
      this.blogPost = {
        title: blogPost['title'],
        author,
        bannerImage: blogPost['banner'],
        backgroundColor: blogPost['cardBg'],
        content: blogPost['content'],
        id: this.id ? this.id : '',
      };
    },
  },
  mounted() {
    this.initEthereum();
    void this.getBlog();
  },
});
</script>
<style>
.blog-banner {
  padding: 2rem;
  text-align: center;
}
.blog-content {
  padding: 2rem;
}
.blog-footer {
  padding: 1rem;
  opacity: 0.1;
  text-align: center;
}
</style>
