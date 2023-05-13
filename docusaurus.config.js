const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: '小天的docs', // 站点名称
  tagline: '小天的日常记录',  // slogan，标语
  url: 'https://xiangge0405.github.io',   //  站点的地址
  baseUrl: '/xdocs',// 前置路径
  onBrokenLinks: 'throw',//  编译遇到死链怎么处理
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',// 网站的图标

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'xiangge0405', // GitHub 上的组织名或者用户名
  projectName: 'xdocs', // GitHub 上仓库的名称
  // deploymentBranch: 'gh-pages', // 部署到的分支名

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  themes: [
    'live-codeblock',
    // ... Your other themes.
    [
      // Docusaurus v2的离线/本地搜索插件/主题，支持多种语言，特别是针对zh语言进行了优化。
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        language: ["en", "zh"],
        highlightSearchTermsOnTargetPage: true,
        removeDefaultStemmer: true,
      },
    ],
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          /* 文档插件配置 */
          //routeBasePath: '/', // 把文档放在网站根部
          /* 其他文档插件配置 */
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        // blog: {
        //   /* 博客插件配置 */
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   // editUrl:
        //   //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // 交互式代码编辑器
      liveCodeBlock: {
        playgroundPosition: 'bottom',
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      // 色彩模式
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: '小天的日常记录',// 导航上站点名称
        logo: {
          alt: '小天的doc Logo',//  站点 logo 文字替换
          src: 'img/logo.svg',//   站点 logo  链接
        },
        hideOnScroll: true,
        items: [
          {
            type: 'doc',
            docId: 'home',
            position: 'left',
            label: '文档',
          },
          // {
          //   to: '/blog',  // 点击后跳转的链接，站内跳转用 to ,站外用 href
          //   label: '博客', // 显示的名称
          //   position: 'left'// 显示在导航的 左边 还是 右边
          // },
          {
            href: 'https://github.com/XiangGe0405/xbolgs',
            // label: 'GitHub',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
          {
            type: 'dropdown',
            position: 'right',
            label: '快速访问🎈',
            items: [
              {
                label: 'LeetCode',
                href: 'https://leetcode.cn/',
              }, 
              {
                label: 'Vue.js',
                href: 'https://cn.vuejs.org/v2/guide/',
              }, 
              {
                label: 'Can I Use',
                href: 'https://www.caniuse.com/#home',
              },
              {
                label: 'Java SE API Documentation',
                href: 'https://docs.oracle.com/javase/8/docs/api/index.html',
              }, 
              {
                label: 'Program Creek',
                href: 'https://www.programcreek.com/',
              }, 
              {
                label: 'Spring',
                href: 'https://spring.io/',
              }, 
              {
                label: 'Stackoverflow',
                href: 'https://stackoverflow.com/',
              }, 
              {
                label: 'Linux命令大全',
                href: 'https://www.linuxcool.com/',
              },
              {
                label: 'Jenkins中文',
                href: 'https://www.jenkins.io/zh/',
              },
              {
                label: 'markdown官方教程',
                href: 'https://markdown.com.cn/intro.html'
              },
              {
                label: 'Docker—从入门到实践',
                href: 'https://vuepress.mirror.docker-practice.com/'
              }
            ]
          },
        ],
      },
      // footer: {
      //   style: 'dark',
      //   links: [
      //     {
      //       title: 'Docs',
      //       items: [
      //         {
      //           label: 'Tutorial',
      //           to: '/docs/home',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'Community',
      //       items: [
      //         {
      //           label: 'Stack Overflow',
      //           href: 'https://stackoverflow.com/questions/tagged/docusaurus',
      //         },
      //         {
      //           label: 'Discord',
      //           href: 'https://discordapp.com/invite/docusaurus',
      //         },
      //         {
      //           label: 'Twitter',
      //           href: 'https://twitter.com/docusaurus',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'More',
      //       items: [
      //         {
      //           label: 'GitHub',
      //           href: 'https://github.com/facebook/docusaurus',
      //         },
      //       ],
      //     },
      //   ],
      //   copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      // },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
});
