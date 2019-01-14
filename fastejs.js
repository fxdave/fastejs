module.exports = class FastEJS {

    static parse(str, data = {}, options) {

        data.__escapeHTML = function(unsafe) {
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

        if(!options) {
            options = { tags: {} }
        }

        options.tags = {
            "begin": true,
            "end": true,
            "<% " : true,
            " %>" : true,
            "<%=" : true,
            ...options.tags
        }

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

        let tags = {
            "begin" : str => str.replace(/\n/g, '\uffff'),
            "<%_" : str => str.replace(/(\s|\uffff)*<%_/g, '<%'),
            "_%>" : str => str.replace(/_%>(\s|\uffff)*/g, '%>'),
            "<%=" : str => str.replace(/<%=([^%]+) %>/g, '`; out += __escapeHTML($1) + `'),
            "<%-" : str => str.replace(/<%-([^%]+)-%>/g, '`; out += $1 + `'),
            "<%#" : str => str.replace(/<%#([^%]+) %>/g, ''),
            "<% " : str => str.replace(/<%(\s|\uffff)/g, '`; '),
            " %>" : str => str.replace(/(\s|\uffff)%>/g, '; out +=`'),
            "<%%" : str => str.replace(/<%%/g, '<%'), // <%% => <%
            "%%>" : str => str.replace(/%%>/g, '%>'), // %%> => %>
            "end" : str => str.replace(/\uffff/g, '\n')
        }
        
        for(let i in tags) 
            if(options.tags[i])
                str = tags[i](str)
        
        str = 'let out = `' + str + '`; return out'
        
        try {
            return (new Function(...Object.keys(data), str))(...Object.values(data))
        } catch (err) {
            throw "Error while evaling the compiled ejs: " + str + " The error: " + err
        }

    }

    
}
