module.exports = {
  siteMetadata: {
    title: `Project Vyasa`,
    titleTemplate: `%s | Project Vyasa`,
    url: "https://projectvyasadevgatsby.gtsb.io",
    description: "A high quality Sanskrit-English reader for the Mahabharata"
  },
  plugins: [
    `gatsby-transformer-json`,
    `gatsby-plugin-gatsby-cloud`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `content`,
        path: `${__dirname}/content/generated/text`,
      }
    },
  ]
}