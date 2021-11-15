<template>
  <div v-bind:style="{ paddingLeft: tabs + 'ch', width: '100%' }">
    <div class="container" @mouseenter="isHover = true" @mouseleave="isHover = false">
      <div class="bookmarkContainer">
        <div class="item" @click="toggleShow">
          <div class="textContainer">
            <div v-if="isFolder">{{ filename }}</div>
            <div style="display: flex; align-items: center;" v-else>
              <img
                v-bind:src="nextLevel.icon ||
                'http://s2.googleusercontent.com/s2/favicons?domain_url=' + nextLevel.href"
                style="margin: 0 7px;"
              />
              <a v-bind:href="nextLevel.href" target="__blank">{{ filename }}</a>
            </div>
          </div>
        </div>
        <div v-if="isFolder && isHover" @click="isInputting = true" class="add">+</div>
        <div v-if="!isFolder && isHover" class="add" @click="deleteBookmark">x</div>
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
          <input v-model="link" placeholder="Link" />
          <input v-model="name" placeholder="Name" />
        </div>
      </div>
    </div>
    <List
      v-if="isFolder && shouldShow"
      v-for="item in nextLevel"
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
const filename = computed(() => Object.keys(bookmarks.value)[0])
const nextLevel = computed(() => Object.values(bookmarks.value)[0])
// if this item contains other things,
//  i.e. if the next level after this is an array,
//  the current item is a folder
const isFolder = computed(() => Array.isArray(nextLevel.value))

const shouldShow = ref(isRoot.value)
const isHover = ref(false)
const isAddHover = ref(false)
const isInputting = ref(false)
const link = ref('')
const name = ref('')
const toggleShow = () => {
  shouldShow.value = !shouldShow.value
}


// when an element is added,
// if it's the root component, send a POST request to the api
//    with data being the new bookmarks
// that's specified in App.vue and is passed to the root component
// if it's not the root component, it should emit an event to
//   send it back up the tree. 

const addBookmark = async () => {
  const key = Object.keys(bookmarks.value)[0]
  const value = Object.values(bookmarks.value)[0]
  const newBookmarks = {
    [key]: [...value, { [name.value]: { href: link.value } }]
  }
  console.log(JSON.parse(JSON.stringify(newBookmarks)))
  emit('update', newBookmarks)
  isInputting.value = false
  shouldShow.value = true
}

const deleteBookmark = () => {
  emit('update', { [filename.value]: {} })
}
const updater = (updatedBookmark) => {

  // if the item to update already exists, replace it instead of updating
  //  and if the replacement is an empty array, just delete it
  const key = Object.keys(updatedBookmark)[0]
  const value = updatedBookmark[key]
  console.log({ key, value })
  const newBookmarks = nextLevel.value.reduce((prev, currentFolder) => {

    if (Object.keys(currentFolder)[0] !== key) {
      return [...prev, currentFolder] // unchanged case
    } else if (typeof Object.keys(value)[0] === 'undefined') {
      return prev // deletion case
    } else {
      return [...prev, updatedBookmark] // updating case
    }
  }, [])

  emit('update', { [filename.value]: newBookmarks })
}
</script>

<style scoped>
.item {
  margin: 0.2rem;
  padding: 0.5rem;
  border: black solid 1px;
  cursor: pointer;
  width: fit-content;
}

.item:hover {
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
</style>
