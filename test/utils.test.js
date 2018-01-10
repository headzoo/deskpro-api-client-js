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
const utils = require('../src/utils');

describe('utils', () => {
  describe('buildQueryString', () => {
    it('builds empty params', () => {
      const actual = utils.buildQueryString({});
      expect(actual).to.equal('');
    });
    
    it('builds all params', () => {
      const params = {
        limit: 5,
        offset: 100,
        group: 'parent id'
      };
      const actual = utils.buildQueryString(params);
  
      expect(actual).to.equal('limit=5&offset=100&group=parent%20id');
    });
  });
  
  describe('interpolateURL', () => {
    it('with no params', () => {
      const actual = utils.interpolateURL('/articles', {});
      expect(actual).to.equal('/articles');
    });
  
    it('query params', () => {
      const params = {
        limit: 5,
        offset: 100
      };
      const actual = utils.interpolateURL('/articles', params);
    
      expect(actual).to.equal('/articles?limit=5&offset=100');
    });
  
    it('placeholder params', () => {
      const params = {
        id: 5,
        parentId: 100
      };
      const actual = utils.interpolateURL('/articles/{parentId}/{id}', params);
    
      expect(actual).to.equal('/articles/100/5');
    });
  
    it('all params', () => {
      const params = {
        id: 5,
        parentId: 101,
        limit: 25,
        offset: 100
      };
      const actual = utils.interpolateURL('/articles/{parentId}/{id}', params);
    
      expect(actual).to.equal('/articles/101/5?limit=25&offset=100');
    });
  });
});