<script lang="ts">
  import {onMount} from 'svelte'
  import type {Entry} from './types'
  import Folder from './lib/Folder.svelte'
  import search from './search'

  let bookmarks = {
    name: 'bookmarks',
    type: 'folder',
    entries: []
  } as Entry

  const PORT = import.meta.env.VITE_PORT
  onMount(async () => {
    bookmarks = (await fetch(
      `http://localhost:${PORT}/bookmarks`
    ).then((res) => res.json())) as Entry
  })

  let query: string
  $: {
    const entry = search(query, bookmarks)
    if (entry?.entries?.length) {
      bookmarks = entry
    }
  }
</script>

<Folder bind:folder={bookmarks} isRoot />
<input bind:value={query} />
{#if query}
  {query}
{/if}

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
      sans-serif;
    margin: 0;
    padding: 0;
  }

  :global(html),
  :global(body),
  :global(#app) {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  main {
    text-align: center;
    padding: 1em;
  }
</style>
