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
            favorites: []
        };

        var jsonParse = JSON.parse(body);

        fs.exists('favorites.json', function(exists){
                if(exists){
                    console.log("existe archivo");
                    fs.readFile('favorites.json', function readFileCallback(err, data){
                        if (err){
                            console.log(err);
                        } else {
                            obj = JSON.parse(data);

                            var existe = 0;

                            var key, count = 0;
                            for(key in obj.favorites) {
                                if(obj.favorites.hasOwnProperty(key)) {
                                    count++;
                                }
                            }

                            for (var i=0; i<count; i++){
                                if(obj.favorites[i].id === id){
                                    existe = 1;
                                    console.log("el id existe")
                                    break;
                                }
                            }
                            if (existe === 0){
                                for (var b=0; b<1 ; b++){
                                    obj.favorites.push(jsonParse.results[b]);
                                }
                                var json = JSON.stringify(obj);
                                fs.writeFileSync('favorites.json', json);
                                res.statusMessage = "La agencia se guardo";
                                res.send(jsonParse.results)
                            }else{
                                res.statusMessage = "La agencia ya fue guardada anteriormente";
                                res.status(400).send()
                            }
                        }});
                } else {
                    for (var i=0; i<1 ; i++){
                        obj.favorites.push(jsonParse.results[i]);
                    }
                    var json = JSON.stringify(obj);
                    fs.writeFileSync('favorites.json', json);
                    res.statusMessage = "La agencia se guardo";
                    res.send(jsonParse.results)
                }

            });
    });
});

router.get('/list', function(req, res) {

    var output = (JSON.parse(fs.readFileSync('favorites.json').toString()))

    res.send(output.favorites)


});

module.exports = router;