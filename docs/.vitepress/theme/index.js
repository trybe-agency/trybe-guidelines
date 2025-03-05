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
      if(localStorage.getItem("auth") !== "26967b7e73500347f08224ccb27df3d4650e27602fc8fb3ddf593f09fa1e7447") {
        window.location.href = "/login.html"; // Redirect to login page
      }
    }
  },
}
