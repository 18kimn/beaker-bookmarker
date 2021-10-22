<template>
  <Import @update-bookmarks="updateBookmarks" />
  <List :bookmarks="bookmarks" :tabs="0" :startingShow="true" />
</template>

<script setup>
import Import from './components/Import.vue'
import List from './components/List.vue'
import { ref } from 'vue'

// this file serves as the "source of truth" for bookmarks
// all child components mutate this object
const bookmarks = ref({})
const updateBookmarks = (newBookmarks) => {
  bookmarks.value = newBookmarks
}

</script>

<style lang="scss" scoped>
</style>