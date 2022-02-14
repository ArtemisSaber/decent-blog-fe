<template>
  <div class="container">
    <div class="row">
      <div
        v-for="(blog, index) in blogPost"
        :key="index"
        class="col-md-4 col-sm-6 col-xs-12 blog-card-container"
      >
        <q-card
          :class="`bg-${blog.backgroundColor} blog-card`"
          @click="navToBlog(blog.id)"
        >
          <q-card-section
            class="titleContainer"
            :style="{ backgroundImage: `url(${blog.bannerImage})` }"
          >
            <div class="text-h6">{{ blog.title }}</div>
            <div class="text-subtitle2">{{ `by ${blog.author}` }}</div>
          </q-card-section>
          <q-card-section>
            {{ `${blog.abstract}...` }}
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-4 col-sm-6 col-xs-12 blog-card-container">
        <q-card :class="`bg-light-blue-8 blog-card`" @click="navToEdit">
          <q-card-section style="text-align: center">
            <q-icon name="add" size="5rem" />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="paginationContainer">
      <q-pagination
        v-model="pagination.currentPage"
        :max="Math.floor(pagination.total / pagination.pageSize) + 1"
        direction-links
      />
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent } from 'vue';
const Web3 = require('web3/dist/web3.min.js');
import { abi, contractConfigs } from '../../config/index';
import { getContract } from '../../utils/getContract';
export default defineComponent({
  data() {
    return {
      web3: new Web3(),
      pagination: {
        currentPage: 1,
        pageSize: 9,
        total: 0,
        skipped: 0,
      },
      contractConfig: {
        contractAddress: '',
        chainId: 0,
      },
      blogPost: new Array<{
        id: string;
        title: string;
        abstract: string;
        bannerImage: string;
        author: string;
        backgroundColor: string;
      }>(),
      etherAccount: [],
    };
  },
  methods: {
    async navToBlog(id: string) {
      try {
        const routePromise = await this.$router.push({
          name: 'blog',
          params: { id },
        });
        console.log(routePromise);
      } catch (error) {
        console.error(error);
      }
    },
    navToEdit() {
      void this.$router.push({
        name: 'editor',
      });
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
    async getBlogList() {
      const netId = await this.web3.eth.net.getId();
      const contractConfig = getContract(contractConfigs, Number(netId));
      if (!contractConfig) {
        alert('Please switch to polygon main net or mumbai test net');
        return;
      }
      const contract = new this.web3.eth.Contract(
        abi,
        contractConfig.contractAddress
      );
      const blogList = await contract.methods
        .getPostList(
          this.pagination.pageSize,
          this.pagination.currentPage - 1,
          this.pagination.skipped
        )
        .call();
      console.info('Bloglist', blogList);
      this.pagination.skipped = blogList[2];
      this.pagination.total = blogList[3];
      if (blogList[0].length > 0) {
        this.blogPost = [];
        const blogIds = blogList[1];
        const blogs = blogList[0];
        blogs.forEach(async (blog: any, index: number) => {
          const getAuthor = await contract.methods
            .getAuthor(blog['authorAddress'])
            .call();
          const author = getAuthor['name'];
          const blogPost = {
            id: blogIds[index],
            title: blog.title,
            author: author,
            bannerImage: blog.banner,
            backgroundColor: blog.cardBg,
            abstract: blog.content.replace(/<[^>]*>/g, '').slice(0, 100),
          };
          this.blogPost.push(blogPost);
        });
      }
    },
  },
  mounted() {
    this.initEthereum();
    void this.getBlogList().then(() => {
      console.log('done');
    });
  },
  watch: {
    pagination: {
      handler(newVal, oldVal) {
        if (newVal.currentPage !== oldVal.currentPage) {
          void this.getBlogList();
        }
      },
      deep: true,
    },
  },
});
</script>
<style lang="scss" scoped>
.container {
  padding: 1rem;
  .blog-card-container {
    padding: 1rem;
    .blog-card {
      cursor: pointer;
    }
    .titleContainer {
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
  .paginationContainer {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
