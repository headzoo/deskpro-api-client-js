const expect = require('chai').expect;
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const DeskPROClient = require('../src/DeskPROClient');

describe('DeskPROClient', () => {
  let mock   = null;
  let client = null;
  
  beforeEach(() => {
    mock   = new MockAdapter(axios);
    client = new DeskPROClient('https://deskpro-dev.com', axios);
  });
  
  it('get', () => {
    const body = {
      data: [
        {
          id: 1,
          title: 'Exercitationem illo quod et provident'
        }
      ],
      meta: {
        count: 1
      },
      linked: {}
    };
    mock.onGet('/articles').reply(200, body);
    
    return client.get('/articles')
      .then((resp) => {
        expect(resp.data[0].id).to.equal(body.data[0].id);
        expect(resp.meta.count).to.equal(body.meta.count);
      });
  });
  
  it('post', () => {
    const body = {
      id: 1,
      title: 'Exercitationem illo quod et provident'
    };
    
    const postResp = {
      data: [
        body
      ],
      meta: {
        count: 1
      },
      linked: {}
    };
    mock.onPost('/articles').reply(200, postResp);
  
    return client.post('/articles', body)
      .then((resp) => {
        expect(resp.data[0].id).to.equal(body.id);
      });
  });
  
  it('put', () => {
    const body = {
      id: 1,
      title: 'Exercitationem illo quod et provident'
    };
    
    const postResp = {
      data: [
        body
      ],
      meta: {
        count: 1
      },
      linked: {}
    };
    mock.onPut('/articles').reply(200, postResp);
    
    return client.put('/articles', body)
      .then((resp) => {
        expect(resp.data[0].id).to.equal(body.id);
      });
  });
  
  it('delete', () => {
    mock.onDelete('/articles/1').reply(200, {});
    
    return client.del('/articles/1')
      .then((resp) => {
        expect(resp).to.eql({});
      });
  });
  
  it('catches error', () => {
    const resp = {
      status: 500,
      message: 'server error'
    };
    mock.onGet('/articles').reply(500, resp);
    
    return client.get('/articles')
      .catch((err) => {
        expect(err).to.eql(resp);
      });
  });
});