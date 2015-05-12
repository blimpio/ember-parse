import Ember from 'ember';

export default Ember.Mixin.create({
  beforeModel() {
    if (!this.get('session.isAuthenticated')) {
      var config = this.container.lookupFactory('config:environment');
      this.transitionTo(config['ember-parse'].session.loginRoute);
    }
  }
});
