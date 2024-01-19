<template>
  <div>
    {{proxyVisible}} : ??
  </div>
  <modal :id="id" :visible="proxyVisible" size="md" @closeModal="handleOnCloseModal">
    <template #header>
      <h3>{{ currentImgData.fileName || '' }}</h3>
    </template>
    <template #body>
      <div class="wrapper">
        <img
          class="img-content"
          :src="currentImgData.src"
          :class="currentImgData.fileName.includes('jpeg') ? 'img-content-rotate' : 'img-content'"
        />
      </div>
      <div class="btn-area">
        <button class="btn-submit gray-color" @click="handleOnCloseModal">닫기</button>
      </div>
    </template>
  </modal>
</template>

<script lang="ts">

import Modal from '@/components/modal/Modal.vue';
import {reactive, toRefs} from 'vue';

export default {

  components: {
    Modal,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const state = reactive({
      proxyVisible: props.visible,
      currentImgData: {
        id: '',
        src: '',
        fileName: '',
      },
    });

    const initData = () => {
      state.proxyVisible = false;
    };

    const openModal = (imgData) => {
      console.log('??')
      state.proxyVisible = true;
      state.currentImgData = imgData;
    };

    const handleOnCloseModal = () => initData();

    return {
      ...toRefs(state),
      openModal,
      handleOnCloseModal,
    };
  },
};
</script>
<style scoped>
.wrapper {
  width: auto;
  height: auto;
}
.sub-title {
  font-weight: 500;
  line-height: 18px;
  color: #000000;

  margin-top: 13px;
  margin-left: 17px;
}
.txt-content {
  width: 416px;
  height: 468px;
  overflow: auto;
  margin: 14px 17px 27px;
}
.btn-area {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}
.btn-area button {
  min-width: 100px;
  height: 40px;
  margin-left: 1rem;
  padding: 2px 1rem 0;
  border-radius: 0.25rem;
}
.img-content-rotate {
  transform: rotate(90deg);
}

/*::v-deep .modal-content {
  padding: 14px 25px 32px;
}
::v-deep .toolbar .slt,
.toolbar .inp-t {
  width: 8rem;
  font-size: 12px;
}
::v-deep .modal-dialog.md {
  width: 1080px;
}*/
</style>
