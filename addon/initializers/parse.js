import ParseAdapter from 'ember-parse/adapters/parse';
import ParseSerializer from 'ember-parse/serializers/parse';

export function initialize(container, application) {
  application.register('adapter:-parse', ParseAdapter);
  application.register('serializer:-parse', ParseSerializer);
}

export default {
  name: 'parse-session',
  initialize: initialize,
  after: 'store'
};
