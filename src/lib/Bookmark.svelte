<script lang="ts">
  import {onMount} from 'svelte'
  import type {Bookmark, Folder} from '../types'

  export let bookmark: Bookmark

  $: ({name, href, icon, selected, searched} = bookmark)
</script>

{#if icon}
  <img src={icon} alt={`Image for ${href.slice(0, 20)}`} />
{/if}
<a {href} target="_blank" rel="noreferrer noopener">
  {@html name.slice(0, 20)}
</a>

<style>
  a {
    color: black;
  }
</style>
