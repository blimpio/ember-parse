import Ember from 'ember';

export default Ember.Service.extend({
  isAuthenticated: false,
  sessionId: null,
  sessionStoreKey: 'ember-parse:session',

  init() {
    var key = this.get('sessionStoreKey');
    this.sessionStore.get(key).then((session) => {
      if (session) {
        this.setProperties({
          isAuthenticated: true,
          sessionId: session
        });
      }
    });
  },

  authenticate(username, password) {
    var service = this,
        key = this.get('sessionStoreKey');

    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      // TODO: call login
      service.set('isAuthenticated', true);
      service.set('sessionId', '<fakeSessionId: xyzz123>');
      service.sessionStore.save(key, '<fakeSessionId: xyzz123>');
      resolve();
    });
    return promise;
  },

  invalidate() {
    var key = this.get('sessionStoreKey');
    this.set('isAuthenticated', false);
    this.set('sessionId', null);
    return this.sessionStore.destroy(key);
  },

  sessionStore: {
    save(key, sessionId) {
      return new Ember.RSVP.Promise(function(resolve) {
        resolve(localStorage.setItem(key, sessionId));
      });
    },

    get(key) {
      return new Ember.RSVP.Promise(function(resolve) {
        resolve(localStorage.getItem(key));
      });
    },

    destroy(key) {
      return new Ember.RSVP.Promise(function(resolve) {
        resolve(localStorage.removeItem(key));
      });
    }
  }
});
