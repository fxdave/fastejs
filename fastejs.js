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
    "begin": ".replace(/\\n/g, '\\uffff')", // new lines => \uffff  (\uffff is not a used character so it is perfect for this)
    "<%_": ".replace(/(\\s|\\uffff)*<%_/g, '<%')", // <%_ => <%  (removes all whitespace before it and replaces with <% for later use)
    "_%>": ".replace(/_%>(\\s|\\uffff)*/g, '%>')", // _%> => %>  (removes all whitespace after it and replaces with %> for later use)
    "<%=": ".replace(/<%=([^%]+) %>/g, '`; out += __escapeHTML($1) + `')", // <%=SOME_JS %> escaped output
    "<%-": ".replace(/<%-([^%]+) %>/g, '`; out += $1 + `')", //  <%-SOME_JS %> non-escaped output
    "<%#": ".replace(/<%#([^%]+) %>/g, '')", //  <%#SOME_JS %> comment
    "<% ": ".replace(/<%(\\s|\\uffff)/g, '`; ')", //  <%  script open tag
    " %>": ".replace(/(\\s|\\uffff)%>/g, '; out +=`')", // %> script close tag
    "<%%": ".replace(/<%%/g, '<%')", // <%% => <%
    "%%>": ".replace(/%%>/g, '%>')", // %%> => %>
    "end": ".replace(/\\uffff/g, '\\n')" // \uffff => new lines
}

module.exports = class FastEJS {


    /*
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

    /**
     * 
     * @param {string} str is the template
     * @param {Object} data is the vars that will be given to the template
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
        str = 'let out = `' + str + '`; out'

        // eval
        try {
            for(let i in data)
                global[i] = data[i]
            return eval(str)
            //return (new Function(...Object.keys(data), str))(...Object.values(data))
        } catch (err) {
            throw "Error while evaling the compiled ejs: " + str + " The error: " + err
        }

    }


}


module.exports.tags = tags