DeskPRO API Node Client
=======================

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

Posting values:

```js
const DeskPROClient = require('./src/DeskPROClient');

const client = new DeskPROClient('http://deskpro-dev.com');
client.setAuthKey(1, 'dev-admin-code');

const body = {
  title: 'This is a title',
  content: 'This is the content',
  content_input_type: 'rte',
  status: 'published'
};

client.post('/articles', body)
  .then((resp) => {
    console.log(resp.data);
  })
  .catch((err) => {
    console.error(err.message);
  });
```

Uploading files:

```js
const DeskPROClient = require('./src/DeskPROClient');
const FormData = require('form-data');
const fs = require('fs');

const client = new DeskPROClient('http://deskpro-dev.com');
client.setAuthKey(1, 'dev-admin-code');

// Create a form with the file data to upload.
const fileStream = fs.createReadStream('test.gif');
const form = new FormData();
form.append('file', fileStream, 'test.gif');

// Create body data containing the property 'multipart', which
// contains the form data.
const body = {
  multipart: form
};

client.post('/blobs/temp', body)
  .then((resp) => {
    console.log(resp.data);
  })
  .catch((err) => {
    console.error(err.message);
  });
```

Setting default headers:

```js
const DeskPROClient = require('./src/DeskPROClient');

const client = new DeskPROClient('http://deskpro-dev.com');
client.setAuthKey(1, 'dev-admin-code');
client.setDefaultHeaders({
  'X-Custom-Value': 'foo'
});

client.get('/articles')
  .then((resp) => {
    console.log(resp.data);
  })
  .catch((err) => {
    console.error(err.message);
  });
```

Logging:

```js
const DeskPROClient = require('./src/DeskPROClient');

const client = new DeskPROClient('http://deskpro-dev.com');
client.setAuthKey(1, 'dev-admin-code');
client.setLogger(console.log);

client.get('/articles')
  .then((resp) => {
    console.log(resp.data);
  })
  .catch((err) => {
    console.error(err.message);
  });
```

Customizing the Axios configuration:

```js
const DeskPROClient = require('./src/DeskPROClient');

const client = new DeskPROClient('http://deskpro-dev.com');
client.setAuthKey(1, 'dev-admin-code');

// @see https://github.com/axios/axios#global-axios-defaults
client.getAxios().defaults.timeout = 2500;

client.get('/articles')
  .then((resp) => {
    console.log(resp.data);
  })
  .catch((err) => {
    console.error(err.message);
  });
```
