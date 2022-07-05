<script lang="ts">
  import type {Folder, Entry} from '../types'

  export let parent: Folder
  export let entry: Entry

  const index = parent.entries.findIndex((item) => item === entry)

  // here reassignments are needed to force svelte rerender
  /** add an item to the parent at the (index + 1)th spot */
  function add() {
    const empty =
      parent.type === 'folder'
        ? ({name: '', type: 'folder', entries: []} as Folder)
        : ({
            name: '',
            type: 'bookmark',
            href: '',
            icon: ''
          } as Bookmark)
    parent.entries[index].splice(index + 1, 0, empty)
    parent = parent
  }

  /** splice it out of the parent */
  function remove() {
    parent.entries[index].splice(index, 1)
    parent = parent
  }
  $: ({name, type} = entry)
</script>

<div class="edit-buttons">
  <div class="add" on:click={add}>+</div>
  <div class="remove" on:click={remove}>x</div>
</div>

<style>
  .edit-buttons {
    display: flex;
    flex-direction: row;
  }
</style>
