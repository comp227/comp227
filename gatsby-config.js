const IS_DEV = process.env.NODE_ENV === 'development';

const createSearchConfig = (indexName, language) => {
  return {
    resolve: 'gatsby-plugin-local-search',
    options: {
      name: indexName,
      engine: 'flexsearch',
      engineOptions: 'speed',
      query: `
        {
          allMarkdownRemark(filter: {frontmatter: {lang: {eq: "${language}"}}}) {
            nodes {
              frontmatter {
                lang
                letter
                part
              }
              id
              rawMarkdownBody
            }
          }
        }
    `,
      ref: 'id',
      index: ['body'],
      store: ['id', 'part', 'letter', 'lang'],
      normalizer: ({ data }) => {
        return IS_DEV
          ? []
          : data.allMarkdownRemark.nodes.map((node) => ({
              id: node.id,
              part: node.frontmatter.part,
              letter: node.frontmatter.letter,
              lang: node.frontmatter.lang,
              body: node.rawMarkdownBody,
            }));
      },
    },
  };
};

const plugins = [
  createSearchConfig('english', 'en'),
  {
    resolve: `gatsby-plugin-sitemap`,
  },
  {
    resolve: 'gatsby-plugin-i18n',
    options: {
      langKeyDefault: 'en',
      langKeyForNull: 'en',
      prefixDefault: false,
      useLangKeyLayout: false,
    },
  },
  'gatsby-plugin-react-helmet',
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `images`,
      path: `${__dirname}/src/images`,
    },
  },
  'gatsby-transformer-sharp',
  'gatsby-plugin-sharp',
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: 'gatsby-starter-default',
      short_name: 'starter',
      start_url: '/',
      background_color: '#e1e1e1',
      theme_color: '#e1e1e1',
      display: 'minimal-ui',
      icon: 'src/images/favicon.png',
    },
  },
  'gatsby-plugin-remove-serviceworker',
  'gatsby-plugin-sass',
  `gatsby-transformer-json`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `src`,
      path: `${__dirname}/src/content/`,
      ignore: [`${__dirname}/src/content/pages/*`],
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/src/content`,
      name: 'markdown-pages',
      ignore: [`${__dirname}/src/content/pages/*`],
    },
  },
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        'gatsby-remark-unwrap-images',
        'gatsby-remark-picture',
        {
          resolve: `gatsby-remark-prismjs`,
          options: {
            classPrefix: 'language-',
            inlineCodeMarker: null,
            aliases: {},
            showLineNumbers: false,
            noInlineHighlight: false,
          },
        },
      ],
    },
  },
  {
    resolve: `gatsby-plugin-google-gtag`,
    options: {
      trackingIds: [
        'G-47G19EZV14',
      ],
      pluginConfig: {
        head: true,
        anonymize_ip: true,
      },
    },
  },
  {
    resolve: `gatsby-plugin-canonical-urls`,
    options: {
      siteUrl: `https://comp227.djosv.com`,
    },
  },
];

module.exports = {
  siteMetadata: {
    title: 'COMP 277',
    description: '',
    author: 'Courtesy of Houston Inc. Consulting oy',
    siteUrl: 'https://onzfonz.github.io/comp227',
  },
  plugins,
};
