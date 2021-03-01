import glob from 'glob'

// console.log(__dirname)
// const files = glob.sync("src/server#<{(||)}>#*.js")
// files.forEach(file => {
//   console.log(file)
//   require('../' + file)
// })

var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;

const html = '<div id="root"></div>'
global.document = new JSDOM(html).window.document;
global.window = document.defaultView;

global.navigator = {
  userAgent: 'node.js'
};
