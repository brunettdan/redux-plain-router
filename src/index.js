const actions = require('./actions')
    , reducer = require('./reducer')
    , middleware = require('./middleware')
    , utils = require('./utils');

const NAME = reducer.NAME
    , start = utils.start
    , generate = utils.generate
    , createRoutes = utils.createRoutes;

module.exports = { actions, reducer, middleware, NAME, start, generate, createRoutes }