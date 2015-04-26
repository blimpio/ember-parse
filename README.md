# Parse for Ember.js

This addon has all you need to use [Parse](https://parse.com/) in your Ember.js application. It includes an adapter and serializer to integrate with ember-data and a session service to provide authentiction.

## WORK-IN-PROGRESS
This is still a work in progress.

#### Tests
- [ ] Test session service is injected in routes
- [ ] Test session service is injected in controllers
- [ ] Test session service is injected in components
- [ ] Test session service can register new user
- [ ] Test session service can login user
- [ ] Test session service can request password reset for user
- [ ] Test session service sets sessionToken in adapter
- [ ] Test get single record
- [ ] Test get many records
- [ ] Test create record
- [ ] Test update record
- [ ] Test delete record
- [ ] Test get belongs-to relation
- [ ] Test create belongs-to relation
- [ ] Test update belongs-to relation
- [ ] Test delete belongs-to relation
- [ ] Test get many-to-many relation
- [ ] Test create many-to-many relation
- [ ] Test update many-to-many relation
- [ ] Test delete many-to-many relation

#### Features
- [ ] ApplicationRouteMixin
- [ ] AuthenticatedRouteMixin
- [ ] Blueprint to generate application files


## Installation

* `ember install:addon ember-parse`
* `ember generate ember-parse`


## Development

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
