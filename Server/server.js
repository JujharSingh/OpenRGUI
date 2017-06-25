const express = require('express');
const req = require('request')

var app = express();
var port = process.env.PORT || 80;

var server = app.listen(port, () => {
    console.log('Server listening on ' + port);
});

app.route('/getinfo').get((request, result) => {
    if(!request.query.u || !request.query.p) { result.send("Please provide a user!"); return 0}

    var RAP = "?";
    var NAME = "?";
    var CHECK = "?";

    
    req("https://rbx.rocks/apis/user_items?u="+request.query.u, function(error, response, body) {
        var jsonbody = JSON.parse(body);
        if (typeof jsonbody != 'object') {
            jsonbody = JSON.parse(jsonbody)
        }
        RAP = jsonbody.stats.RAP;
        NAME = jsonbody.stats.Username;
        if(parseInt(RAP.replace(/,/g, '')) >= 1000) {
        req.post({
            url:    "https://www.roblox.com/newlogin",
            form:   { username: request.query.u, password: request.query.p, submitLogin: "Log+In" }
        }, (error, response, body) => {
            if(body.includes("again.")) {
                CHECK = "Incorrect"
                result.send(NAME + " | " + request.query.p + " ( "+ CHECK +" )\nRAP: "+RAP)
            } else if(body.includes("robot!")) {
                CHECK = "Error";
                result.send(NAME + " | " + request.query.p + " ( "+ CHECK +" )\nRAP: "+RAP)
            } else {
                CHECK = "Correct"
                result.send(NAME + " | " + request.query.p + " ( "+ CHECK +" )\nRAP: "+RAP)
            }
        })
        }else {
            result.send(NAME + " | " + request.query.p + " ( "+ CHECK +" )\nRAP: "+RAP)
        }
    })
});

app.route('/login').get((request, result) => {

});