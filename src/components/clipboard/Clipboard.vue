<template>
  <div>
    <div class="flex mt-2 mb-2">
      <label for="file-upload" style="cursor: pointer; font-size: 16px; flex: 1">
        <div class="add-button flex flex-row items-center justify-center">
          <span class="text2">이미지 등록</span>
          <div style="margin-top: 2px">
<!--            <Icon name="IconPlusCircle" />-->
          </div>
        </div>
      </label>
      <input
        ref="inputImageRef"
        id="file-upload"
        type="file"
        multiple
        accept="image/*"
        style="display: none"
        @change="handleAddImages"
      />
    </div>
    <div class="image-description" style="font-weight: 600; color: black">
      업로드 파일 영역 및 이미지 복사/붙여넣기 영역
    </div>
    <div
      style="
        height: 200px;
        border: 1px solid gray;
        overflow: auto;
        padding: 0px 4px 0px 4px;
        background-color: white;
      "
      :class="!clipboardImages.length && 'non-data-img'"
    >
      <div v-if="clipboardImages.length">
        <Thumbnail
          :thumbnails="clipboardImages"
          @remove-thumbnail="handleRemoveImg"
          :grid-row-count="gridRowCount"
        />
      </div>
      <div v-else>
        <pre style>
파일을 업로드해주세요.
<!--<highlight-text-->
<!--  :msg="'ctrl+c,ctrl+v를 통해 이미지를 복사/붙여넣기 해주세요'"-->
<!--  :search="'ctrl\\+c,ctrl\\+v'"-->
<!--  :effect-color="`#ff0000`"></highlight-text>-->
        </pre>
      </div>
    </div>
    <div class="image-description">
      <span>
        ※ 이미지 파일은 첨부파일로 등록이 가능하며, 캡쳐 화면 또는 이미지를 복사하여, 위의 영역에
        붙여넣기하여 이미지를 등록할 수 있습니다. </span
      ><br />
      <span
        >※ 최대 크기는 10MB입니다. 클립보드 이미지 추가영역의 이미지 용량포함이니
        확인해주세요.</span
      >
    </div>
  </div>
</template>

<script lang="ts">


import {computed, defineComponent, onMounted, onUnmounted, reactive, toRefs} from 'vue';
import Thumbnail from '@/components/thumbnail/Thumbnail.vue';

export default defineComponent({
  name: 'Clipboard',
  // components: { Icon, Thumbnail, HighlightText },
  components: {  Thumbnail},
  props: {
    usableCapacity: {
      type: Number,
      default: 10 * 1024 * 1024,
    },
    gridRowCount: {
      type: Number,
      default: 6,
    },
  },
  setup(props, { emit }) {
    // const { instance } = getInstance();
    const { usableCapacity } = toRefs(props);
    const clipboardImages: any[] = [];
    const usableCapacityComputed = computed(() => {
      return usableCapacity.value;
    });
    const state = reactive({
      clipboardImages,
      usableCapacityComputed,
      uploadSize: 0,
    });

    const generateRandomHash = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    const handleRemoveImg = (idx) => {
      state.uploadSize -= state.clipboardImages[idx].size;
      state.clipboardImages = state.clipboardImages.filter((item, inIdx) => idx !== inIdx);
      imageUploadComputed.value = state.clipboardImages.length;
      // emit('remove-clipboard-images', idx)
    };
    const handlePasteImage = async (e) => {
      const clipboardItems = e.clipboardData.files;
      for (const clipboardItem of iterImageSizeCheck(clipboardItems)) {
        if (clipboardItem) {
          let blob;
          if (clipboardItem.type?.startsWith('image/')) {
            // For files from `e.clipboardData.files`.
            blob = clipboardItem;
            // Do something with the blob.
            appendImage(blob, true);
          } else {
            // For files from `navigator.clipboard.read()`.
            const imageTypes = clipboardItem.types?.filter((type) => type.startsWith('image/'));
            for (const imageType of imageTypes) {
              blob = await clipboardItem.getType(imageType);
              // Do something with the blob.
              appendImage(blob, true);
            }
          }
        } else {

          break;
        }
      }
      imageUploadComputed.value = state.clipboardImages.length;
    };
    const appendImage = (blob: any, isClipboard = false) => {
      if (state.clipboardImages) {
        if (isClipboard) {
          const name = blob.name.split('.');
          const extension = name.pop();
          const file = new File(
            [blob],
            `${name.join('.')}-${new Date().getTime()}.${extension}`,
            {
              type: blob.type,
            }
          );
          state.clipboardImages = state.clipboardImages.concat(file);
        } else {
          state.clipboardImages = state.clipboardImages.concat(blob);
        }
      }
    };

    function* iterImageSizeCheck(files) {
      let fileSize = state.uploadSize;
      for (const file of files) {
        fileSize += file.size;
        if (state.usableCapacityComputed - fileSize < 0) {
          fileSize -= file.size;
          yield false;
        } else {
          yield file;
        }
      }
      state.uploadSize = fileSize;
    }
    const handleAddImages = (e) => {
      try {
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
        const files = e.target.files;
        for (const file of iterImageSizeCheck(files)) {
          if (file) {
            appendImage(file);
          } else {
            break;
          }
        }
      } catch (e: any) {
        console.error(e.message);
      } finally {
        e.target.value = '';
        imageUploadComputed.value = state.clipboardImages.length;
      }
    };

    onMounted(() => {
      window.addEventListener('paste', handlePasteImage);
    });
    onUnmounted(() => {
      window.removeEventListener('paste', handlePasteImage);
    });
    const imageUploadComputed = computed({
      get: () => state.clipboardImages.length,
      set: (value) => {
        console.log('uplaod..', value);
        emit('add-image', value);
      },
    });
    const handleResetImages = () => {
      state.clipboardImages = [];
      imageUploadComputed.value = state.clipboardImages.length;
    };

    return {
      ...toRefs(state),
      handleRemoveImg,
      handleAddImages,
      imageUploadComputed,
      handleResetImages,
    };
  },
});
</script>

<style scoped>
* {
  font-family: 'KBFGTextM';
}
.image-description {
  font-size: 11px;
  color: #828282;
}
.non-data-img {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: #a7a5a5;
}
.add-button {
  flex: 1;
  border: 1px dashed #ffbc00;
  width: 100%;
  /*min-width: 100px;*/
  height: 40px;
  padding: 2px 1rem 0;
  border-radius: 0.25rem;
  background-color: #fff;
}
.add-button .text2 {
  color: #ffbc00;
}
</style>
