<template>
  <div class="editor-container">
    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />
    <div class="editor-top">
      <q-input label="title" v-model="title" />
      <q-select
        v-model="backgroundColor"
        :options="options"
        label="card background"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps" :class="`bg-${scope.opt}`">
            {{ scope.opt }}
          </q-item>
        </template>
      </q-select>
      <q-input label="banner image" v-model="bannerImage" />
    </div>
    <q-editor v-model="editorContent" min-height="15rem" />
    <div class="operations" style="text-align: center; padding: 1rem">
      <q-btn color="primary" @click="saveBlog">Save</q-btn>
    </div>
    <q-dialog v-model="addAuthor">
      <q-card>
        <q-card-section>
          <q-form
            @submit="createAuthor"
            @reset="resetAuthorField"
            class="q-gutter-md"
          >
            <q-input
              filled
              v-model="authorForm.name"
              label="Author name *"
              hint="Nick name or real name"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />

            <q-input filled v-model="authorForm.avatar" label="Avatar link" />
            <div>
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn
                label="Reset"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { getContract } from 'src/utils/getContract';
import { defineComponent } from 'vue';
const Web3 = require('web3/dist/web3.min.js');
import { abi, contractConfigs } from '../../config/index';
export default defineComponent({
  data() {
    return {
      web3: new Web3(),
      etherAccount: [],
      authorForm: {
        name: '',
        avatar: '',
      },
      addAuthor: false,
      title: '',
      bannerImage: '',
      editorContent: '',
      backgroundColor: '',
      options: [
        'light-green-6',
        'deep-purple-6',
        'light-blue-8',
        'blue-grey-9',
        'grey-8',
        'cyan-8',
      ],
    };
  },
  methods: {
    initEthereum() {
      if (typeof window.ethereum === undefined) {
        alert('Please install MetaMask to use this dApp.');
        return;
      } else {
        this.web3 = new Web3(window.ethereum);
        const barRef = this.$refs['bar'] as any;
        barRef.start();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.web3.eth.getAccounts().then((accounts: any) => {
          if (accounts) {
            this.etherAccount = accounts;
            this.web3.eth.net.getId().then((netId: number) => {
              const contractConfig = getContract(
                contractConfigs,
                Number(netId)
              );
              if (!contractConfig) {
                alert('Please switch to polygon main net or mumbai test net');
                return;
              }
              const contract = new this.web3.eth.Contract(
                abi,
                contractConfig.contractAddress
              );

              contract.methods
                .getAuthor(accounts[0])
                .call()
                .then((author: any) => {
                  console.log('author', author);
                  this.authorForm.name = author['name'];
                  this.authorForm.avatar = author['avatar'];
                  barRef.stop();
                })
                .catch((err: any) => {
                  console.log(err);
                  this.addAuthor = true;
                  barRef.stop();
                });
            });
          }
        });
      }
    },
    resetAuthorField() {
      this.authorForm = {
        name: '',
        avatar: '',
      };
    },
    async createAuthor() {
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
      const donateAmount = await contract.methods.getDonateAmount().call();
      const barRef = this.$refs['bar'] as any;
      barRef.start();
      const addAuthor = await contract.methods
        .addAuthor(this.authorForm.name, this.authorForm.avatar)
        .send({
          from: this.etherAccount[0],
          value: donateAmount,
        });
      if (addAuthor) {
        alert('Successfully added you as a new author.');
        this.addAuthor = false;
        barRef.stop();
      }
    },
    async saveBlog() {
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
      const barRef = this.$refs['bar'] as any;
      barRef.start();
      const upload = await contract.methods
        .postBlog(
          this.title,
          this.editorContent,
          this.bannerImage,
          this.backgroundColor
        )
        .send({
          from: this.etherAccount[0],
        });
      console.log('upload receipt', upload);
      const blogId = upload['events']['SendId']['returnValues'][0];
      if (blogId >= 0) {
        alert('Successfully uploaded to chain');
        barRef.stop();
        void this.$router.push({
          name: 'blog',
          params: { id: blogId },
        });
      } else {
        alert('Something went wrong...');
        barRef.stop();
      }
    },
  },
  mounted() {
    this.initEthereum();
  },
});
</script>
<style lang="scss" scoped>
.editor-container {
  padding: 2rem;
  .editor-top {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
  }
}
</style>
