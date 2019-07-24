var express = require('express');
var request = require('request');
var fs = require("fs");
var sortJsonArray = require('sort-json-array');


var router = express.Router();


/* GET agencies listing and filter */
router.get('/:siteID/payment_methods/:paymentMethodID/agencies', function(req, res) {
    var siteID = req.params.siteID
    var paymentMethodID = req.params.paymentMethodID
    var latitud = req.query.latitud
    var longitud = req.query.longitud
    var limit = req.query.limit
    var offset = req.query.offset
    var orderBy = req.query.orderBy
    request.get("https://api.mercadolibre.com/sites/"+siteID+"/payment_methods/"+paymentMethodID+"/agencies?near_to="+latitud+","+longitud+"&limit="+limit+"&offset="+offset, function (error,response,body) {

        if (error){
            res.send(error)
        }

        if(latitud=== ''  || longitud === ''){

            res.status(404).send("Los campos latitud y longuitud estan vacios")
        }
        else{

            var output = JSON.parse(body);

            fs.writeFileSync('results.json', JSON.stringify(output.results));

            var obj = JSON.parse(fs.readFileSync('results.json', 'utf8'))


            if(orderBy === 'address_line') {

                res.send(sortJsonArray(obj, 'address.address_line', 'asc'))

            }else if(orderBy === 'agency_code') {

                res.send(sortJsonArray(obj, 'agency_code', 'asc'))

            } else if(orderBy === 'distance'){

                res.send(sortJsonArray(obj, 'distance', 'asc'))

            }else if(orderBy === ''){

                res.send(obj)
            }
        }

    });
});



module.exports = router;
