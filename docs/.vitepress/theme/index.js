// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    router.beforeEach((to, from, next) => {
      if (!localStorage.getItem("auth") && to.path !== "/login.html") {
        window.location.href = "/login.html"; // Redirect to login
      } else {
        next();
      }
    });
  },
}
