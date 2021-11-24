<!-- this is a recursive component that renders bookmarks 
It has to be recursive because we have a potentially 
infinite amount of nested bookmark folders -->
<!-- each component renders in english:
1. this bookmark
  a. the left-hand side content of the bookmark
      1. the content of the bookmark
      2. an "add" button that shows on hover
  b. an element for where new bookmarks can be added
2. all of the other bookmarks in the next level. That's the <List ...> component-->

<template>
  <div v-bind:style="{ paddingLeft: tabs + 'ch', width: '100%' }">
    <div class="container" @mouseenter="isHover = true" @mouseleave="isHover = false">
      <div class="bookmarkContainer">
        <button
          draggable="true"
          role="button"
          aria-label="click to open bookmarks"
          class="item"
          @click="toggleShow"
        >
          <div class="textContainer">
            <div v-if="isFolder">{{ currentBookmarkName }}</div>
            <div style="display: flex; align-items: center;" v-else>
              <img
                v-bind:src="currentEntries.icon ||
                'http://s2.googleusercontent.com/s2/favicons?domain_url=' + currentEntries.href"
                v-bind:alt="`icon for ${currentBookmarkName}`"
                style="margin: 0 7px;"
              />
              <a class="link" v-bind:href="currentEntries.href" target="__blank">{{ currentBookmarkName }}</a>
            </div>
          </div>
        </button>
        <div v-if="isFolder && isHover" @click="isInputting = true" class="add">+</div>
        <div v-if="isHover" class="add" @click="deleteBookmark">x</div>
      </div>
      <div
        @mouseenter="isAddHover = true"
        @mouseleave="isAddHover = false"
        class="addContainer"
        v-if="isInputting"
      >
        <div v-if="isAddHover" class="add" @click="isInputting = false">x</div>
        <div class="item" @click="addBookmark">add</div>
        <div class="inputs">
          <input v-model="newBookmarkLink" placeholder="Link" />
          <input v-model="newBookmarkName" placeholder="Name" />
        </div>
      </div>
    </div>
    <List
      v-if="isFolder && shouldShow"
      v-for="item in currentEntries"
      :isRoot="false"
      :bookmarks="item"
      :tabs="tabs + 2"
      @update="updater"
    />
  </div>
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
  tabs: Number,
  isRoot: Boolean,
  onUpdate: Function
})

const emit = defineEmits(['update'])
const { bookmarks, isRoot, tabs } = toRefs(props)
const currentBookmarkName = computed(() => Object.keys(bookmarks.value)[0])
const currentEntries = computed(() => Object.values(bookmarks.value)[0])
// if this item contains other things,
//  i.e. if the next level after this is an array,
//  the current item is a folder
const isFolder = computed(() => Array.isArray(currentEntries.value))

const shouldShow = ref(isRoot.value)
const isHover = ref(false)
const isAddHover = ref(false)
const isInputting = ref(false)
const newBookmarkLink = ref('')
const newBookmarkName = ref('')
const toggleShow = () => {
  shouldShow.value = !shouldShow.value
}
/* DRAG LOGIC */

// element to be dragged 

// const onDragStart = (e) => {
//   e.dataTransfer.setData('text/plain', "this is a message")
//   console.log(e)
// }



// when an element is added,
// if it's the root component, send a POST request to the api
//    with data being the new bookmarks
// that's specified in App.vue and is passed to the root component
// if it's not the root component, it should emit an event to
//   send it back up the tree. 

const addBookmark = async () => {

  // if a link was given, it's a bookmark 
  //  which is an object with structure {href: __, icon: __}
  // if a link wasn't given, it's the creation of a new folder 
  //  which is an empty array
  const port = import.meta.env.VITE_PORT
  const newEntry = newBookmarkLink.value ? 
  {href: newBookmarkLink.value,
  icon: await fetch(
    `http://localhost:${port}/icon?domain=${newBookmarkLink.value}`
  ).then(res => res.text())
  } :
  []

  // append our new entry to 
  // the previous existing entries on the current level 
  const newBookmarks = {
    [currentBookmarkName.value]: [...currentEntries.value, 
    { [newBookmarkName.value]: newEntry}
    ]
  }

  // then send it 'up' so that the root data structure can know about this
  emit('update', newBookmarks)

  // finally set some state manually to hide the "add bookmark" menu
  isInputting.value = false
  shouldShow.value = true
}

// to delete a bookmark, we can just make it into an empty array
const deleteBookmark = () => {
  emit('update', { [currentBookmarkName.value]: {} })
}

const updater = (updatedBookmark) => {

  // if the item to update already exists, replace it instead of updating
  //  and if the replacement is an empty array, just delete it
  const key = Object.keys(updatedBookmark)[0]
  const value = updatedBookmark[key]
  console.log({ key, value })
  const newBookmarks = currentEntries.value.reduce((prev, currentFolder) => {

    if (Object.keys(currentFolder)[0] !== key) {
      return [...prev, currentFolder] // unchanged case
    } else if (typeof Object.keys(value)[0] === 'undefined') {
      return prev // deletion case
    } else {
      return [...prev, updatedBookmark] // updating case
    }
  }, [])

  emit('update', { [currentBookmarkName.value]: newBookmarks })
}
</script>

<style scoped>
.item {
  margin: 0.2rem;
  padding: 0.5rem;
  border: #93a1a1 solid 1px;
  cursor: pointer;
  width: fit-content;
  background: white;
  color: black;
}

.item:hover,
.item:focus {
  background: black;
  color: white;
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.textContainer {
  max-width: 50ch;
  overflow-x: scroll; /* needed for really long links that don't wrap in response to max-width */
}

.bookmarkContainer {
  display: flex;
  place-items: center;
}

.addContainer {
  display: flex;
  flex-direction: row;
  margin: 0 20px;
}

.inputs {
  display: flex;
  flex-direction: column;
}
.add {
  font-size: 16pt;
  cursor: pointer;
  padding: 5px;
}
.add:hover {
  color: white;
  background: black;
}

.link:focus,
.link:hover {
  color: red;
  font-weight: bold;
  outline: unset;
}
</style>
