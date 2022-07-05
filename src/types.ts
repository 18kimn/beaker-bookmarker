export type Folder = {
  name: string
  type: 'folder'
  entries: Entry[]
  searched?: boolean
}

export interface Bookmark {
  name: string
  type: 'bookmark'
  href: string
  icon: string
  searched?: boolean
}

export type Entry = Folder | Bookmark
