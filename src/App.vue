<template>
  <div>
    <pdf-editor
      src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
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
