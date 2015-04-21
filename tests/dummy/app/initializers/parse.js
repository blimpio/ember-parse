import Adapter from 'ember-parse/adapters/parse';
// import Authorizer from 'ember-parse-adapter-2/authorizers/parse';
// import Authenticator from 'ember-parse-adapter-2/authenticators/parse';

export function initialize(container, application) {
  Adapter.reopen({
    PARSE_APPLICATION_ID: application.get('PARSE_APPLICATION_ID'),
    PARSE_JAVASCRIPT_KEY: application.get('PARSE_JAVASCRIPT_KEY')
  });

  // container.register('authorizers:parse', Authorizer);
  // container.register('authenticators:parse', Authenticator);
}

export default {
  name: 'parse',
  initialize: initialize
};
