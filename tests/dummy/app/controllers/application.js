import Ember from 'ember';

export default Ember.Controller.extend({
  isAuthenticated: Ember.computed.alias('session.isAuthenticated'),
  username: 'user@example.com',
  password: 'abc123',
  loginError: null,

  actions: {
    createObject() {
      var thing = this.store.createRecord('thing', {
        name: 'New',
        age: 2,

        ParseACL: {
          // owner: this.get('session.content.secure.userId')
        }
      });

      thing.save();
    },

    deleteObject(object) {
      object.deleteRecord();
      object.save();
    },

    updateObject(object) {
      object.set('name', 'Updated');
      object.save();
    },

    login() {
      this.session.authenticate(this.get('username'), this.get('password'))
        .then((user) => {
          console.log('Logged in:', user.get('email'));
          this.set('loginError', null);
        })
        .catch((reason) => {
          var err = `Code ${reason.responseJSON.code}: ${reason.responseJSON.error}`;
          console.error(err);
          this.set('loginError', err);
        });
    },

    logout() {
      this.session.invalidate().then(() => {
        console.log('Logged out');
      });
    }

  }
});
