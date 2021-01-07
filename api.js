const express = require('express')
const stuff = require('./stuff');
const fs = require('fs');
var bodyParser = require('body-parser')
const db = new (require('node-json-db')).JsonDB('thing.json', true, true, '/')
module.exports = {
    app: undefined,
    client: undefined,
    init(client) {
        var app = express()
        var error = (res, err) => {
            res.status(500);
            res.end(JSON.stringify(err, null, 4));
            console.log(err);
        }
        app.use(express.json());
        app.use(express.urlencoded());
        var bodyParser = require('body-parser')
        app.use( bodyParser.json() );
        app.use(bodyParser.urlencoded({
            extended: true
        })); 
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
        app.get('/file/:file', async (req, res) => {
            try {
                var data = {};
                if (fs.existsSync(`files/${req.params.file}.json`)) {
                    data = JSON.parse(await fs.promises.readFile(`files/${req.params.file}.json`, 'utf8'));
                }
                if (typeof data.headers == 'object') {
                    Object.entries(data.headers).forEach(el => {
                        res.setHeader(el[0], el[1]);
                    })
                }
                var content = await fs.promises.readFile(`files/${req.params.file}`, 'utf8');
                res.status(200);
                res.end(content);
            } catch (err) {
                error(res, err);
            }
        })
        app.post('/post', (req, res) => {
            try {
                console.log(req.query);
                var params = req.body;
                var now = Date.now();
                var id = now - 1605651972373;
                var title = params.title;
                var imageUrl = params.url;
                var content = params.content;
                var obj = {
                    title,
                    imageURL: imageUrl,
                    content,
                    id,
                    created: now,
                }
                db.push(`/${id}`, obj);
                res.setHeader("Content-Type", "text/json")
                res.status(200)
                res.end(`{ "id": "${id}" }`)
            } catch (err) {
                error(res, err);
            }
        })
        app.get('/discorduser/:id', async (req, res) => {
            try {
                res.setHeader("Content-Type", "text/json")
                res.status(200)
                var user = await stuff.client.users.fetch(req.params.id)
                console.log(user)
                var obj = {
                    avatar: user.avatarURL({ dynamic: true }),
                    username: user.username,
                    tag: user.tag,
                    id: user.id,
                }
                res.end(JSON.stringify(obj, null, 4))
            } catch (err) {
                error(res, err);
            }   
        }) 
        app.get('/post/:id', (req, res) => {
            try {
                res.setHeader("Content-Type", "text/json")
                res.status(200)
                res.end(JSON.stringify(db.getData(`/${req.params.id}/`), null, 4))
            } catch (err) {
                error(res, err);
            }
        })
        app.delete('/post/:id', (req, res) => {
            try {
                db.delete(`/${req.params.id}/`)
                res.status(200)
                res.end()
            } catch (err) {
                error(res, err);
            }
        })
        app.listen(6969, () => {
            console.log("server ready")
        })
    }
}