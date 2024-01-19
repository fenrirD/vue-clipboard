import type {Ref} from 'vue';
import {computed} from 'vue';
import type {Item} from '@/components/thumbnail/Thumbnail.vue';

export default function useThumbnail(items: Ref<Item[]>, isServerSide, emit) {
  const IMG_URL =
    process.env.NODE_ENV === 'local'
      ? `http://${window.location.hostname.split('.')[0]}.client.issuereporter.co.kr`
      : '';
  const convertDefaultFormat = (file) => {
    const { name } = file;
    const fileNames = name.split('.');
    const fileExtension = fileNames.pop();
    return {
      originFile: file,
      fileName: fileNames.join('.'),
      fileExtension,
      src: URL.createObjectURL(file),
    };
  };
  const convertServerSideFormat = (file) => {
    const { originFileName, savedFullFileName } = file;
    const fileNames = originFileName.split('.');
    const fileExtension = fileNames.pop();
    return {
      ...file,
      fileName: fileNames.join('.'),
      fileExtension,
      src: IMG_URL + savedFullFileName,
    };
  };
  const renderForThumbnails = computed(() => {

    const thumbnails = items.value.map((item) =>
      isServerSide.value ? convertServerSideFormat(item) : convertDefaultFormat(item)
    );

    return thumbnails;
  });
  return {
    renderForThumbnails,
  };
}
