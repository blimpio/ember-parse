import ParseAdapter from 'ember-parse/adapters/parse';
import ParseSerializer from 'ember-parse/serializers/parse';
import Session from 'ember-parse/services/session';

export function initialize(container, application) {
  application.register('adapter:-parse', ParseAdapter);
  application.register('serializer:-parse', ParseSerializer);


  container.register('service:session', Session);
  container.injection('route', 'session', 'service:session');
  container.injection('controller', 'session', 'service:session');
}

export default {
  name: 'parse-session',
  initialize: initialize,
  after: 'store'
};
