import Ember from 'ember';

export default Ember.Controller.extend({
  isAuthenticated: Ember.computed.alias('session.isAuthenticated'),
  username: 'user@example.com',
  password: 'abc123',
  loginError: null,

  actions: {
    createObject() {
      var friend1 = this.store.createRecord('friend', {
        name: 'Juanito',
      });

      var friend2 = this.store.createRecord('friend', {
        name: 'Paco'
      });

      var car1 = this.store.createRecord('car', {
        name: 'Toyota'
      });

      var car2 = this.store.createRecord('car', {
        name: 'Honda'
      });

      var cat = this.store.createRecord('category', {
        name: 'Category',
        ParseACL: {
          owner: this.get('session.userId'),
          permissions: {
            read: true,
            write: true
          }
        }
      });

      var thingObj = {
        name: 'New',
        age: 2
      };

      if (this.get('session.userId')) {
        thingObj.ParseACL = {
          owner: this.get('session.userId')
        };
      }

      var thing = this.store.createRecord('thing', thingObj);

      friend1.save().then(()=> {
        friend2.save().then(()=> {
          car1.save().then(()=> {
            car2.save().then(()=> {
              cat.save().then(()=> {
                thing.get('friends').pushObjects([friend1, friend2]);
                thing.get('cars').pushObjects([car1]);
                thing.set('category', cat);
                thing.save();
              });
            });
          });
        });
      });
    },

    removeFriend(thing, friend) {
      thing.get('friends').removeObject(friend);
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
      this.get('session').authenticate(this.get('username'), this.get('password'))
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
      this.get('session').invalidate().then(() => {
        console.log('Logged out');
        this.send('reloadModel');
      });
    },

    signup() {
      this.get('session').signup({
        username: this.get('username'),
        password: this.get('password'),
        email: this.get('username')
      }).then((user) => {
        console.log(user);
        this.send('login');
      });
    },

    resetPassword() {
      this.get('session').requestPasswordReset(this.get('username'))
        .then(function(response) {
          console.log(response);
       });
    }

  }
});
