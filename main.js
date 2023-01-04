import App from './App'
import multiplePicker from '/components/multiple-picker/multiple-picker.vue'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

Vue.component('uni-nav-bar', uniNavBar);
Vue.component('multiple-picker', multiplePicker);

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
