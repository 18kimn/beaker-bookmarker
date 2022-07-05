<script lang="ts">
  import type {Entry, Folder} from '../types'
  import Edit from './Edit.svelte'

  /*
  An 'Entry' is the DOM element surrounding either
  - a folder and its children
  - a bookmark
*/
  export let parent: Folder
  export let entry: Entry

  let shouldShowActions = false

  $: ({name, type, searched} = entry)
</script>

<div
  class="row"
  on:mouseenter={() => {
    shouldShowActions = true
  }}
  on:mouseleave={() => {
    shouldShowActions = false
  }}
>
  <div class="child" class:searched>
    <slot name="row" />
  </div>
  {#if shouldShowActions}
    <Edit {parent} {entry} />
  {/if}
</div>
<slot name="rest" />

<style>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .child {
    border: solid 1px black;
    max-width: 20ch;
    word-wrap: break-word;
    padding: 0.2rem;
    cursor: pointer;
  }

  .searched {
    background: #c6f4ff;
    animation-name: blink;
    animation-duration: 1s;
    animation-direction: alternate;
    animation-iteration-count: 10;
  }

  @keyframes blink {
    0% {
      background: #c6f4ff;
    }
    100% {
      background: white;
    }
  }
</style>
