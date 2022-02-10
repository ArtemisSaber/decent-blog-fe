<template>
  <div class="blog-container">
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
    <div class="blog-footer">This blog id is {{ id }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import sanitizeHtml from 'sanitize-html';
export default defineComponent({
  props: {
    id: String,
  },
  data() {
    return {
      blogPost: {
        title: 'Lorem ipsum',
        author: 'StellarSaber',
        abstract:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque imperdiet ipsum lorem, id volutpat enim.',
        bannerImage:
          'https://thumbs.dreamstime.com/z/hourglass-time-banner-background-format-wood-54533019.jpg',
        backgroundColor: 'light-green-6',
        content: `
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet sapien dolor. Nullam congue facilisis velit blandit convallis. Aliquam erat volutpat. Nam id ultricies massa. Quisque varius tortor lorem, vel aliquet massa mollis a. Nunc eu posuere dui, ut varius dui. Mauris metus lectus, feugiat non augue nec, malesuada congue arcu. Praesent congue a est placerat malesuada. Ut at mollis sapien. Sed sodales vulputate egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse vehicula, nulla ut finibus elementum, est odio ullamcorper magna, a efficitur purus purus non nunc. Sed tristique malesuada odio, a rutrum tellus tempor a. Cras commodo consequat ante blandit sagittis. Pellentesque in ligula dui. Suspendisse vitae felis a massa fringilla vehicula.
</p>
<p>
Curabitur pharetra commodo nulla non scelerisque. Duis ultrices nunc vel vestibulum vehicula. Fusce tristique libero non erat laoreet efficitur. Duis mattis vehicula ante, vitae porttitor nisl iaculis at. Morbi vehicula sapien purus, quis tincidunt lacus eleifend eu. Proin ac lacus sed sem venenatis laoreet. Sed efficitur ante a lacus aliquam, vitae volutpat neque pretium. Maecenas accumsan nunc at purus gravida, ut volutpat metus dignissim. Nulla euismod libero in sollicitudin elementum. Curabitur sollicitudin odio enim. Proin at suscipit sapien, sed ultricies justo.
</p>
<p>
Cras consectetur finibus nisi vitae tempus. Duis lacinia varius justo, nec varius libero tristique in. In hac habitasse platea dictumst. Fusce lobortis neque sit amet diam cursus, eu ultricies sapien pretium. Sed laoreet massa id sapien faucibus viverra. Ut quis malesuada orci. Ut quis dolor ut justo pulvinar pharetra a non lacus. Proin non volutpat ante, ac ullamcorper ex. Fusce non turpis accumsan, ornare libero in, fermentum lacus. Nam quis neque quam. Nam auctor magna vitae lacinia laoreet. Suspendisse mi nunc, dignissim quis arcu sit amet, aliquet lobortis nulla. Duis eget mi urna. Duis massa nunc, maximus pulvinar scelerisque eget, pulvinar sit amet odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis egestas quam egestas rhoncus ultrices.
</p>
<p>
Phasellus eu ipsum dui. Fusce arcu felis, molestie eget sollicitudin eu, vehicula vitae erat. Aenean sollicitudin enim a porta cursus. In vehicula nisl tortor, quis imperdiet arcu sagittis eu. Quisque venenatis quis nulla non mollis. Phasellus quis blandit nibh. Nulla ante quam, vehicula et tempor eget, dapibus id ex. Sed leo elit, pulvinar eu dictum sed, accumsan ut odio. Duis porta maximus ullamcorper. Duis condimentum sed lacus eget laoreet. In malesuada aliquam neque, sed tincidunt odio. Sed fermentum elementum ex, ac faucibus est rutrum eu. Nam condimentum dolor vitae erat euismod facilisis. Morbi gravida fringilla sollicitudin. Nam a felis purus.
</p>
<p>
Suspendisse malesuada erat et feugiat aliquet. Maecenas id auctor dolor. Proin congue convallis lectus, sit amet porta magna feugiat et. Donec a nibh odio. Vestibulum vitae porta magna, ut tincidunt risus. Etiam sollicitudin nec orci non hendrerit. Integer condimentum, elit non euismod volutpat, orci urna ultricies libero, eu ultricies ex libero eget eros. Morbi vitae arcu ac quam feugiat pulvinar. Donec leo ipsum, aliquet nec fringilla id, efficitur vitae lectus. Proin ultrices blandit dui, et elementum orci. Maecenas ut maximus nulla, nec sollicitudin massa. Praesent sit amet metus placerat, laoreet massa et, tempor velit. Nam porta mauris nec nisl dictum, id accumsan dolor pulvinar.
</p> `,
        id: 1,
      },
    };
  },
  methods: {
    sanitizedHTML() {
      return String(sanitizeHtml(this.blogPost.content));
    },
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
