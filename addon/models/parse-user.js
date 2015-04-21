import DS from 'ember-data';

var User = DS.Model.extend({
  username: DS.attr('string'),
  password: DS.attr('password'),
  email: DS.attr('string'),
  emailVerified: DS.attr('boolean'),
  sessionToken: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});

export default User;
