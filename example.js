const FastEJS = require('./fastejs.js')

delete FastEJS.tags['<% ']
delete FastEJS.tags['<%_']
delete FastEJS.tags['<%-']
delete FastEJS.tags['<%#']
delete FastEJS.tags['<%%']
delete FastEJS.tags['%%>']
delete FastEJS.tags[' %>']
delete FastEJS.tags['_%>']

console.log(FastEJS.parse(`<%= "hello world" %>`));

console.log(FastEJS);
