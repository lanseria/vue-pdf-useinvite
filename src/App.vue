<template>
  <div>
    <pdf-editor
      src="https://bitcoinbook.info/wp-content/translations/cmn/book.pdf"
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
