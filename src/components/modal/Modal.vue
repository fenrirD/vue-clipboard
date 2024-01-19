<template>
  <div>
    {{modalVisible}}뭐야
  </div>
  <transition name="fade">
    <section
      ref="imgModal"
      tabindex="0"
      v-if="visible"
      :id="id"
      class="modal"
      @keyup.esc.stop="closeModal(id)"
    >
      <div class="modal-backdrop" @click="closeModal(id)" />
      <div
        class="modal-dialog"
        :class="[size, overflow && ' overflow']"
        :style="`width: ${resourceWidth}; height: ${resourceHeight}`"
      >
        <article class="modal-inner" :class="{ overflow: overflow }">
          <div v-if="$slots.header" class="modal-header">
            <slot name="header" />
            <button v-if="useCloseIcon" class="btn-close" @click="closeModal(id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
              <span class="hide">닫기</span>
            </button>
          </div>
          <div class="modal-content" :class="{ withIntro: intro, overflow: overflow }">
            <slot name="body" />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </article>
      </div>
    </section>
  </transition>
</template>

<script lang="ts">

import {reactive, toRefs, watch} from 'vue';

export default {
  name: 'Modal',
  props: {
    id: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'md',
    },
    resourceWidth: {
      type: String,
      default: '',
    },
    resourceHeight: {
      type: String,
      default: '',
    },
    intro: {
      type: Boolean,
      default: false,
    },
    overflow: {
      type: Boolean,
      default: false,
    },
    useCloseIcon: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    console.log('??',props.visible)
    const state = reactive({
      modalVisible: props.visible,
    });

    const closeModal = (id) => {
      const modalElements = (document as any).getElementsByClassName('modal');
      // TODO: 이부분은 문제가 될 여지가 있음.
      if (modalElements.length > 1) {
        modalElements[modalElements.length - 2]?.focus();
      }
      emit('closeModal', id);
    };

    // watch(() => props.visible, (newValue) => {
    //   state.modalVisible = newValue;
    // });


    return {
      ...toRefs(state),
      closeModal,
    };
  },
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 110;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 120;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
}
.modal-dialog {
  overflow: hidden;
  position: relative;
  display: flex;
  z-index: 150;
  max-width: var(--inner-width);
  max-height: calc(100vh - 60px);
}
.xs {
  width: 450px;
}
.sm {
  width: 600px;
}
.md {
  width: 926px;
  height: 778px;
}
.is-mobile-size {
  width: 926px;
  height: calc(var(--vh, 1vh) * 100);
}
.lg {
  width: 90vw;
}
.modal-inner {
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 5px rgb(0 0 0 / 20%);
}
.modal-header {
  position: relative;
  display: flex;
  height: 61px;
  padding: 0rem 1.5rem;
  border-bottom: 1px solid var(--KB-gray);
}
.modal-header h3 {
  font-size: 22px;
  height: 60px;
  line-height: 62px;
  cursor: default;
}
.modal-header .btn-close {
  position: absolute;
  top: 0;
  right: 1rem;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  margin: auto;
}
.modal-content {
  overflow: auto;
  position: relative;
  flex: 1;
  padding: 1rem;
}
.withIntro {
  padding: 0.5rem 1rem 1rem 1rem;
}
.overflow {
  overflow: visible !important;
}
.modal-footer {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: -1rem;
  padding: 2rem 1.5rem 1rem;
}
.modal-footer .modal-button {
  min-width: 100px;
  height: 2.5rem;
  padding: 2px 1rem 0;
  font-size: 15px;
  border-radius: 0.25rem;
  border: 1px solid #ffbc00;
  color: #ffbc00;
}
.modal-footer .modal-button:not(:last-child) {
  margin-right: 1.5rem;
}
.modal-button.transparent {
  background-color: transparent;
  color: #333;
}
.modal-button.primary {
  background-color: var(--KB-positive);
  color: #fff;
}

.modal-button.black {
  background-color: #2b2a2a;
  color: #fff;
  border: 1px solid #2b2a2a;
}

.modal-top {
  position: relative;
  /* margin: -1.5rem -1.5rem 1.5rem;
	padding: 1rem 1.4rem; */
  margin-bottom: 1rem;
  /* border-bottom: 1px solid rgb(0 0 0 / 5%); */
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
