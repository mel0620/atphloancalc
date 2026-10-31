<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>
    <v-snackbar
      :value="$pwa.state.updateAvailable"
      color="primary"
      :timeout="0"
      bottom
      class="update-snackbar"
    >
      An update is available.
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="$pwa.activateUpdate()">Refresh</v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      :value="showInstallPrompt"
      color="primary"
      :timeout="0"
      bottom
      class="install-snackbar"
    >
      Install AutoTrustPH Loan Calculator as an app.
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="installApp">Install as an app</v-btn>
      </template>
    </v-snackbar>
    <v-dialog v-model="showIosInstallInstructions" max-width="420">
      <v-card>
        <v-card-title>Install on iPhone or iPad</v-card-title>
        <v-card-text>
          In Safari, tap the Share button, then choose <strong>Add to Home Screen</strong>.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="showIosInstallInstructions = false">Got it</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <!-- <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <!-- <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; AutoTrustPH {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  computed: {
    showInstallPrompt () {
      return !this.$pwa.state.updateAvailable &&
        (this.$pwa.state.installAvailable || this.$pwa.state.iosInstallAvailable)
    },
  },
  methods: {
    async installApp () {
      if (this.$pwa.state.iosInstallAvailable) {
        this.showIosInstallInstructions = true
        return
      }

      await this.$pwa.install()
    },
  },
  data () {
    return {
      showIosInstallInstructions: false,
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-calculator',
          title: 'Loan Calculator',
          to: '/'
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'About Us',
          to: '/aboutus'
        },
        {
          icon: 'mdi-phone',
          title: 'Contact Us',
          to: '/contactus'
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Loan Calculator'
    }
  }
}
</script>
