module.exports = {
    pathPrefix: '/',
    siteMetadata: require('./site-metadata.json'),
    plugins: [
        `gatsby-plugin-react-helmet`,
        `gatsby-source-data`,
        `gatsby-plugin-twitter`,
        `gatsby-plugin-sitemap`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `pages`,
                path: `${__dirname}/src/pages`,
            },
        },
        {
            resolve: `gatsby-plugin-stackbit-static-sass`,
            options: {
                inputFile: `${__dirname}/src/sass/main.scss`,
                outputFile: `${__dirname}/public/assets/css/main.css`
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [{
                  resolve: `gatsby-remark-component`,
                },
                {
                  resolve: `gatsby-remark-highlight-code`,
                  options: {
                    terminal: 'carbon',
                    theme: 'material',
                  }
                },
                {
                  resolve: `gatsby-remark-embed-video`,
                  options: {
                    maxWidth: 800,
                    ratio: 1.77,
                    height: 320,
                    related: false,
                    noIframerder: true,
                  }
                }
              ],
            }
        },
        {
            resolve: `gatsby-remark-page-creator`,
            options: {
                
            }
        },
        {
            resolve: `@stackbit/gatsby-plugin-menus`,
            options: {
                sourceUrlPath: `fields.url`,
                pageContextProperty: `menus`,
            }
        },
        {
            resolve: `gatsby-plugin-feed`,
            options: {
              query: `
                {
                  site {
                    siteMetadata {
                      title
                      description
                      siteUrl
                      site_url: siteUrl
                    }
                  }
                }
              `,
              feeds: [
                {
                  serialize: ({ query: { site, allMarkdownRemark } }) => {
                    return allMarkdownRemark.edges.map(edge => {
                      return Object.assign({}, edge.node.frontmatter, {
                        description: edge.node.excerpt,
                        date: edge.node.frontmatter.date,
                        url: site.siteMetadata.siteUrl + edge.node.fields.url,
                        guid: site.siteMetadata.siteUrl + edge.node.fields.url,
                        enclosure: {url: site.siteMetadata.siteUrl + edge.node.frontmatter.thumb_img_path},
                        custom_elements: [{ "content:encoded": edge.node.html }],
                      })
                    })
                  },
                  query: `
                    {
                      allMarkdownRemark(
                        limit: 1000,
                        sort: { order: DESC, fields: [frontmatter___date] },
                        filter: {fileAbsolutePath: {regex: "/(posts)/"  }},
                      ) {
                        edges {
                          node {
                            excerpt(pruneLength: 140)
                            html
                            fields { 
                              url 
                            }
                            frontmatter {
                              title
                              date
                              thumb_img_path
                            }
                          }
                        }
                      }
                    }
                  `,
                  output: "/rss.xml",
                  title: "The (*)bility Engineer's Feed",
                },
              ],
            },
        }
    ]
};
