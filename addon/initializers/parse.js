import ParseSession from '../services/session';

import Adapter from '../adapters/parse';
import Serializer from '../serializers/parse';
import DateTransform from '../transforms/date';
import FileTransform from '../transforms/file';
import GeopointTransform from '../transforms/geopoint';
import ParseUser from '../models/parse-user';

export function initialize(container) {
  container.register('service:session', ParseSession);
  container.injection('route', 'session', 'service:session');
  container.injection('controller', 'session', 'service:session');
  container.injection('component', 'session', 'service:session');

  container.register('adapter:-parse', Adapter);
  container.register('serializer:-parse', Serializer);
  container.register('transform:parse-date', DateTransform);
  container.register('transform:parse-file', FileTransform);
  container.register('transform:parse-geo-point', GeopointTransform);
  container.register('model:parse-user', ParseUser);

}

export default {
  before: 'store',
  name: 'parse',
  initialize: initialize
};
