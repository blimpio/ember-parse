import Ember from 'ember';

export default Ember.Controller.extend({
  isAuthenticated: Ember.computed.alias('session.isAuthenticated'),

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
      this.session.authenticate('user@example.com', 'abc123')
        .then((user) => {
          console.log(user);
        })
        .catch((reason) => {
          console.error(reason);
        });
    },

    logout() {
      this.session.invalidate().then(() => {
        console.log(this.session.isAuthenticated);
        console.log(this.session.sessionId);
      });
    }

  }
});
