<template>
  <div class="pdf-viewer-wrap">
    <div class="top-bar">
      <div class="left-box">
        <n-button>
          <template #icon>
            <n-icon><menu-icon /></n-icon>
          </template>
        </n-button>
      </div>
      <div class="center-box">
        <span :class="{ active: !isEdit }" @click="isEdit = false">预览</span>
        <span v-if="edit" :class="{ active: isEdit }" @click="isEdit = true"
          >编辑</span
        >
      </div>
      <div class="right-box">
        <n-popover :width="200" trigger="click">
          <template #trigger>
            <n-button>
              <template #icon>
                <n-icon><information-icon /></n-icon>
              </template>
            </n-button>
          </template>
          <n-descriptions title="文件信息" :column="1">
            <n-descriptions-item label="标题">{{
              info.title
            }}</n-descriptions-item>
            <n-descriptions-item label="作者">{{
              info.author
            }}</n-descriptions-item>
            <n-descriptions-item label="主题">{{
              info.subject
            }}</n-descriptions-item>
            <n-descriptions-item label="关键字">{{
              info.keywords
            }}</n-descriptions-item>
          </n-descriptions>
        </n-popover>
      </div>
    </div>
    <div v-if="edit && isEdit" class="tool-bar">
      <slot name="edit-bar"></slot>
    </div>
    <n-spin :show="loading">
      <template #description>加载PDF中</template>
      <div class="content-wrap">
        <div class="render-content" ref="RenderContentRef">
          <slot name="canvas"></slot>
          <canvas ref="CanvasRef"></canvas>
        </div>
        <div v-if="enabledPage" class="page-wrap">
          <n-button text @click="handlePrev()" :disabled="prevDisabled">
            <template #icon>
              <n-icon><caret-back-icon /></n-icon>
            </template>
          </n-button>
          <span>{{ current }} / {{ total }}</span>
          <n-button text @click="handleNext()" :disabled="nextDisabled">
            <template #icon>
              <n-icon><caret-forward-icon /></n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </n-spin>
  </div>
</template>
<script lang="ts">
import {
  NButton,
  NPopover,
  NDescriptions,
  NDescriptionsItem,
  NIcon,
  NSpin,
} from "naive-ui";
import {
  CaretBack as CaretBackIcon,
  CaretForward as CaretForwardIcon,
  Information as InformationIcon,
  Menu as MenuIcon,
} from "@vicons/ionicons5";
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  PropType,
} from "vue";
import * as pdfjsLib from "pdfjs-dist";
import type {
  PDFDocumentProxy,
  PDFPageProxy,
  TypedArray,
} from "pdfjs-dist/types/display/api";
import { getBufferArray } from "../../utils";
// @ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
const pdfViewerProps = {
  src: {
    type: String,
    default: "",
  },
  buf: {
    type: Object as PropType<TypedArray>,
    default: () => ({}),
  },
  edit: {
    type: Boolean,
    default: false,
  },
  enabledPage: {
    type: Boolean,
    default: true,
  },
};
const PdfViewer = defineComponent({
  name: "PdfViewer",
  emits: ["update-state"],
  props: pdfViewerProps,
  components: {
    NButton,
    NPopover,
    NDescriptions,
    NDescriptionsItem,
    NIcon,
    NSpin,
    CaretBackIcon,
    CaretForwardIcon,
    InformationIcon,
    MenuIcon,
  },
  setup(props, { emit }) {
    const state = reactive({
      CanvasRef: {} as HTMLCanvasElement,
      RenderContentRef: {} as HTMLElement,
      loading: true,
      isEdit: false,
      current: 1,
      total: 0,
      pdfDoc: {} as PDFDocumentProxy,
      pdfPage: {} as PDFPageProxy,
      info: {
        title: "",
        author: "",
        subject: "",
        keywords: "",
      },
    });
    // computed
    const prevDisabled = computed(() => {
      if (state.total === 0) {
        return true;
      } else {
        if (state.current === 1) {
          return true;
        } else {
          return false;
        }
      }
    });
    const nextDisabled = computed(() => {
      if (state.total === 0) {
        return true;
      } else {
        if (state.current === state.total) {
          return true;
        } else {
          return false;
        }
      }
    });
    // method
    const handlePrev = () => {
      state.current--;
      getPdfPage(state.current);
    };
    const handleNext = () => {
      state.current++;
      getPdfPage(state.current);
    };
    const render = async () => {
      // Display page on the existing canvas with 100% scale.
      const viewport = state.pdfPage.getViewport({ scale: 1.0 });
      state.CanvasRef.width = viewport.width;
      state.CanvasRef.height = viewport.height;
      const ctx = state.CanvasRef.getContext("2d");
      if (!ctx) {
        return;
      }
      const renderTask = state.pdfPage.render({
        canvasContext: ctx,
        viewport,
      });
      await renderTask.promise;
      // emit to parent
      emit("update-state", {
        current: state.current,
        total: state.total,
        viewportWidth: viewport.width,
        viewportHeight: viewport.height,
      });
    };
    const getPdfPage = async (crt = state.current) => {
      if (!state.pdfDoc) {
        return;
      }
      state.pdfPage = await state.pdfDoc.getPage(crt);
      await render();
      state.loading = false;
      state.RenderContentRef.scrollTo({
        top: 0,
      });
    };
    const refreshPdfDoc = async (buf: TypedArray) => {
      state.pdfDoc = await pdfjsLib.getDocument(buf as TypedArray).promise;
      state.total = state.pdfDoc.numPages;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { info }: { info: any } = await state.pdfDoc.getMetadata();
      state.info = {
        title: info.Title,
        author: info.Author,
        subject: info.Subject,
        keywords: info.Keywords,
      };
      getPdfPage(state.current);
    };
    const getPdfDoc = async () => {
      if (props.src) {
        await refreshPdfDoc(await getBufferArray(props.src));
      }
    };
    onMounted(() => {
      getPdfDoc();
    });
    return {
      // ref
      ...toRefs(state),
      // computed
      prevDisabled,
      nextDisabled,
      // method
      handlePrev,
      handleNext,
      refreshPdfDoc,
    };
  },
});
export default PdfViewer;
export type PdfViewerRefs = InstanceType<typeof PdfViewer>;
</script>
<style scoped>
.pdf-viewer-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.top-bar {
  height: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9f9f9;
  padding: 2px 5px;
}
.tool-bar {
  height: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  padding: 2px 5px;
}
.content-wrap {
  min-height: 0px;
  position: relative;
  flex: 1;
  width: 100%;
  display: flex;
}
.page-wrap {
  position: absolute;
  bottom: 5%;
  left: calc(50% - 65px);
  background: #f9f9f9;
  padding: 2px 5px;
  border-radius: 4px;
  box-shadow: 0 0 3px 0 #adb5bd;
  height: 32px;
  display: flex;
  align-items: center;
  color: #666;
}
.render-content {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  background: #eee;
  padding: 15px 0;
  box-sizing: border-box;
  position: relative;
}
.render-content canvas {
  box-shadow: 0px 0px 15px 5px #cfcfcf;
}
.left-box,
.center-box,
.right-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.center-box > span {
  color: #666;
  cursor: pointer;
}
.center-box > span.active {
  color: #999;
  cursor: default;
}
</style>
