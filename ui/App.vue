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

/* 
  Enable arrow key navigation:
    Up, Left = go back up an item
    Right, Down = go to the next item
  Items is recalculated every item because items on the DOM might change
*/
const onKeyDown = ({ code }) => {
  const items = Array.from(document.querySelectorAll('.item'))
  const currentItemIndex = items.indexOf(document.activeElement)
  let toIndex
  if (['ArrowRight', 'ArrowDown'].includes(code)) {
    toIndex = Math.min(currentItemIndex + 1, items.length - 1)
  } else if (['ArrowLeft', 'ArrowUp'].includes(code)) {
    toIndex = Math.max(currentItemIndex - 1, 0)
  } else {
    toIndex = currentItemIndex
  }
  items[toIndex]?.focus()
}

onMounted(async () => {
  console.log(import.meta.env)
  const predefinedBookmarks = await fetch('/bookmarks.json').then(res => res.json())
  const actualBookmarks = await fetch('http://localhost:3200/')
    .then(res => res.json())
    .then(test => {
      console.log(test)
      return test
    })
    .catch(err => {
      console.log(err)
      return predefinedBookmarks
    })
  document.addEventListener('keydown', onKeyDown)
  bookmarks.value = actualBookmarks
})
const updateBookmarks = async (newBookmarks) => {
  console.log('updateBookmarks called with', newBookmarks)
  bookmarks.value = newBookmarks
  await fetch('http://localhost:3200/', {
    method: 'post',
    body: JSON.stringify(newBookmarks),
    headers: { "Content-Type": "application/json" }
  }).catch(err => console.log(err))
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
  width: 100vw;
  height: 100vh;
  margin: 0;
  background: #fdf6e3;
}

#app {
  padding: 10px;
}

::-webkit-scrollbar {
  display: none;
}
* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>