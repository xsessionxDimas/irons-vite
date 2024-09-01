<template>
  <div :id="wrapperId" class="simple-typeahead">
    <input
      :id="inputId"
      class="simple-typeahead-input"
      type="text"
      :placeholder="placeholder"
      v-model="inputStringComputed"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.down.prevent="onArrowDown"
      @keydown.up.prevent="onArrowUp"
      @keydown.enter.tab.prevent="selectCurrentSelection"
      autocomplete="off"
   />
    <div v-if="isListVisible" class="simple-typeahead-list">
      <div class="simple-typeahead-list-header" v-if="$slots['list-header']">
        <slot name="list-header"></slot>
      </div>
      <div
        class="simple-typeahead-list-item"
        :class="{
          'simple-typeahead-list-item-active': currentSelectionIndex == index,
          'simple-typeahead-list-item-selected' : filteredItems.length == 1 && filteredItems[0].text == inputStringComputed
        }"
        v-for="(item, index) in filteredItems"
        :key="index"
        @mousedown.prevent
        @click="selectItem(item)"
        @mouseenter="currentSelectionIndex = index"
      >
        <span
          class="simple-typeahead-list-item-text"
          :data-text="itemProjection(item)"
          v-if="$slots['list-item-text']"
          ><slot
            name="list-item-text"
            :item="item"
            :itemProjection="itemProjection"
            :boldMatchText="boldMatchText"
          ></slot
        ></span>
        <span
          class="simple-typeahead-list-item-text"
          :data-text="itemProjection(item)"
          v-else
          >{{ itemProjection(item) }}</span
        >
      </div>
      <div class="simple-typeahead-list-footer" v-if="$slots['list-footer']">
        <slot name="list-footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { generateId as generateIdHelper } from '@/core/helpers/generate-id'
export default /* #__PURE__*/ defineComponent({
  name: 'Vue3SimpleTypeahead',
  emits: ['onInput', 'onFocus', 'onBlur', 'selectItem', 'onChange'],
  props: {
    id: {
      type: String,
    },
    placeholder: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      required: true,
    },
    defaultItem: {
      default: null,
    },
    itemProjection: {
      type: Function,
      default(item) {
        return item
      },
    },
    minInputLength: {
      type: Number,
      default: 2,
      validator: (prop) => {
        return prop >= 0
      },
    },
    inputString: {
      type: String,
      required: true,
    },
  },
  mounted() {
    if (this.defaultItem !== undefined && this.defaultItem !== null) {
      this.selectItem(this.defaultItem)
    }
  },
  data() {
    return {
      inputId: `simple_typeahead_${generateIdHelper(5)}`,
      isInputFocused: false,
      currentSelectionIndex: 0,
    }
  },
  methods: {
    onInput() {
      if (
        this.isListVisible &&
        this.currentSelectionIndex >= this.filteredItems.length
      ) {
        this.currentSelectionIndex = (this.filteredItems.length || 1) - 1
      }
      this.$emit('onInput')
    },
    onFocus() {
      this.isInputFocused = true
      this.$emit('onFocus')
    },
    onBlur() {
      this.isInputFocused = false
    },
    onArrowDown() {
      if (
        this.isListVisible &&
        this.currentSelectionIndex < this.filteredItems.length - 1
      ) {
        this.currentSelectionIndex++
      }
      this.scrollSelectionIntoView()
    },
    onArrowUp() {
      if (this.isListVisible && this.currentSelectionIndex > 0) {
        this.currentSelectionIndex--
      }
      this.scrollSelectionIntoView()
    },
    scrollSelectionIntoView() {
      setTimeout(() => {
        const list_node = document.querySelector(
          `#${this.wrapperId} .simple-typeahead-list`,
        )
        const active_node = document.querySelector(
          `#${this.wrapperId} .simple-typeahead-list-item.simple-typeahead-list-item-active`,
        )
        if (
          !(
            active_node.offsetTop >= list_node.scrollTop &&
            active_node.offsetTop + active_node.offsetHeight <
              list_node.scrollTop + list_node.offsetHeight
          )
        ) {
          let scroll_to = 0
          if (active_node.offsetTop > list_node.scrollTop) {
            scroll_to =
              active_node.offsetTop +
              active_node.offsetHeight -
              list_node.offsetHeight
          } else if (active_node.offsetTop < list_node.scrollTop) {
            scroll_to = active_node.offsetTop
          }
          list_node.scrollTo(0, scroll_to)
        }
      })
    },
    selectCurrentSelection() {
      if (this.currentSelection) {
        this.selectItem(this.currentSelection)
      }
    },
    selectItem(item) {
      this.$emit('onChange', this.itemProjection(item))
      this.currentSelectionIndex = 0
      document.getElementById(this.inputId).blur()
      this.$emit('selectItem', item)
    },
    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    },
    boldMatchText(text) {
      const regexp = new RegExp(
        `(${this.escapeRegExp(this.inputStringComputed)})`,
        'ig',
      )
      return text.replace(regexp, '<strong>$1</strong>')
    },
  },
  computed: {
    wrapperId() {
      return `${this.inputId}_wrapper`
    },
    filteredItems() {
      const regexp = new RegExp(
        this.escapeRegExp(this.inputStringComputed),
        'i',
      )
      return this.items.filter((item) => {
        return this.itemProjection(item).match(regexp)
      })
    },
    isListVisible() {
      return (
        this.isInputFocused &&
        this.inputStringComputed.length >= this.minInputLength &&
        this.filteredItems.length
      )
    },
    currentSelection() {
      return this.isListVisible &&
        this.currentSelectionIndex < this.filteredItems.length
        ? this.filteredItems[this.currentSelectionIndex]
        : undefined
    },
    inputStringComputed: {
      get() {
        return this.inputString
      },
      set(value) {
        // some logic
        this.$emit('onChange', value)
      },
    },
  },
})
</script>

