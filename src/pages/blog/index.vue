<template>
  <div class="blog-container">
    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />
    <div class="operations" v-if="isAuthor">
      <q-btn color="secondary" @click="hideBlog" label="Hide this blog" />
      <q-btn
        color="secondary"
        @click="restoreBlog"
        label="Show a hidden blog"
      />
    </div>
    <q-skeleton height="150px" v-if="loading" />
    <div
      v-else
      class="blog-banner"
      :style="{ backgroundImage: `url(${blogPost.bannerImage})` }"
    >
      <div class="text-h2">{{ blogPost.title }}</div>
      <div class="text-subtitle1">{{ blogPost.author }}</div>
    </div>
    <div class="blog-content">
      <q-skeleton height="350px" v-if="loading" />
      <div v-else class="text-body2" v-html="sanitizedHTML()"></div>
    </div>
    <div class="blog-footer">This blog id is {{ blogPost.id }}</div>
    <q-dialog v-model="showBlogDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">The blog ID you wish to show</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="restoreBlogId"
            autofocus
            @keyup.enter="showBlog"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Show blog" @click="showBlog" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent } from 'vue';
import sanitizeHtml from 'sanitize-html';
const Web3 = require('web3/dist/web3.min.js');
import { abi, contractConfigs } from '../../config/index';
import { getContract } from 'src/utils/getContract';

export default defineComponent({
  props: {
    id: String,
  },
  data() {
    return {
      web3: new Web3(),
      etherAccount: [],
      isAuthor: false,
      showBlogDialog: false,
      loading: false,
      restoreBlogId: 0,
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
      this.loading = true;
      const netId = await this.web3.eth.net.getId();
      const barRef = this.$refs['bar'] as any;
      barRef.start();
      const contractConfig = getContract(contractConfigs, Number(netId));
      if (!contractConfig) {
        alert('Please switch to polygon main net or mumbai test net');
        return;
      }
      const contract = new this.web3.eth.Contract(
        abi,
        contractConfig.contractAddress
      );
      const blogPost = await contract.methods.getPost(this.id).call();
      console.log(blogPost);
      if (blogPost['authorAddress'] === this.etherAccount[0]) {
        this.isAuthor = true;
      }
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
      this.loading = false;
    },
    async hideBlog() {
      const netId = await this.web3.eth.net.getId();
      const barRef = this.$refs['bar'] as any;
      barRef.start();
      const contractConfig = getContract(contractConfigs, Number(netId));
      if (!contractConfig) {
        alert('Please switch to polygon main net or mumbai test net');
        return;
      }
      const contract = new this.web3.eth.Contract(
        abi,
        contractConfig.contractAddress
      );
      const result = await contract.methods.hidePost(this.id).send({
        from: this.etherAccount[0],
      });
      barRef.stop();
      if (result) {
        alert('Blog has been hidden.');
      } else {
        alert('Something went wrong.');
      }
    },
    restoreBlog() {
      this.showBlogDialog = true;
    },
    async showBlog() {
      const netId = await this.web3.eth.net.getId();
      const barRef = this.$refs['bar'] as any;
      barRef.start();
      const contractConfig = getContract(contractConfigs, Number(netId));
      if (!contractConfig) {
        alert('Please switch to polygon main net or mumbai test net');
        return;
      }
      const contract = new this.web3.eth.Contract(
        abi,
        contractConfig.contractAddress
      );
      const result = await contract.methods.showPost(this.restoreBlogId).send({
        from: this.etherAccount[0],
      });
      barRef.stop();
      if (result) {
        alert('Blog has been shown.');
      } else {
        alert('Something went wrong.');
      }
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
.operations {
  padding: 1rem;
  text-align: center;
  display: flex;
  justify-content: space-around;
}
</style>
