/*
 * Some portions extracted from:
 * Parse JavaScript SDK
 * Version: 1.4.2
 */

import Ember from 'ember';
import DS from 'ember-data';

var get = Ember.get,
    forEach = Ember.ArrayPolyfills.forEach;


export default DS.RESTAdapter.extend({
  host: 'https://api.parse.com',
  namespace: '1',
  classesPath: 'classes',
  parseClientVersion: 'js1.4.2',

  init() {
    this._super();

    this.set('parseClientVersion', this.parseVersion);
    this.set('applicationId', this.get('PARSE_APPLICATION_ID'));
    this.set('javascriptKey', this.get('PARSE_JAVASCRIPT_KEY'));
    this.set('installationId', this._getInstallationId());
    this.set('sessionToken', null);
    this.set('userId', null);

    /*
     * avoid pre-flight.
     * Parse._ajax
     */
    this.set('headers', {'Content-Type': 'text/plain'});
  },

  _getInstallationId() {
    /*
     * Parse._getInstallationId
     */
    var hexOctet = function() {
      return (
        Math.floor((1+Math.random())*0x10000).toString(16).substring(1)
      );
    };

    return (
      hexOctet() + hexOctet() + "-" +
      hexOctet() + "-" +
      hexOctet() + "-" +
      hexOctet() + "-" +
      hexOctet() + hexOctet() + hexOctet());
  },

  ajaxOptions(url, type, options) {
    var hash = options || {};
    hash.url = url;
    hash.type = type;
    hash.dataType = 'json';
    hash.context = this;

    if ((hash.data && type !== 'GET')) {
      hash.contentType = 'application/json; charset=utf-8';

      // Parse auth stuff
      hash.data._ClientVersion = this.get('clientVersion');
      hash.data._ApplicationId = this.get('applicationId');
      hash.data._JavaScriptKey = this.get('javascriptKey');
      hash.data._InstallationId = this.get('installationId');

      var _sessionToken = this.get('sessionToken');
      if (_sessionToken) {
        hash.data._SessionToken = _sessionToken;
      }

      hash.data = JSON.stringify(hash.data);
    }

    var headers = get(this, 'headers');
    if (headers !== undefined) {
      hash.beforeSend = function (xhr) {
        forEach.call(Ember.keys(headers), function(key) {
          xhr.setRequestHeader(key, headers[key]);
        });
      };
    }

    return hash;
  },

  ajaxError: function(jqXHR, responseText, errorThrown) {
    if (jqXHR.responseJSON.error === 'invalid session token') {
      // If user is not authenticated invalidate session
      this.container.lookup('simple-auth-session:main').invalidate();
    }

    return this._super(jqXHR, responseText, errorThrown);
  },

  pathForType(type) {
    if ('user' === type) {
      return 'users';

    } else if ('login' === type) {
      return type;

    } else if ('requestPasswordReset' === type) {
      return type;

    } else {
      return this.classesPath + '/' + this.parsePathForType(type);
    }
  },

  // Using TitleStyle is recommended by Parse
  parsePathForType(type) {
    return Ember.String.capitalize(Ember.String.camelize(type));
  },

  parseClassName: function (key) {
    return Ember.String.capitalize(key);
  },

  /**
  * Because Parse doesn't return a full set of properties on the
  * responses to updates, we want to perform a merge of the response
  * properties onto existing data so that the record maintains
  * latest data.
  */
  createRecord(store, type, record) {
    var serializer = store.serializerFor(type.typeKey),
      data = {},
      adapter = this,
      ParseACL = record.record.ParseACL;

    if (ParseACL && ParseACL.owner) {
      data.ACL = {
        [ParseACL.owner]: {
          read: true,
          write: true
        }
      };
    }

    serializer.serializeIntoHash(data, type, record, {includeId: true});

    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      adapter.ajax(adapter.buildURL(type.typeKey), 'POST', {data: data})
        .then(function(json) {
          var completed = Ember.merge(data, json);
          resolve(completed);
        }, function(reason) {
          var err = `Code ${reason.responseJSON.code}: ${reason.responseJSON.error}`;
          reject(new Error(err));
        });
    });

    return promise;
  },

  /**
  * Because Parse doesn't return a full set of properties on the
  * responses to updates, we want to perform a merge of the response
  * properties onto existing data so that the record maintains
  * latest data.
  */
  updateRecord(store, type, record) {
    var serializer = store.serializerFor(type.typeKey),
      id = record.id,
      sendDeletes = false,
      deleteds = {},
      data = {},
      adapter = this;

    serializer.serializeIntoHash(data, type, record);

    type.eachRelationship(function(key) {
      if (data[key] && data[key].deleteds) {
        deleteds[key] = data[key].deleteds;
        delete data[key].deleteds;
        sendDeletes = true;
      }
    });

    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      if (sendDeletes) {
        adapter.ajax(adapter.buildURL(type.typeKey, id), 'PUT', {data: deleteds})
          .then(function() {
            adapter.ajax(adapter.buildURL(type.typeKey, id), 'PUT', {data: data})
              .then(function(updates) {
                // This is the essential bit - merge response data onto existing data.
                resolve(Ember.merge(data, updates));
              }, function(reason) {
                reject('Failed to save parent in relation: ' + reason.response.JSON);
              });
          });
      } else {
        adapter.ajax(adapter.buildURL(type.typeKey, id), 'PUT', {data: data})
          .then(function(json) {
            // This is the essential bit - merge response data onto existing data.
            resolve( Ember.merge(data, json));
          }, function(reason) {
            reject(reason.responseJSON);
          });
      }
    });

    return promise;
  },

  deleteRecord: function(store, type, snapshot) {
    var id = snapshot.id,
        data = {_method: 'DELETE'};

    return this.ajax(this.buildURL(type.typeKey, id, snapshot), 'POST', {data: data});
  },

  findAll(store, type, sinceToken) {
    var query = {};

    if (sinceToken) {
      query.since = sinceToken;
    }

    query.where = {};
    query._method = 'GET';

    return this.ajax(this.buildURL(type.typeKey), 'POST', {data: query});
  },

  /**
  * Implementation of a hasMany that provides a Relation query for Parse
  * objects.
  */
  findHasMany(store, record, relatedInfo) {
    var query = {
      where: {
        '$realtedTo': {
          'object': {
            '__type': 'Pointer',
            'className': this.parseClassName(record.typeKey),
            'objectId': this.record.id
          },
          key: relatedInfo.key
        }
      }
    };

    // the request is to the related type and not the type for the record.
    // the query is where there is a pointer to this record.
    return this.ajax(
              this.buildURL(relatedInfo.type.typeKey), 'GET', {data: query});
  },

  /**
  * Implementation of findQuery that automatically wraps query in a
  * JSON string.
  *
  * @example
  *     this.store.find('comment', {
  *       where: {
  *         post: {
  *             "__type":  "Pointer",
  *             "className": "Post",
  *             "objectId": post.get('id')
  *         }
  *       }
  *     });
  */
  findQuery(store, type, query) {
    if (query.where && 'string' !== Ember.typeOf(query.where)) {
      query.where = JSON.stringify(query.where);
    }

    // Pass to _super()
    return this._super(store, type, query);
  }
});
