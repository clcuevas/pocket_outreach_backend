'use strict';

const router = require('express').Router();
const serveApiDocs = require('./apiDoc/serveApiDocs');
const serveJsDocs = require('./jsDoc/serveJsDocs');

router.get('/', serveApiDocs);
router.get('/docs', serveJsDocs);

module.exports = exports = router;
