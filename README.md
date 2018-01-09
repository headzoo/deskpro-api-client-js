DeskPRO API JavaScript Client
=============================

Basic usage:

```js
const DeskPROClient = require('./src/DeskPROClient');

const client = new DeskPROClient('http://deskpro-dev.com');
// client.setAuthKey(1, 'dev-admin-code');
// client.setAuthToken(1, 'AWJ2BQ7WG589PQ6S862TCGY4');

client.get('/articles')
  .then((resp) => {
    console.log(resp.data);
    console.log(resp.meta);
  })
  .catch((err) => {
    console.error(err.message);
  });
```