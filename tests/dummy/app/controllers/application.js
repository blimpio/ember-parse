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
          owner: this.get('session.userId')
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
          this.send('reloadModel');
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
        this.send('reloadModel');
      });
    },

    signup() {
      this.session.signup({
        username: this.get('username'),
        password: this.get('password'),
        email: this.get('username')
      }).then((user) => {
        console.log(user);
        this.send('login');
      });
    },

    resetPassword() {
      this.session.requestPasswordReset(this.get('username'))
        .then(function(response) {
          console.log(response);
       });
    }

  }
});
