<template>
  <div class="editor-container">
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
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  data() {
    return {
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
