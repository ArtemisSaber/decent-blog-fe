<template>
  <q-card
    :class="`bg-${blog.backgroundColor} blog-card`"
    @click="navToBlog(blog.id)"
  >
    <q-card-section
      class="titleContainer"
      :style="{ backgroundImage: `url(${blog.bannerImage})` }"
    >
      <div class="text-h6">
        <span class="texts">{{ blog.title }}</span>
      </div>
      <div class="text-subtitle2">
        <span class="texts">{{ `by ${blog.author}` }}</span>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="abstractContent">
        <span class="texts">{{ `${blog.abstract}...` }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Blog } from '../../types/blog';

export default defineComponent({
  name: 'BlogCard',
  props: {
    blog: {
      type: Object,
      default(rawProps: Blog) {
        return { ...rawProps };
      },
    },
  },
  emits: ['clickCard'],
  methods: {
    navToBlog(id: string) {
      this.$emit('clickCard', id);
    },
  },
});
</script>
<style lang="scss" scoped>
.blog-card {
  cursor: pointer;
  .titleContainer {
    background-size: cover;
    background-repeat: no-repeat;
    height: 5rem;
  }
  .abstractContent {
    height: 10rem;
  }
  .texts {
    color: #fff;
    mix-blend-mode: difference;
  }
  &.edit-card {
    height: 15rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
