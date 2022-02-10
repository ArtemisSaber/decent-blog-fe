<template>
  <div class="container">
    <div class="row">
      <!-- <q-parallax src="~assets/image/snowboat.jpg">
      <h2>Tranquil</h2>
    </q-parallax> -->
      <div
        v-for="blog in blogPost"
        :key="blog.id"
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
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      blogPost: [
        {
          title: 'Lorem ipsum',
          author: 'StellarSaber',
          abstract:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque imperdiet ipsum lorem, id volutpat enim.',
          bannerImage:
            'https://thumbs.dreamstime.com/z/hourglass-time-banner-background-format-wood-54533019.jpg',
          backgroundColor: 'light-green-6',
          id: 1,
        },
        {
          title: 'Lorem ipsum',
          author: 'StellarSaber',
          abstract:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque imperdiet ipsum lorem, id volutpat enim.',
          bannerImage:
            'https://thumbs.dreamstime.com/z/hourglass-time-banner-background-format-wood-54533019.jpg',
          backgroundColor: 'deep-purple-6',
          id: 2,
        },
        {
          title: 'Lorem ipsum',
          author: 'StellarSaber',
          abstract:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque imperdiet ipsum lorem, id volutpat enim.',
          bannerImage:
            'https://thumbs.dreamstime.com/z/hourglass-time-banner-background-format-wood-54533019.jpg',
          backgroundColor: 'light-blue-8',
          id: 3,
        },
        {
          title: 'Lorem ipsum',
          author: 'StellarSaber',
          abstract:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque imperdiet ipsum lorem, id volutpat enim.',
          bannerImage:
            'https://thumbs.dreamstime.com/z/hourglass-time-banner-background-format-wood-54533019.jpg',
          backgroundColor: 'blue-grey-9',
          id: 4,
        },
        {
          title: 'Lorem ipsum',
          author: 'StellarSaber',
          abstract:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque imperdiet ipsum lorem, id volutpat enim.',
          bannerImage:
            'https://thumbs.dreamstime.com/z/hourglass-time-banner-background-format-wood-54533019.jpg',
          backgroundColor: 'grey-8',
          id: 5,
        },
        {
          title: 'Lorem ipsum',
          author: 'StellarSaber',
          abstract:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque imperdiet ipsum lorem, id volutpat enim.',
          bannerImage:
            'https://thumbs.dreamstime.com/z/hourglass-time-banner-background-format-wood-54533019.jpg',
          backgroundColor: 'cyan-8',
          id: 6,
        },
      ],
    };
  },
  methods: {
    async navToBlog(id: number) {
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
}
</style>
