const { AuthorizationCode } = require('simple-oauth2');
const githubAPI = `https://github.com/login`;

module.exports = new AuthorizationCode({
  client: {
    id: process.env.GITHUB_CLIENT_ID,
    secret: process.env.GITHUB_CLIENT_SECRET,
  },
  auth: {
    tokenHost: githubAPI,
    tokenPath: `${githubAPI}/oauth/access_token`,
    authorizePath: `${githubAPI}/oauth/authorize`,
  },
});
