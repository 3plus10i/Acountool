<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          :src="require('./assets/alpha-a-circle.svg')"
          contain
        />

         <v-toolbar-title class="ml-5">UTEXEOLB</v-toolbar-title>
          
      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <v-container fluid class="fill-height">
        <Main/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import Main from './components/Main'

export default {
  name: 'App',

  components: {
    Main
  },
};
</script>

<style>


.application {
  font-family: "Courier New"
}

</style>
