# FastEJS
Faster, better implementation for the known ejs package.
It looks like ejs, so syntax highlighting will work.

## Tags
| tag | description |
| --- | ----------- |
| `<% ` | 'Scriptlet' tag, for control-flow, no output |
| `<%_` | ‘Whitespace Slurping’ Scriptlet tag, strips all whitespace before it |
| `<%=` | Outputs the value into the template (HTML escaped) |
| `<%-` | Outputs the unescaped value into the template |
| `<%#` | Comment tag, no execution, no output |
| `<%%` | Outputs a literal '<%' |
| `%%>` | Outputs a literal '%>' |
| ` %>`  | Plain ending tag |
| `_%>` | ‘Whitespace Slurping’ ending tag, removes all whitespace after it |

# Tuning
You can reach faster execution speed if you turn off features.

```javascript
const FastEJS = require('fastejs')

delete FastEJS.tags['<% ']
delete FastEJS.tags['<%_']
delete FastEJS.tags['<%-']
delete FastEJS.tags['<%#']
delete FastEJS.tags['<%%']
delete FastEJS.tags['%%>']
delete FastEJS.tags[' %>']
delete FastEJS.tags['_%>']

FastEJS.parse(`<%= "hello world" %>`)
```