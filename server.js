import http from 'http';
import fs from 'fs';
import path from 'path';

import { URL } from 'url';
import querystring from 'querystring';

const STATIC_ROOT = path.join(process.cwd(), 'public');

const getContentType = (filePath) => {
    const extname = path.extname(filePath);

    switch (extname) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'application/javascript';
        case '.mp4':
            return 'video/mp4';
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        default:
            return 'application/octet-stream';
    }
};

const server = http.createServer((req, res) => {
    let filePath = '';

    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = requestUrl.pathname;

    if (req.method === 'POST' && pathname === '/home') {

        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {

            const formData = querystring.parse(body);
            console.log('Login Attempt (Secure):', formData);

            res.writeHead(200, {
              'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({ success: true, redirect: '/home' }));

        });
        return;
    }

    if (req.method === 'POST' && pathname === '/reset-password') {

        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {

            const parsedData = JSON.parse(body);
            const email = parsedData.email;

            console.log('Password Reset Request for:', email);

            // TODO: Implement email sending functionality here
            // You can use nodemailer or other email service
            // Example: await sendPasswordResetEmail(email);

            res.writeHead(200, {
              'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({ 
                success: true, 
                message: 'Password reset link has been sent to your email.' 
            }));

        });
        return;
    }

    if (pathname === '/') {
        filePath = path.join(process.cwd(), 'src', 'page', 'login.html');
    }else if(pathname === '/login'){
        filePath = path.join(process.cwd(), 'src', 'page', 'login.html');
    }else if(pathname === '/home'){
        filePath = path.join(process.cwd(), 'src', 'page', 'index.html');
    }else if(pathname === '/register'){
        filePath = path.join(process.cwd(), 'src', 'page', 'register.html');
    }else if(pathname === '/forgetpassword'){
        filePath = path.join(process.cwd(), 'src', 'page', 'forgetpassword.html');
    }else {
        filePath = path.join(STATIC_ROOT, req.url);
    }

    let statusCode = 200;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            statusCode = 404;
            const notFoundPath = path.join(process.cwd(), 'src', 'page', '404.html');

            fs.readFile(notFoundPath, (err404, data404) => {
                if (err404) {
                    res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
                    res.end('404 Not Found');
                    return;
                }
                res.writeHead(statusCode, { 'Content-Type': 'text/html' });
                res.end(data404);
            });
            return;
        }

        res.writeHead(statusCode, { 'Content-Type': getContentType(filePath) });
        res.end(data);
    });
});

server.listen(3000, 'localhost', () => {
    console.log('Listening to the port of http://localhost:3000');
})
