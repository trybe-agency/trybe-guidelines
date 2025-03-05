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
    if (typeof window !== "undefined") {
      // Check if user is authenticated
      if (!localStorage.getItem("auth") && window.location.pathname !== "/login.html") {
        window.location.href = "/login.html"; // Redirect to login page
      }
      if(localStorage.getItem("auth") !== "lopoko") {
        window.location.href = "/login.html"; // Redirect to login page
      }
    }
  },
}
