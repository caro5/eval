var mongoose = require('mongoose');
var config = require('config');

mongoose.connect(config.get('mongo'));

describe('Eval', function () {

  // beforeEach
  require('./integrations');
  // require('./models');
  // require('./controllers');

});