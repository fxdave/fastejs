const assert = require("assert")
const FastEJS = require("./fastejs.js")

it("tests the <% script %> tag", function() {
    let rendered = FastEJS.parse(`<% let a = 123; %><%= a %>`)
    assert.equal(rendered, "123")
})

it("tests the <%# something %> tag", function() {
    let rendered = FastEJS.parse(`<%# something %>`, {}, { tags: {"<%#" : true} })
    assert.equal(rendered, "")
})

it("tests the <%% compilation", function() {
    let rendered = FastEJS.parse(`<%%`, {}, { tags: {"<%%" : true} })
    assert.equal(rendered, "<%")
})

it("tests the %%> compilation", function() {
    let rendered = FastEJS.parse(`%%>`, {}, { tags: {"%%>" : true} })
    assert.equal(rendered, "%>")
})


it("tests the <%= %> tag", function() {

    rendered = FastEJS.parse(`<%= "<helloka>" %>`)
    assert.equal(rendered, "&lt;helloka&gt;")

    rendered = FastEJS.parse(`<%= 123 %>`)
    assert.equal(rendered, "123")

    rendered = FastEJS.parse(`<%= false %>`)
    assert.equal(rendered, "false")

})

it("tests the <%- -%> tag", function() {

    rendered = FastEJS.parse(`<%- "<helloka>" -%>`, {}, { tags: {"-%>" : true, "<%-" : true} })
    assert.equal(rendered, "<helloka>")

    rendered = FastEJS.parse(`<%- 123 -%>`, {}, { tags: {"-%>" : true, "<%-" : true} })
    assert.equal(rendered, "123")

    rendered = FastEJS.parse(`<%- false -%>`, {}, { tags: {"-%>" : true, "<%-" : true} })
    assert.equal(rendered, "false")

})

it("tests the <%_ tag", function() {
    let rendered = FastEJS.parse(`   

    <%_ 1+2  %> `, {}, {tags: {"<%_" : true}})
    assert.equal(rendered, " ")
})


it("tests the _%> tag", function() {
    let rendered = FastEJS.parse(` <% 1+2  _%> 
    
    `, {}, {tags: {"_%>" : true}})
    assert.equal(rendered, " ")
})
