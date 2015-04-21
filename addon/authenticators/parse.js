import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';

var ParseAuthenticator = Base.extend({
  restore: function(properties) {
    var propertiesObject = Ember.Object.create(properties),
        sessionToken = propertiesObject.get('sessionToken'),
        userId = propertiesObject.get('userId'),
        adapter = this.container.lookup('adapter:application');

    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(sessionToken)) {
        adapter.set('sessionToken', sessionToken);
        adapter.set('userId', userId);
        resolve(properties);
      } else {
        reject();
      }
    });

    return promise;
  },

  authenticate: function(data) {
    var store = this.container.lookup('store:main'),
        adapter = store.adapterFor('application');

    if (data == null) {
      data = {};
    }

    var user = data.user;

    if (user) {
      adapter.set('sessionToken', user.get('sessionToken'));
      data = {
        userId: user.get('id'),
        sessionToken: user.get('sessionToken')
      };

      return Ember.RSVP.resolve(data);
    } else {
      return store.modelFor('user').login(store, data)
        .then(function(user) {
          adapter.set('sessionToken', user.get('sessionToken'));
          adapter.set('userId', user.get('id'));
          data = {
            userId: user.get('id'),
            sessionToken: user.get('sessionToken'),
            _method: 'GET'
          };
          return data;
      });
    }
  },

  invalidate: function() {
    var adapter = this.container.lookup('adapter:application');
    return new Ember.RSVP.Promise(function(resolve) {
      adapter.set('sessionToken', null);
      return resolve();
    });
  }
});

export default ParseAuthenticator;
