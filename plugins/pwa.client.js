import Vue from 'vue'

export default (_, inject) => {
  const state = Vue.observable({
    updateAvailable: false,
    installAvailable: false,
    iosInstallAvailable: false,
    installed: false,
  })

  let deferredInstallPrompt = null
  let registration = null

  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true

  state.installed = isStandalone()
  state.iosInstallAvailable = isIos && !state.installed

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredInstallPrompt = event
    state.installAvailable = !state.installed
  })

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null
    state.installed = true
    state.installAvailable = false
    state.iosInstallAvailable = false
  })

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((readyRegistration) => {
      registration = readyRegistration

      const checkForWaitingWorker = () => {
        if (registration.waiting && navigator.serviceWorker.controller) {
          state.updateAvailable = true
        }
      }

      checkForWaitingWorker()
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing
        if (!installingWorker) return

        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            state.updateAvailable = true
          }
        })
      })

      // Check for a newly deployed version when the app opens.
      registration.update().catch(() => {})
    }).catch(() => {})
  }

  inject('pwa', {
    state,
    activateUpdate() {
      // Reloading releases this page's old service worker client so the waiting worker can activate.
      window.location.reload()
    },
    async install() {
      if (!deferredInstallPrompt) return false

      deferredInstallPrompt.prompt()
      const choice = await deferredInstallPrompt.userChoice
      deferredInstallPrompt = null
      state.installAvailable = false
      return choice.outcome === 'accepted'
    },
  })
}
