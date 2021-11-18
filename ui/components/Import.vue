<template>
  <div class="container">
    <label class="button" for="bookmarksfile">
      import bookmarks
      <input type="file" ref="fileUploader" id="bookmarksfile" @change="updateFile" />
    </label>

    <div v-if="bookmarksImported" class="button" v-on:click="saveBookmarks">save imported bookmarks</div>
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue'
const props = defineProps({
  bookmarks: JSON,
})
const { bookmarks } = toRefs(props)
const updatedBookmarks = ref(bookmarks.value)
const bookmarksImported = ref(false)
const emit = defineEmits(['onUpdate'])
const fileUploader = ref({})

const HTMLparser = (prev, curr) => {
  // recursive parser to import bookmarks taht are exported from chrome
  // in that document, items are one of:
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
    updatedBookmarks.value = {
      ...bookmarks.value,
      bookmarks: [...bookmarkList.reduce(HTMLparser, [])],
    }
    console.log(JSON.parse(JSON.stringify(updatedBookmarks.value)))
    emit('onUpdate', updatedBookmarks.value)
    bookmarksImported.value = true
  }
}

async function saveBookmarks() {
  console.log(JSON.parse(JSON.stringify(updatedBookmarks.value)))
  await fetch('http://localhost:3200/', {
    method: 'post',
    body: JSON.stringify(updatedBookmarks.value),
    headers: { "Content-Type": "application/json" }
  }
  ).catch(err => err)

  console.log('data written!')
}


</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  width: fit-content;
}

.button {
  margin: 0.2rem;
  padding: 0.5rem;
  border: #93a1a1 solid 1px;
  width: fit-content;
  cursor: pointer;
  background: white;
}

/* 
hide the ugly file input button,
but keep it screen-readable and selectable with focus-within
*/

#bookmarksfile {
  opacity: 0;
  width: 0;
}
.button:hover,
.button:focus-within {
  background: black;
  color: white;
}
</style>