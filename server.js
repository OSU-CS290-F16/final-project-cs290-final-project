// include modules
var http = require('http'),
        fs = require('fs'),
        qs = require('querystring');

// create an http server
var server = http.createServer(requestHandler);

// listen on port 8000
server.listen(8000, function (err) {
    if (err) {
        console.log('Error starting http server');
    } else {
        console.log("Server running at http://127.0.0.1:8000/ or http://localhost:8000/");
    }
    ;
});

var authorized_user = '';


// callback function
function requestHandler(request, response) {

    if (request.url.indexOf('.css') != -1) { //request.url has the pathname, check if it contains '.css'

        fs.readFile(__dirname + request.url, function (err, data) {
            if (err)
                console.log(err);
            response.writeHead(200, {'Content-Type': 'text/css'});
            response.write(data);
            response.end();
        });

    }

    if (request.url.indexOf('.jpg') != -1) {

        fs.readFile(__dirname + request.url, function (err, data) {
            if (err)
                console.log(err);
            response.writeHead(200, {'Content-Type': 'image/jpeg'});
            response.write(data);
            response.end();
        });

    }

    if (request.url == "/") {
        var head = fs.readFileSync("head.html").toString();
        if (authorized_user == '') {

            var body = fs.readFileSync("index.html").toString();

        } else {

            var body = fs.readFileSync("profile.html").toString();
        }
        // serve up the client page.
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write("<!DOCTYPE html>");
        response.write("<html>");
        response.write(head);
        response.write("<body>");
        response.write(body);
        response.write("</body>");
        response.write("</html>");
        response.end();
    }

    if (request.url == "/login" && request.method == "POST") {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var POST = qs.parse(body);
            fs.readFile('userdata.json', function (err, data) {
                if (err)
                    throw err;
                var user = JSON.parse(data);
                if (user.username == POST.username && user.password == POST.password) {

                    authorized_user = POST.username;


                    var head = fs.readFileSync("head.html").toString();
                    var body = fs.readFileSync("profile.html").toString();
                    // serve up the client page.
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.write("<!DOCTYPE html>");
                    response.write("<html>");
                    response.write(head);
                    response.write("<body>");
                    response.write(body);
                    response.write("</body>");
                    response.write("</html>");
                    response.end();
                } else {

                    var head = fs.readFileSync("head.html").toString();
                    var body = fs.readFileSync("index.html").toString();
                    // serve up the client page.
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.write("<!DOCTYPE html>");
                    response.write("<html>");
                    response.write(head);
                    response.write("<body>");
                    response.write("<div class='error'>Incorrect username or password</div>");
                    response.write(body);
                    response.write("</body>");
                    response.write("</html>");
                    response.end();
                }
            });

        });
    }
    if (request.url == "/save_text_blog" && request.method == "POST") {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var POST = qs.parse(body);

            fs.readFile('userdata.json', function (err, data) {
                if (err)
                    throw err;

                var user = JSON.parse(data);
