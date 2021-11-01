<template>
  <input type="file" ref="fileUploader" id="bookmarksfile" @change="updateFile" />
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['onUpdate'])
const fileUploader = ref({})

const HTMLparser = (prev, curr) => {

  // in the received HTML, it is either
  //  dt: either a folder (dl and h3) container or a bookmark (a) container
  //  dl: list of items in a folder. Should be looped through\
  //  a: an actual bookmark! a base case for recursion
  //  h3: the name of a folder. handled in dt case
  //  p: always an empty element, useless
  const children = [...curr.children]

  switch (curr.tagName) {
    case "P":
    case "H3":
    case "A":
      return prev;
    case 'DT':
      const title = curr.querySelector('h3')
      if (title) {
        const dl = [...curr.querySelector('dl').children]
        return [...prev, { [title.innerHTML]: dl.reduce(HTMLparser, []) }]
      }
      const a = curr.querySelector('a')
      return [
        ...prev,
        { [a.innerHTML]: { href: a.href, icon: a.getAttribute('icon') } }
      ]
    case "DL":
      const recursed = children.reduce(HTMLparser, [])
      return [...prev, ...recursed];
  }
}
function updateFile() {
  const file = fileUploader.value.files[0]
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onload = () => {
    const el = document.createElement('div')
    el.innerHTML = reader.result
    const bookmarkList = [...el.querySelector('dl').children]
    const parsedBookmarks = bookmarkList.reduce(HTMLparser, [])
    emit('onUpdate', { bookmarks: parsedBookmarks })
  }
}

</script>

<style lang="scss" scoped>
</style>