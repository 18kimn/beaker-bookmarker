<template>
  <div>
    <div style="display: flex;">
      <div v-bind:style="{ marginLeft: tabs + 'ch' }">
        <div v-on:click="toggleShow" v-if="isFolder">{{ filename }}</div>
        <a href="nextLevel.href" v-else>{{ filename }}</a>
      </div>
      <div v-if="!isFolder" v-on:click="onClick">+</div>
    </div>
    <List
      v-if="isFolder && shouldShow"
      v-for="item in nextLevel"
      :isRoot="false"
      :bookmarks="item"
      :tabs="tabs + 2"
      @update="updater"
    ></List>
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

const toggleShow = () => {
  shouldShow.value = !shouldShow.value
}
// if it's the root component, send a PUT request to the api
//    with data being {...bookmarks, [keyBeingUpdated]: [newValue]}
// that's specified in App.vue and is passed to the root component
// if it's not the root component, it should emit an event to
//   send it back up the tree. 

// this can be taken care of one function specified in App.vue and 
//  another, single function specified in List.vue that simply sends 
//  it back up the tree

const onClick = () => {
  emit('update', [bookmarks.value, { newItem: { href: 'https://github.com', icon: '' } }])
}

const updater = (data) => {
  console.log('update received with data', data,
    { isFolder: isFolder.value }, { bookmarks: bookmarks.value },
    { nextLevel: nextLevel.value },
    { filename: filename.value })
  if (isFolder.value) {
    // if current object is folder, 
    // data received is a new item in next to a child element
    // 
    emit('update', { [filename.value]: [...nextLevel.value, ...Object.values(data)] })

  } else {
    emit('update', [bookmarks.value, data])
  }

}
</script>

<style lang="scss" scoped>
</style>
