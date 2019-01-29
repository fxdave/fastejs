# FastEJS
Faster, better implementation for the known ejs package.
It looks like ejs, so syntax highlighting will work.
It's about half the the execution time of the original ejs. 
But it can be faster depending on the template size, and the config.

PLEASE DO NOT USE IN HIGH RISK SYSTEMS (but if you want so, why JS? Anyway, pre-escaping the input data can improve the security).

## Requirements
EcmaScript 6 (The new node.js supports it without babel)

## Tags
| tag | description |
| --- | ----------- |
| '<% ' | 'Scriptlet' tag, for control-flow, no output |
| '<%_' | ‘Whitespace Slurping’ Scriptlet tag, strips all whitespace before it |
| '<%=' | Outputs the value into the template (HTML escaped) |
| '<%-' | Outputs the unescaped value into the template |
| '<%#' | Comment tag, no execution, no output |
| '<%%' | Outputs a literal '<%' |
| '%%>' | Outputs a literal '%>' |
| ' %>'  | Plain ending tag |
| '_%>' | ‘Whitespace Slurping’ ending tag, removes all whitespace after it |

## Tuning
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

## Can I use "include" ?
Of course, the data object can have functions too. It is up to you how you implement your logic.
I suggest you to wrap this package inside a custom package you build, like a decorator.

## Can I add tags?
Yes you can! `FastEJS.tags` is an exported object, you can modify it freely.
Here it is the default:

```javascript
const FastEJS = require('fastejs')
FastEJS.tags = {
    "begin": ".replace(/\\n/g, '\\uffff')", // new lines => \uffff  (\uffff is not a used character so it is perfect for this)
    "<%_": ".replace(/(\\s|\\uffff)*<%_/g, '<%')", // <%_ => <%  (removes all whitespace before it and replaces with <% for later use)
    "_%>": ".replace(/_%>(\\s|\\uffff)*/g, '%>')", // _%> => %>  (removes all whitespace after it and replaces with %> for later use)
    "<%=": ".replace(/<%=([^%]+) %>/g, '`; __out += __escapeHTML($1) + `')", // <%=SOME_JS %> escaped output
    "<%-": ".replace(/<%-([^%]+) %>/g, '`; __out += $1 + `')", //  <%-SOME_JS %> non-escaped output
    "<%#": ".replace(/<%#([^%]+) %>/g, '')", //  <%#SOME_JS %> comment
    "<% ": ".replace(/<%(\\s|\\uffff)/g, '`; ')", //  <%  script open tag
    " %>": ".replace(/(\\s|\\uffff)%>/g, '; __out +=`')", // %> script close tag
    "<%%": ".replace(/<%%/g, '<%')", // <%% => <%
    "%%>": ".replace(/%%>/g, '%>')", // %%> => %>
    "end": ".replace(/\\uffff/g, '\\n')" // \uffff => new lines
}
```

## Can I capture variables after execution?
There is an exported `settings` object :

```javascript
const FastEJS = require('fastejs')
FastEJS.settings = {
    returns: "__out"
}
```
So you can change the `returns` to any other javascript expression like `[__out,var1,var2]`.  
The `__out` variable is a builtin variable for the rendered template.
