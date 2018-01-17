const express = require('express');
const router = express.Router();
var Big = require('big.js');

router.get('/', function(req, res) {
    res.send('Hello World');
});

// https://github.com/ahfarmer/calculator/blob/master/src/logic/operate.js

router.post('/calculate', function(req, res) {
    var result;
    var error = false;
    const a = Big(req.body.a);
    const b = Big(req.body.b);

    switch (req.body.operate) {
        case '+':
            result = a.plus(b).toString();
            break;
        case '-':
            result = a.minus(b).toString();
            break;
        case '*':
            result = a.times(b).toString();
            break;
        case '/':
            if(req.body.b == 0)
                result = 'Error';
            else
                result = a.div(b).toString();
            break;
        default:
            result = 'Unknown operation';
            error = true;
    }

    res.send({
        error: error,
        result: result,
        params: req.body
    });
});

module.exports = router;
