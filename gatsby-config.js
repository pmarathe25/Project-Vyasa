module.exports = {
  siteMetadata: {
    title: `Project Vyasa`,
  },
  plugins: [
    `gatsby-transformer-json`,
    `gatsby-plugin-anchor-links`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `content`,
        path: `${__dirname}/content/generated/text`,
      }
    },
  ]
}