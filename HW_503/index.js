const express = require('express');
const app = express();
const fs = require("fs");
const path = require("path");

const pathFile = path.join(__dirname, "count.json");

const count = {
    root: 0,
    about: 0
}
fs.writeFileSync(pathFile, JSON.stringify(count, null, 2));

app.use((req, res, next) => {
    console.log('Поступил запрос', req.method, req.url);
    next();
})
app.get('/', (req, res) => {
    const data = JSON.parse(fs.readFileSync(pathFile, "utf-8"));
    data.root++;
    const rootPage = `<h1>Корневая страница</h1><p>Просмотров: ${data.root}</p>  <p><a href="/about">Ссылка на страницу /about</a></p>`
    res.send(rootPage)
    fs.writeFileSync(pathFile, JSON.stringify(data, null, 2));
})

app.get('/about', (req, res) => {
    const data = JSON.parse(fs.readFileSync(pathFile, "utf-8"));
    data.about++;
    const aboutPage = `<h1>Страница about</h1> <p>Просмотров: ${data.about}</p>  <p><a href="/">Ссылка на страницу /</a></p>`
    res.send(aboutPage)
    fs.writeFileSync(pathFile, JSON.stringify(data, null, 2));
})

app.use((req, res) => {
    res.status(404);
    res.send('<h1>Страница не найдена!</h1>')
})
const port = 3000;
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});




