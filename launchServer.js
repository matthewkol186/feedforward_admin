var launcher = require('simple-autoreload-server');

var server = launcher({
  port: 8008,
  path: './',
  listDirectory: false,
  watch:  "*.{png,js,html,json,swf}",
  reload: "{*.json,static.swf}",
  recursive: true,
});