<style lang="scss" scoped>
@import "@/assets/sass/core/components/_variables.scss";
.simple-typeahead {
  position: relative;
  width: 100%;
}
.simple-typeahead > input {
  margin-bottom: 0;
}
.simple-typeahead-input:focus {
  border-color: #409eff;
  outline: 0;
}
.simple-typeahead .simple-typeahead-list {
  position: absolute;
  width: 100%;
  overflow-y: auto;
  border: 0.1rem solid #d1d5db;
  background: $white;
  box-shadow: 0px 1px 4px rgb(0 0 0 / 20%);
  border-radius: 8px;
  z-index: 9;
}
.simple-typeahead .simple-typeahead-list .simple-typeahead-list-header {
  background-color: #fff;
  padding: 0.6rem 1rem;
  border-bottom: 0.1rem solid #d1d5db;
  border-left: 0.1rem solid #d1d5db;
  border-right: 0.1rem solid #d1d5db;
}
.simple-typeahead .simple-typeahead-list .simple-typeahead-list-footer {
  background-color: #fff;
  padding: 0.6rem 1rem;
  border-left: 0.1rem solid #d1d5db;
  border-right: 0.1rem solid #d1d5db;
}
.simple-typeahead .simple-typeahead-list .simple-typeahead-list-item {
  cursor: pointer;
  background-color: #fff;
  padding: 0.6rem 1rem;
  border: none;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.0025em;
}
.simple-typeahead
  .simple-typeahead-list
  .simple-typeahead-list-item:last-child {
  border-bottom: none;
}
.simple-typeahead .simple-typeahead-list .simple-typeahead-list-item:hover {
  background-color: $light-blue;
  color: $blue;
}
.simple-typeahead .simple-typeahead-list .simple-typeahead-list-item-selected {
  background-color: $blue;
  color: $white;
}
</style>
