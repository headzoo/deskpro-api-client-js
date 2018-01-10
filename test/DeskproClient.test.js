/*
 * DeskPRO (r) has been developed by DeskPRO Ltd. https://www.deskpro.com/
 * a British company located in London, England.
 *
 * All source code and content Copyright (c) 2017, DeskPRO Ltd.
 *
 * The license agreement under which this software is released
 * can be found at https://www.deskpro.com/eula/
 *
 * By using this software, you acknowledge having read the license
 * and agree to be bound thereby.
 *
 * Please note that DeskPRO is not free software. We release the full
 * source code for our software because we trust our users to pay us for
 * the huge investment in time and energy that has gone into both creating
 * this software and supporting our customers. By providing the source code
 * we preserve our customers' ability to modify, audit and learn from our
 * work. We have been developing DeskPRO since 2001, please help us make it
 * another decade.
 *
 * Like the work you see? Think you could make it better? We are always
 * looking for great developers to join us: http://www.deskpro.com/jobs/
 *
 * ~ Thanks, Everyone at Team DeskPRO
 */

const expect = require('chai').expect;
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const DeskproClient = require('../src/DeskproClient');

describe('DeskproClient', () => {
  let mock   = null;
  let client = null;
  
  beforeEach(() => {
    mock   = new MockAdapter(axios);
    client = new DeskproClient('https://deskpro-dev.com', axios);
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