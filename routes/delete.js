var express = require('express');
var request = require('request');
var fs = require("fs");


var router = express.Router();

/* GET delete agency to favorites*/
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
                                obj.favorites.splice(i, 1);
                                var json = JSON.stringify(obj);
                                fs.writeFileSync('favorites.json', json);
                                res.statusMessage = "La agencia se elimino de favoritos";
                                res.send(jsonParse.results)
                                existe = 1;
                                break;
                            }
                        }
                        if (existe === 0){
                            res.statusMessage = "La agencia no esta guardada en  favoritos";
                            res.status(400).send()
                        }
                    }});
            } else {
                res.statusMessage = "No hay ninguna agencia agregada a favoritos";
                res.send(jsonParse.results)
            }

        });
    });
});

module.exports = router;