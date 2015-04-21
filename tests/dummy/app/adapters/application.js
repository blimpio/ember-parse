import ParseAdapter from 'ember-parse/adapters/parse';
import ENV from '../config/environment';

export default ParseAdapter.extend({
  PARSE_APPLICATION_ID: ENV.emberParse.PARSE_APPLICATION_ID,
  PARSE_JAVASCRIPT_KEY: ENV.emberParse.PARSE_JAVASCRIPT_KEY,
});
