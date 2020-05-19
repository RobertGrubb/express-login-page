# Express Login Page

Heavily inspired by `express-password-protected` but with a few more options and flexibility.

Below is an example of the config, and how to use it in your express app.

```
const loginPage = require('express-login-page')

const config = {

  // Array of users that have access with a username and password pair.
	users: [
    {
      username: 'test',
      password: 'password'
    },
    {
      username: 'test1',
      password: 'password1'
    }
  ],

  sessionName: 'loginPage', // Optional -> default is loginCredentials

  sessionMaxAge: 60000, // 1 minute (optional -> default is 1 day)

  loginPage: `${__dirname}/loginPage.html`, // Optional

  redirectPath: '/' // Default is '/', Optional.
}

app.use(loginPage(config))
```
