<template>
  <List :bookmarks="bookmarks" :tabs="0" :isRoot="true" @update="updateBookmarks" />
  <Import :bookmarks="bookmarks" @onUpdate="updateBookmarks" />
</template>

<script setup>
import Import from './components/Import.vue'
import List from './components/List.vue'
import { ref, onMounted } from 'vue'

// this file serves as the "source of truth" for bookmarks
// all child components mutate this object


const bookmarks = ref({ bookmarks: {} })

onMounted(async () => {
  const fetched = await fetch('http://localhost:3200/').then(res => res.json())
  bookmarks.value = fetched
})
const updateBookmarks = async (newBookmarks) => {
  console.log('updateBookmarks called with', newBookmarks)
  bookmarks.value = newBookmarks
  await fetch('http://localhost:3200/', {
    method: 'post',
    body: JSON.stringify(newBookmarks),
    headers: { "Content-Type": "application/json" }
  })
}

</script>

<style>
html,
body,
input,
button {
  font-family: Fira Code;
}

html,
body {
  overflow-x: hidden;
}
::-webkit-scrollbar {
  display: none;
}
* {
  -ms-overflow-style: none;
}
</style>