const fs = require('fs');

const requestHandler = (req, res) =>{
    const url = req.url;
    const method = req.method;

    // triple equal if same type and same value
    // only gets in the code if empty url
    if (url === '/'){
        res.write('<html>')
        res.write('<head><titel>Enter Message</title></head>')
        // send post request to URL and take input with it under the name provided
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>')
        res.write('</html>')
        return res.end(); // prevent continuing execution with other lines
    }

    
    // only if it's a POST method
    if (url === "/message" && method =="POST"){
        const body = [];

        // allow us to listen to certain events
        // whneever new chunch is ready to be read
        // function for every incoming data 
        req.on('data', (chunk) => {
            // interact with chunk
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            // add all chunks
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[0];
            fs.writeFile('message.txt', message, (err) => {
                // write meta info
                // status code 302 stands for redirection
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }

    // Attach header to response passing meta info
    // Set header to certain thing
    // this case send html in the header type
    res.setHeader('Content-Type', 'text/html')

    // Allows to write data in response
    // write multiple lines(chuncks)
    res.write('<html>')
    res.write('<head>This is the header </head>')
    res.write('<body><h1>Hello from Node server</h1></body>')
    res.write('</html>')
    // part where we send it back
    res.end();

    // process.exit();
};

// module that has export properties
// Will look into it and see if any function is registered here
// when it reuired in another file it looks at the module.exports
// to see what is returned in the require statement
module.exports = requestHandler;

// // Exporting many things
// module.exports = {
//     handler: requestHandler,
//     someText: 'Text coded here'
// }

