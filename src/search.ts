import type {Entry} from './types'

/** given a query and bookmarks, returns bookmarks with updated fields */
export default function search(query: string, entry: Entry): Entry {
  if (!query) return entry
  const {name, type} = entry
  const isFolder = type === 'folder'
  if (isFolder) {
    const children = entry.entries.map((item) => search(query, item))
    return {
      name,
      type: 'folder',
      entries: children,
      searched: Boolean(children.find((entry) => entry.searched))
    }
  } else {
    const {href, name} = entry
    const target = href.toLowerCase() + name.toLowerCase()
    return {
      name,
      type: 'bookmark',
      href: entry.href,
      icon: entry.icon,
      searched: Boolean(target.match(query.toLowerCase()))
    }
  }
}

let timer: number
let lastInput = ''
/** written so that svelte doesnt do too many rerenders, but
 * seems like it's not actually necessary */
export function debouncedSearch(query: string, entry: Entry) {
  if (query === lastInput)
    return new Promise((resolve) => resolve(''))
  lastInput = query
  timer && clearTimeout(timer)
  return new Promise((resolve) => {
    console.log(query)
    timer = setTimeout(() => resolve(search(query, entry)), 1000)
  })
}
