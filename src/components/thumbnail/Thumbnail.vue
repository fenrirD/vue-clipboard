<script lang="ts" setup>

import {computed, type PropType, ref, toRefs} from 'vue';
import useThumbnail from '@/components/thumbnail/useThumbnail';
import IconBase from '@/components/iconBase/IconBase.vue';
import IconGarbage from '@/components/iconBase/icons/IconGarbage.vue';
import IconDownload from '@/components/iconBase/icons/IconDownload.vue';
import PersonalInfoAgreement from '@/components/modal/PersonalInfoAgreement.vue';

export type Item = Record<string, unknown>;

const props = defineProps({
  isCustomizeBody: {
    type: Boolean,
    default: false,
  },
  thumbnails: {
    type: Array as PropType<Item[]>,
    required: true,
  },
  gridRowCount: {
    type: Number,
    default: 5,
  },
  isServerSide: {
    type: Boolean,
    default: false,
  },
  isRemoveThumbnail: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['remove-thumbnail', 'download-thumbnail'])
const { thumbnails, isServerSide, gridRowCount } = toRefs(props);
const { renderForThumbnails } = useThumbnail(thumbnails, isServerSide, emit);
const modalRef = ref()

const handleOpenModal = (file) => {
  console.log(file,modalRef);
  const { item, fileName, fileExtension, src, originFile } = file;
  modalRef.value.openModal({
    src: isServerSide.value ? src : URL.createObjectURL(originFile),
    fileName: fileName + '.' + fileExtension,
  });
};
const customStyle = computed(() => {
  return {
    '--grid-row-count': gridRowCount.value, // testColor 는 예시 변수명
  };
});

const handleRemoveImg = (idx) => {
  emit('remove-thumbnail', idx);
};
const handleDownloadImage = (thumbnail) => {
  emit('download-thumbnail', thumbnail);
};

</script>

<template>
  <div>
    <div class="thumbnails" :style="customStyle">
      <article v-for="(item, idx) in renderForThumbnails" class="card" :key="idx">
        <div style class="thumbnail" @click="handleOpenModal(item)">
          <slot v-if="isCustomizeBody" name="customize-body"></slot>
          <template v-else>
            <img class="thumbnail-img" :src="item.src" :class="'rotate'" />
            <div v-if="isRemoveThumbnail" class="remove" @click.stop="handleRemoveImg(idx)">
              <icon-base icon-name="제거"><IconGarbage /></icon-base>
            </div>
            <div v-if="isServerSide" class="download" @click.stop="handleDownloadImage(item)">
              <icon-base icon-name="다운로드"><IconDownload /></icon-base>
            </div>
          </template>
          <div class="test"></div>
        </div>
        <div class="card-footer flex text-center justify-center content-centerr">
          <div class="content-name ellipsis" style="max-width: 80%">{{ item?.fileName }}</div>
          .{{ item?.fileExtension }}
        </div>
      </article>
    </div>
    <personal-info-agreement
      id="personal-info-agreement"
      ref="modalRef"
    ></personal-info-agreement>
  </div>
</template>



<style scoped>
.card {
  border-radius: 25px 25px 10px 10px;
  box-shadow: 1px 1px 3px 1px #dadce0;
  cursor: pointer;
}
.thumbnails {
  display: grid;
  grid-template-columns: repeat(var(--grid-row-count), minmax(180px, 1fr));
  grid-gap: 20px;
  margin-top: 4px;
}
.thumbnail {
  width: 100%;
  height: 125px;
  position: relative;
  margin: auto;
  overflow: hidden;
  /*padding-left: 4px;*/
  /*padding-right: 4px;*/
  border-radius: 25px 25px 0px 0px;
}
.thumbnail-img {
  width: 100%;
  height: 100%;
  max-height: 100%;
  /*height: 150px;*/
}
.thumbnail .download {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  height: 25px;
  z-index: 10;
  background-color: #e6e6e6;
  opacity: 0;
  transition: all 0.3s ease 0s;
}
.thumbnail .remove {
  position: absolute;
  top: 10px;
  right: 40px;
  cursor: pointer;
  height: 25px;
  z-index: 10;
  background-color: #e6e6e6;
  opacity: 0;
  transition: all 0.3s ease 0s;
}
.thumbnail > div {
  height: 100%;
}
.card-footer {
  border-radius: 0px 0px 25px 25px;
  font-size: 14px;
}
.footer:first-child(1) {
}

.card:hover .test {
  transition: all 0.3s ease 0s;
  position: absolute;
  width: 100%;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  left: 0px;
  top: 0px;
  background-color: rgba(9, 30, 66, 0.48);
}
.card:hover .download,
.card:hover .remove {
  opacity: 1;
}
</style>
