import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({

  primaryKey: 'objectId',

  extractArray(store, primaryType, payload) {
    var namespacedPayload = {};
    namespacedPayload[Ember.String.pluralize(primaryType.typeKey)] = payload.results;

    return this._super(store, primaryType, namespacedPayload);
  },

  extractSingle(store, primaryType, payload, recordId) {
    var namespacedPayload = {};
    namespacedPayload[primaryType.typeKey] = payload; // this.normalize(primaryType, payload);

    return this._super(store, primaryType, namespacedPayload, recordId);
  },

  typeForRoot(key) {
    return Ember.String.dasherize(Ember.String.singularize(key));
  },

  /**
  * Because Parse only returns the updatedAt/createdAt values on updates
  * we have to intercept it here to assure that the adapter knows which
  * record ID we are dealing with (using the primaryKey).
  */
  extract(store, type, payload, id, requestType) {
    if (id !== null && ('updateRecord' === requestType || 'deleteRecord' === requestType)) {
      payload[this.get('primaryKey')] = id;
    }

    return this._super(store, type, payload, id, requestType);
  },

  /**
  * Extracts count from the payload so that you can get the total number
  * of records in Parse if you're using skip and limit.
  */
  extractMeta(store, type, payload) {
    if (payload && payload.count) {
      store.metaForType(type, {count: payload.count});
      delete payload.count;
    }
  },

  /**
  * Special handling for the Date objects inside the properties of
  * Parse responses.
  */
  normalizeAttributes(type, hash) {
    type.eachAttribute(function(key, meta) {
      if ('date' === meta.type && 'object' === Ember.typeOf(hash[key]) && hash[key].iso) {
        hash[key] = hash[key].iso; //new Date(hash[key].iso).toISOString();
      }
    });

    this._super(type, hash);
  },

  normalizeRelationships: function(type, hash) {
    if (this.keyForRelationship) {
      type.eachRelationship(function(key, relationship) {
        if (hash[key] && 'belongsTo' === relationship.kind) {
          hash[key] = hash[key].objectId;
        }

        /*
         * TODO: Find a better way to do this
         * Here we set the links property to a serialized version
         * of key and className. This info will be passed to
         * adapter.findHasMany where we can deserialize to create
         * the needed Parse query.
         */
        if (hash[key] && 'hasMany' === relationship.kind) {
          if (!hash[key].__op && hash[key].__op !== 'AddRelation') {
            if (!hash.links) {
              hash.links = {};
            }
            hash.links[key] = JSON.stringify({
              key: key,
              className: hash[key].className
            });
          }

          delete hash[key].__type;
          delete hash[key].className;
          hash[key] = [];
        }
      }, this);
    }
  },

  serializeAttribute(record, json, key, attribute) {
    // These are Parse reserved properties and we won't send them.
    if ('createdAt' === key ||
        'updatedAt' === key ||
        'emailVerified' === key ||
        'sessionToken' === key
    ) {
      delete json[key];

    } else {
      this._super(record, json, key, attribute);
    }
  },

  serializeBelongsTo(record, json, relationship) {
    var key = relationship.key,
        belongsTo = record.belongsTo(key);

    if (belongsTo) {
      // @TODO: Perhaps this is working around a bug in Ember-Data? Why should
      // promises be returned here.
      if (belongsTo instanceof DS.PromiseObject) {
        if (!belongsTo.get('isFulfilled')) {
          throw new Error('belongsTo values *must* be fulfilled before attempting to serialize them');
        }

        belongsTo = belongsTo.get('content');
      }

      json[key] = {
        '__type': 'Pointer',
        'className': this.parseClassName(belongsTo.type.typeKey),
        'objectId': belongsTo.id
      };

    }
  },

  serializeIntoHash: function(hash, type, snapshot, options) {
    var ParseACL = snapshot.record.get('ParseACL');

    // Add ACL
    if (ParseACL) {
      var policy = {}

      if (ParseACL.owner) {
        policy[ParseACL.owner] = {}
      }

      if (ParseACL.permissions) {
        policy[ParseACL.owner] = ParseACL.permissions;
      } else {
        policy[ParseACL.owner] = {
          read: true,
          write: true
        }
      }
      hash.ACL = policy;
    }

    Ember.merge(hash, this.serialize(snapshot, options));
  },

  parseClassName(key) {
    if ('User' === key) {
      return '_User';

    } else {
      return Ember.String.capitalize(Ember.String.camelize(key));
    }
  },

  serializeHasMany(snapshot, json, relationship) {
    var key = relationship.key;

    if (this._canSerialize(key)) {
      var payloadKey;

      json[key] = {'objects': []};

      // if provided, use the mapping provided by `attrs` in
      // the serializer
      payloadKey = this._getMappedKey(key);
      if (payloadKey === key && this.keyForRelationship) {
        payloadKey = this.keyForRelationship(key, "hasMany");
      }

      var relationshipType = snapshot.type.determineRelationshipType(relationship);

      if (relationshipType === 'manyToNone' || relationshipType === 'manyToMany') {
        var objects = [];
        snapshot.hasMany(key).forEach((item) => {
          objects.push({
            __type: 'Pointer',
            className: this.parseClassName(item.typeKey),
            objectId: item.id
          });
        });

        json[payloadKey] = {
          __op: 'AddRelation',
          objects: objects,
          className: snapshot.type.typeKey
        };

        // TODO support for polymorphic manyToNone and manyToMany relationships
      }
    }
  },

});
