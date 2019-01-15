const FastEJS = require('./fastejs.js')

delete FastEJS.tags['<%_']
delete FastEJS.tags['<%-']
delete FastEJS.tags['<%#']
delete FastEJS.tags['<%%']
delete FastEJS.tags['%%>']
delete FastEJS.tags['_%>']

FastEJS.settings.returns = "[__out,meta]"
console.log(FastEJS.parse(`<% let meta = "apple" %> <%= "hello" %>`)); // returns [ ' hello', 'apple' ] because of the previous line

console.log(FastEJS);
