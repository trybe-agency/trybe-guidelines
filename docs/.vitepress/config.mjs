import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Trybe Guidelines ",
  description: "Trybe Guidelines and documentations",
  themeConfig: {
    logo: '/logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/getting-started' },
    ],

    sidebar: [
      {
        items: [
          { text: 'getting-started', link: '/getting-started' },
          {
            text: 'code standards',
            items: [
              { text: 'vuejs', link: '/code-standards/vuejs' },
              { text: 'php', link: '/code-standards/php' }
            ]
          },
        ]
      }
    ],

    footer: {
      copyright: 'Copyright © 2025-The trybe agency'
    },

    search: {
      provider: 'local'
    },


    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
