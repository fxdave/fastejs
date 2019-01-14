const __escapeHTML = function (unsafe) {
    if (unsafe.replace)
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    else
        return unsafe
}

const __default = {
    "begin": true,
    "<% ": true,
    " %>": true,
    "<%=": true,
    "end": true
}
let tags = {
    "begin": ".replace(/\\n/g, '\\uffff')",
    "<%_": ".replace(/(\\s|\\uffff)*<%_/g, '<%')",
    "_%>": ".replace(/_%>(\\s|\\uffff)*/g, '%>')",
    "<%=": ".replace(/<%=([^%]+) %>/g, '`; out += __escapeHTML($1) + `')",
    "<%-": ".replace(/<%-([^%]+) %>/g, '`; out += $1 + `')",
    "<%#": ".replace(/<%#([^%]+) %>/g, '')",
    "<% ": ".replace(/<%(\\s|\\uffff)/g, '`; ')",
    " %>": ".replace(/(\\s|\\uffff)%>/g, '; out +=`')",
    "<%%": ".replace(/<%%/g, '<%')", // <%% => <%
    "%%>": ".replace(/%%>/g, '%>')", // %%> => %>
    "end": ".replace(/\\uffff/g, '\\n')"
}

module.exports = class FastEJS {


    /**
        <% 'Scriptlet' tag, for control-flow, no output
        <%_ ‘Whitespace Slurping’ Scriptlet tag, strips all whitespace before it
        <%= Outputs the value into the template (HTML escaped)
        <%- Outputs the unescaped value into the template
        <%# Comment tag, no execution, no output
        <%% Outputs a literal '<%'
        %> Plain ending tag
        -%> Trim-mode ('newline slurp') tag, trims following newline
        _%> ‘Whitespace Slurping’ ending tag, removes all whitespace after it
    */
    static parse(str, data = { __escapeHTML: null }) {
        // add escape to data
        data.__escapeHTML = __escapeHTML

        // build parser
        let toEval = "str = str"
        for (let i in tags)
            toEval += tags[i]
        toEval += "; str"

        // run parser
        str = eval(toEval)

        // extends output
        str = 'let out = `' + str + '`; return out'

        // eval
        try {
            return (new Function(...Object.keys(data), str))(...Object.values(data))
        } catch (err) {
            throw "Error while evaling the compiled ejs: " + str + " The error: " + err
        }

    }


}


module.exports.tags = tags