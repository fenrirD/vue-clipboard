import {computed, onMounted, onUnmounted, reactive, toRefs} from 'vue';

/**
 * 클립보드는 Hook 형태로 메소드만 제공해주는 기능으로 구현해야함
 * 필요한 기능
 * addImage: 수동 및 자동
 *
 */
export default function useClipboard(usableCapacity:number) {
  const clipboardImages: any[] = [];
  const usableCapacityComputed = computed(() => {
    return usableCapacity.value;
  });
  const state = reactive({
    clipboardImages,
    usableCapacityComputed,
    uploadSize: 0,
  });

  /**
   * Paste 이벤트 핸들러, crossBrowser 지원울 위해 동기/비동기 를 사용함
   * https://web.dev/patterns/clipboard/paste-images?hl=ko
   */
  const handlePasteImage = async (e:ClipboardEvent) => {
    const clipboardItems = e.clipboardData.files;
    for (const clipboardItem of iterImageSizeCheck(clipboardItems)) {
      if (clipboardItem) {
        let blob;
        if (clipboardItem.type?.startsWith('image/')) {
          blob = clipboardItem;
          appendImage(blob, true);
        } else {
          // For files from `navigator.clipboard.read()`.
          const imageTypes = clipboardItem.types?.filter((type) => type.startsWith('image/'));
          for (const imageType of imageTypes) {
            blob = await clipboardItem.getType(imageType);
            appendImage(blob, true);
          }
        }
      } else {
        break;
      }
    }
    imageUploadComputed.value = state.clipboardImages.length;
  };
  const handleRemoveImg = (idx) => {
    state.uploadSize -= state.clipboardImages[idx].size;
    state.clipboardImages = state.clipboardImages.filter((item, inIdx) => idx !== inIdx);
    imageUploadComputed.value = state.clipboardImages.length;
    // emit('remove-clipboard-images', idx)
  };

  /**
   * 등록 및 복사한 이미지를 상태에 추가해주기 위한 함수
   * @param blob
   * @param {boolean} isClipboard
   */
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
  /**
   * paste 이벤트 리스너를 Hook 마운트 시점에 등록해준다.
   */
  onMounted(() => {
    window.addEventListener('paste', handlePasteImage);
  });
  
  /**
   * paste 이벤트 리스너를 Hook 언마운트 시점에 해제해준다.
   */
  onUnmounted(() => {
    window.removeEventListener('paste', handlePasteImage);
  });

  const imageUploadComputed = computed({
    get: () => state.clipboardImages.length,
    set: (value) => {
      console.log('uplaod..', value);
      // emit('add-image', value);
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
  }

}