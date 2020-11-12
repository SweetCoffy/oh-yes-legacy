const express = require('express')
const stuff = require('./stuff');
module.exports = {
    app: undefined,
    init(client) {
        var app = express()
        var error = (res, err) => {
            res.status(500)
            res.end(JSON.stringify(err, null, 4))
        }
        this.app = app;
        app.get('/user/:id', (req, res) => {
            try {
                var user = stuff.db.getData(`/`)[req.params.id];
                res.setHeader("Content-Type", "text/json")
                if (user == undefined) {
                    res.status(404)
                    res.end("{ \"error\": \"oh no\" }")
                } else {
                    res.status(200)
                    res.end(JSON.stringify(user, null, 4))
                }
            } catch (err) {
                res.status(500)
                res.end(err.toString())
            }
        })
        app.get('/user/:id/:stat', (req, res) => {
            try {
                var user = stuff.db.getData(`/`)[req.params.id][req.params.stat];
                res.setHeader("Content-Type", "text/json")
                if (user == undefined) {
                    throw "User not found"
                } else {
                    res.status(200)
                    res.end(JSON.stringify(user, null, 4))
                }
            } catch (err) {
                error(res, err)
            }
        })
        app.get('/command/:name', (req, res) => {
            try {
                var cmd = client.commands.get(req.params.name)
                if (cmd == undefined) {
                    throw "Command not found"
                }
                res.status(200)
                res.end(JSON.stringify(cmd, null, 4))
            } catch (err) {
                error(res, err)
            }
        })
        app.get('/users', (req, res) => {
            try {
                res.setHeader("Content-Type", "text/json")
                var users = Object.entries(stuff.db.getData(`/`)).map(el => { return {id: el[0], ...el[1]} })
                res.status(200)
                res.end(JSON.stringify(users, null, 4))
            } catch (err) {
                error(res, err)
            }
        })
        app.listen(6969, () => {
            console.log("server ready")
        })
    }
}