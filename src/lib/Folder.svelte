<script lang="ts">
  import Bookmark from './Bookmark.svelte'
  import Entry from './Entry.svelte'
  import type {Folder} from '../types'

  export let folder: Folder = {name: '', entries: []}
  export let parent: Folder = folder
  export let isRoot = false
  export let tabs = 1

  let shouldShowChildren: boolean

  $: ({name, entries} = folder)
  $: shouldShowChildren =
    isRoot ||
    Boolean(entries.find((entry) => entry.searched)) ||
    folder.searched
</script>

<Entry {parent} entry={folder}>
  <div
    slot="row"
    on:click={() => {
      shouldShowChildren = !shouldShowChildren
    }}
  >
    {@html name}
  </div>
  <div slot="rest" class="children" style="padding-left: {tabs}ch;">
    {#if shouldShowChildren}
      {#each entries as entry}
        {#if entry.type === 'folder'}
          <svelte:self
            parent={folder}
            folder={entry}
            tabs={tabs + 1}
          />
        {:else}
          <Entry parent={folder} {entry}>
            <Bookmark slot="row" bookmark={entry} />
          </Entry>
        {/if}
      {/each}
    {/if}
  </div>
</Entry>

<style>
  .children {
    display: flex;
    flex-direction: column;
  }
</style>
