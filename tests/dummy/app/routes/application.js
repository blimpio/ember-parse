import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.find('thing');
  },

  actions: {
    reloadModel() {
      this.store.unloadAll('thing');
      this.refresh();
    }
  }
});
