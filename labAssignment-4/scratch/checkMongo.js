const MongoStore = require('connect-mongo');
console.log('MongoStore.MongoStore.create:', MongoStore.MongoStore ? MongoStore.MongoStore.create : 'No MongoStore.MongoStore');
console.log('MongoStore.default.create:', MongoStore.default ? MongoStore.default.create : 'No MongoStore.default');
