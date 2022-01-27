module.exports = {
  siteMetadata: {
    title: `Project Vyasa`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    `gatsby-transformer-json`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      }
    },
  ]
}