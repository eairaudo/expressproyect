var express = require('express');
var request = require('request');
var fs = require("fs");


var router = express.Router();

/* GET agencies by id and add favorites*/
router.get('/:siteID/payment_methods/:paymentMethodID/agencies/:id', function(req, res) {
    var siteID = req.params.siteID
    var paymentMethodID = req.params.paymentMethodID
    var id = req.params.id

    request.get("https://api.mercadolibre.com/sites/"+siteID+"/payment_methods/"+paymentMethodID+"/agencies/"+id , function (error,response,body) {
        if (error) {
            res.send(error)
        }

        var obj = {
            table: []
        };

        fs.exists('favorites.json', function(exists){
                if(exists){
                    console.log("yes file exists");
                    fs.readFile('favorites.json', function readFileCallback(err, data){
                        if (err){
                            console.log(err);
                        } else {
                            obj = JSON.parse(data);
                            for (var i=0; i<1 ; i++){
                                obj.table.push(body);
                            }
                            var json = JSON.stringify(obj);
                            fs.writeFileSync('favorites.json', json);
                        }});
                } else {
                    console.log("file not exists")
                    for (var i=0; i<1 ; i++){
                        obj.table.push(body);
                    }
                    var json = JSON.stringify(obj);
                    fs.writeFileSync('favorites.json', json);
                }

            var output = (JSON.parse(fs.readFileSync('favorites.json').toString()))

            res.send(output.table)

            });
    });
});

router.get('/list', function(req, res) {

    var output = (JSON.parse(fs.readFileSync('favorites.json').toString()))

    res.send(output.table)


});

module.exports = router;