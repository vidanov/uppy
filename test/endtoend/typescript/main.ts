import 'es6-promise/auto'
import 'whatwg-fetch'
import {
  Core,
  Dashboard,
  Instagram,
  Dropbox,
  GoogleDrive,
  Url,
  Webcam,
  Tus,
  Form
} from 'uppy'

const h1 = document.createElement('h1')
h1.textContent = 'Test thing'
document.body.appendChild(h1)

window.onerror = (msg) => {
  const h1 = document.createElement('h1')
  h1.textContent = `Error: ${msg}`
  h1.style.color = 'red'
  document.body.appendChild(h1)
}

// @ts-ignore
const isOnTravis = !!(process.env.TRAVIS && process.env.CI)
const TUS_ENDPOINT = `http://${isOnTravis ? 'companion.test' : 'localhost'}:1080/files/`

const uppy = Core({
  debug: true,
  meta: {
    username: 'John',
    license: 'Creative Commons'
  }
})
  .use(Dashboard, {
    target: document.body,
    trigger: '#pick-files',
    metaFields: [
      { id: 'license', name: 'License', placeholder: 'specify license' },
      { id: 'caption', name: 'Caption', placeholder: 'add caption' }
    ],
    showProgressDetails: true,
    proudlyDisplayPoweredByUppy: true,
    note: '2 files, images and video only'
  })
  .use(GoogleDrive, { target: Dashboard, companionUrl: 'http://localhost:3020' })
  .use(Instagram, { target: Dashboard, companionUrl: 'http://localhost:3020' })
  .use(Dropbox, { target: Dashboard, companionUrl: 'http://localhost:3020' })
  .use(Url, { target: Dashboard, companionUrl: 'http://localhost:3020' })
  .use(Webcam, { target: Dashboard })
  .use(Tus, { endpoint: TUS_ENDPOINT })
  .use(Form, { target: '#upload-form' })
  // .use(GoldenRetriever, {serviceWorker: true})

uppy.on('complete', (result) => {
  if (result.failed.length === 0) {
    console.log('Upload successful 😀')
  } else {
    console.warn('Upload failed 😞')
  }
  console.log('successful files:', result.successful)
  console.log('failed files:', result.failed)
})
