const http = require('http');
let mainCount = 0;
let aboutCount = 0;
let notFounCount = 0;
const server = http.createServer((req, res) => {
    console.log('Запрос получен.');
    if (req.url === '/') {
        mainCount++;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        const start = `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Главная страница</title>
                            </head>
                            <body>
                                <h1>Главная страница</h1>
                                <a href="/about">На about</a>
                                <h2>Счетчик просмотров: ${mainCount}</h2>
                            </body>
                            </html>`;

        res.end(start)
    } else if (req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        aboutCount++;
        const about = `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>about</title>
                            </head>
                            <body>
                                <h1>Страница about</h1>
                                <a href="./">На главную</a>
                                <h2>Счетчик просмотров: ${aboutCount}</h2>
                            </body>
                            </html>`;
        res.end(about);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
        notFounCount++;
        res.end(`<h1>Страница не найдена</h1>
        <h2>Счетчик просмотров: ${notFounCount}</h2>
        `);
    }

});
const port = 3000;
server.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});