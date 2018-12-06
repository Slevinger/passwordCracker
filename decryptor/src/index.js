let bodyParser = require('body-parser')
let helper = require('./helper');
let express = require('express');
let app = express();
let PORT = 8080;

// support CORS
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST , OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(bodyParser.json());

app.post('/getPossibleKey', function (req, res) {
    let keySize;
    let respondError = function (code, msg, res) {
        res.statusCode = code;
        res.send(msg)
    };

    try {
        keySize = req.body.keySize;
        if (keySize > 5) {
            respondError(400, 'Key size too big');
            return;
        }
        if (keySize < 0) {
            respondError(400, 'Key size too small', res);
            return;
        }
    } catch (e) {
        respondError(400, 'Key size not sent', res);
        return;
    }

    let textToDecrypt;
    try {
        textToDecrypt = req.body.textToDecrypt;
        if (textToDecrypt.length == 0) {
            respondError(400, 'No text to decrypt sent', res);
            return;
        }
    } catch (e) {
        respondError(400, 'No text to decrypt in body', res);
        return;
    }

    let response = helper.guessKey(JSON.parse(textToDecrypt), keySize);

    res.setHeader('Content-type', 'application/json; charset=utf-8');
    res.send(response)


});

app.listen(PORT, () => console.log(`Password cracker app listening on port ${PORT}!`));

