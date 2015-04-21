import Ember from 'ember';

export default Ember.Controller.extend({
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
    }

  }
});
