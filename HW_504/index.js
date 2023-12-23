"use strict";

const express = require('express');
const Joi = require('joi');
const fs = require("fs");
const path = require("path");

const pathFile = path.join(__dirname, "user.json");

const userSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    age: Joi.number().min(0).required(),
    city: Joi.string().min(2),
});

const app = express();

app.use(express.json());

// const users = [];
let uId = 0;

function readFileUsers(pathFile) {
    try {
        const data = JSON.parse(fs.readFileSync(pathFile, "utf-8"));
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}


function writeFileUsers(pathFile, users) {
    try {
        fs.writeFileSync(pathFile, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error(err);
        return false;
    }
}


app.get('/users', (req, res) => {
    const user = readFileUsers(pathFile);
    if (user) {
        res.send({ user });
    } else {
        res.status(500);
        res.send({ user: null });
    }
});

app.get('/users/:id', (req, res) => {
    const users = readFileUsers(pathFile);
    if (users) {
        const user = users.find((user) => user.id === +req.params.id);
        if (user) {
            res.send({ user });
        } else {
            res.status(404);
            res.send({ user: null });
        }
    } else {
        res.status(500);
        res.send({ user: null });
    }



});

app.post('/users', (req, res) => {
    const result = userSchema.validate(req.body);

    if (result.error) {
        return res
            .status(500)
            .send({ error: result.error.details });
    };
    let users = readFileUsers(pathFile);
    let nextId = 1;

    if (users) {
        nextId = users.reduce((user1, user2) => (user1.id > user2.id ? user1.id : user2.id), users[0].id) + 1;
    } else {
        users = []; //Если файл пустой
    }

    users.push({
        id: nextId,
        ...req.body,
    });

    const writeSucсess = writeFileUsers(pathFile, users);
    if (writeSucсess) {
        res.send({ id: nextId });
    } else {
        res
            .status(500)
            .send({ user: null });
    }
});

app.put('/users/:id', (req, res) => {
    const result = userSchema.validate(req.body);

    if (result.error) {
        return res
            .status(500)
            .send({ error: result.error.details });
    }
    let users = readFileUsers(pathFile);
    if (users) {
        const user = users.find((user) => user.id === +req.params.id);
        if (user) {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.age = req.body.age;
            user.city = req.body.city;
            const writeSucсess = writeFileUsers(pathFile, users);
            if (writeSucсess) {
                res.send({ user });
            } else {
                res
                    .status(500)
                    .send({ user: null });
            }

        } else {
            res.status(404);
            res.send({ user: null });
        }
    } else {
        res.status(404);
        res.send({ user: null });
    }



});

app.delete('/users/:id', (req, res) => {
    let users = readFileUsers(pathFile);
    if (users) {
        const user = users.find((user) => user.id === +req.params.id);
        if (user) {
            const userIndex = users.indexOf(user);
            users.splice(userIndex, 1);
            const writeSucсess = writeFileUsers(pathFile, users);
            if (writeSucсess) {
                res.send({ user });
            } else {
                res
                    .status(500)
                    .send({ user: null });
            }

        } else {
            res.status(404);
            res.send({ user: null });
        }
    }



});

app.listen(3000);