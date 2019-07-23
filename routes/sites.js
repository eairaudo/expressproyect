var express = require('express');
var request = require('request');
var fs = require("fs");
var sortJsonArray = require('sort-json-array');


var router = express.Router();


/* GET agencies listing with filter */
router.get('/:siteID/payment_methods/:paymentMethodID/agencies/:locationmin/:locationmax/:orderBy?', function(req, res) {
    var siteID = req.params.siteID
    var paymentMethodID = req.params.paymentMethodID
    var locationmin = req.params.locationmin
    var locationmax = req.params.locationmax
    var orderBy = req.params.orderBy
    request.get("https://api.mercadolibre.com/sites/"+siteID+"/payment_methods/"+paymentMethodID+"/agencies?near_to="+locationmin+","+locationmax, function (error,response,body) {

        if (error){
            res.send(error)
        }

        var output = JSON.parse(body);

        fs.writeFileSync('results.json', JSON.stringify(output.results));

        var obj = JSON.parse(fs.readFileSync('results.json', 'utf8'))


        if(orderBy === 'address_line') {

            res.send(sortJsonArray(obj, 'address.address_line', 'asc'))

        }else if(orderBy === 'agency_code') {

            res.send(sortJsonArray(obj, 'agency_code', 'asc'))

        } else if(orderBy === 'distance'){

            res.send(sortJsonArray(obj, 'distance', 'asc'))

        }else{

            res.send(obj)
        }



    });
});

/* GET agencies by id and add favorites*/
router.get('/:siteID/payment_methods/:paymentMethodID/agencies/:id', function(req, res) {
    var siteID = req.params.siteID
    var paymentMethodID = req.params.paymentMethodID
    var id = req.params.id


    request.get("https://api.mercadolibre.com/sites/"+siteID+"/payment_methods/"+paymentMethodID+"/agencies/"+id , function (error,response,body) {
        if (error) {
            res.send(error)
        }

        var output = JSON.parse(body);

        if (fs.existsSync("favorites.json")){

            fs.writeFileSync('favorites.json', JSON.stringify(output));

        }else{
            fs.writeFileSync('favorites.json', JSON.stringify(output));
        }

        var obj2 = JSON.parse(fs.readFileSync('favorites.json', 'utf8'))

        res.send(obj2)
    });
});



module.exports = router;
