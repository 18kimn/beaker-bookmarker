import fetch from 'node-fetch'

async function fetchFaviconAsBase64(domain) {
  const res = await fetch(
    `https://s2.googleusercontent.com/s2/favicons?domain=${domain}`,
  )
  const contentType = res.headers.get('content-type')
  const arrayBuffer = await res.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')

  return `data:${contentType};base64,${base64}`
}

// usage:
// const test = await fetchFaviconAsBase64('http://stackoverflow.com')
// console.log(test)
// data:image/png;base64,iVBORw0K ...
export default fetchFaviconAsBase64
