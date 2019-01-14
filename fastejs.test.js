const assert = require("assert")
const FastEJS = require("./fastejs.js")
const ejs = require("ejs") // for speed comparison

it("tests the <% script %> tag", function () {
    let rendered = FastEJS.parse(`<% let a = 123; %><%= a %>`)
    assert.equal(rendered, "123")
})

it("tests the <%# something %> tag", function () {
    let rendered = FastEJS.parse(`<%# something %>`)
    assert.equal(rendered, "")
})

it("tests the <%% compilation", function () {
    let rendered = FastEJS.parse(`<%%`)
    assert.equal(rendered, "<%")
})

it("tests the %%> compilation", function () {
    let rendered = FastEJS.parse(`%%>`)
    assert.equal(rendered, "%>")
})


it("tests the <%= %> tag", function () {

    rendered = FastEJS.parse(`<%= "<helloka>" %>`)
    assert.equal(rendered, "&lt;helloka&gt;")

    rendered = FastEJS.parse(`<%= 123 %>`)
    assert.equal(rendered, "123")

    rendered = FastEJS.parse(`<%= false %>`)
    assert.equal(rendered, "false")

})

it("tests the <%- %> tag", function () {

    rendered = FastEJS.parse(`<%- "<helloka>" %>`)
    assert.equal(rendered, "<helloka>")

    rendered = FastEJS.parse(`<%- 123 %>`)
    assert.equal(rendered, "123")

    rendered = FastEJS.parse(`<%- false %>`)
    assert.equal(rendered, "false")

})

it("tests the <%_ tag", function () {
    let rendered = FastEJS.parse(`   

    <%_ 1+2  %> `)
    assert.equal(rendered, " ")
})


it("tests the _%> tag", function () {
    let rendered = FastEJS.parse(` <% 1+2  _%> 
    
    `)
    assert.equal(rendered, " ")
})


it("tests the speed", function () {
    let begin = new Date()
    for (let i = 0; i < 10000; i++) {
        FastEJS.parse(` 
        asdasda
        <% a.forEach(num => { %>
            <%=a %> asasd
        <% }) %>
        asdasd
    `, { a: [1, 2, 3] })
    }
    let end = new Date()
    let estimatedFastejs = end - begin
    

    begin = new Date()
    for (let i = 0; i < 10000; i++) {
        ejs.render(` 
        asdasda
        <% a.forEach(num => { %>
            <%=a %> asasd
        <% }) %>
        asdasd
    `, { a: [1, 2, 3] })
    }
    end = new Date()
    let estimatedEjs = end - begin
    
    console.log(estimatedFastejs);
    console.log(estimatedEjs);

    if(estimatedFastejs < estimatedEjs) {
        assert.ok(true)
    } else {
        assert.ok(false)
    }
})
