import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-parse/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.store.find('user');
  },

  actions: {
    addAsFriend() {
    }
  }
});



