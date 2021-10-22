<template>
  <div v-bind:style="{ marginLeft: tabs + 'ch' }">
    <div v-on:click="toggleShow" v-if="isFolder">{{ filename }}</div>
    <a href="nextLevel.href" v-else>{{ filename }}</a>
  </div>
  <List
    v-if="isFolder && shouldShow"
    v-for="item in nextLevel"
    :startingShow="false"
    :bookmarks="item"
    :tabs="tabs + 2"
  ></List>
</template>


<script>
export default {
  name: "List"
}
</script>

<script setup>
import { ref, toRefs, computed } from 'vue'
const props = defineProps({
  bookmarks: JSON,
  updateBookmarks: Function,
  tabs: Number,
  startingShow: Boolean
})
const { bookmarks, updateBookmarks, startingShow } = toRefs(props)

const filename = computed(() => Object.keys(bookmarks.value)[0])
const nextLevel = computed(() => Object.values(bookmarks.value)[0])
const isFolder = computed(() => Array.isArray(Object.values(bookmarks.value)[0]))
const isBookmark = computed(() => !!Object.values(bookmarks.value)[0].href)

const shouldShow = ref(startingShow.value)

const toggleShow = () => {
  shouldShow.value = !shouldShow.value
}
// it's either
// a folder, which is an a
// 

</script>

<style lang="scss" scoped>
</style>
