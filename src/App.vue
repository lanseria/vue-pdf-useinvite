<template>
  <div>
    <pdf-editor
      src="http://183.131.134.242:1889/files/20210619/383518b085f9469eb9ec34594196f8c7.pdf"
    ></pdf-editor>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PdfEditor } from "../packages/";
export default defineComponent({
  name: "App",
  components: {
    PdfEditor,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
