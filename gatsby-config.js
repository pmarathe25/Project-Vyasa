module.exports = {
  siteMetadata: {
    title: `Project Vyasa`,
  },
  plugins: [
    `gatsby-transformer-json`,
    `gatsby-plugin-anchor-links`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `content`,
        path: `${__dirname}/content/generated/text`,
      }
    },
  ]
}