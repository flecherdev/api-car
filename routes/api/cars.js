var express = require('express');
var router = express.Router();
var request = require('request');
const { json } = require('body-parser');

// para consumir otra api neseito instalar request
// npm install request 

let url1 = 'https://al3xcr91.pythonanywhere.com/test/api/v1/site/';
let url2 = 'https://al3xcr91.pythonanywhere.com/test/api/v1/site-by-id/';
let url3 = 'https://al3xcr91.pythonanywhere.com/test/api/v1/meli-api/';
let url4 = 'https://al3xcr91.pythonanywhere.com/test/api/v1/meli/'


////--------------------- punto 1 ---------------------
// 17491, 17492 y 17493
// verifico que el car_id exista en ERP OK
router.get('/:car_id', function(req, res){
    
    const { car_id } = req.params;
    
    request( `${url1}/${car_id} `, function(err, body){

        const data = JSON.parse(body.body);
        console.log(`primer data: ${JSON.stringify(data)}`)

        if(data) {
            if(car_id == data.car_id) {
                data1 = data;
                console.log(`primer data1: ${JSON.stringify(data1)}`)
                res.status(200).json({
                    data: data,
                    message: 'ok'
                });
            } else {
                res.status(200).json({
                    data: data,
                    message: 'error'
                });
            }
        }
    });

});

////--------------------- punto 5 ---------------------

// actualizar codigo segun si existe
router.put('ambos/:car_id', function(req, res){

    const { car_id } = req.params; 
    const { body: car } = req; // datos a actualizar
    
    console.log(`segundo car: ${JSON.stringify(car)}`)
    console.log(`segundo car: ${car_id}`) 

    // verifico que el card_id exista con el primer endpoint
    request( {url: `http://localhost:3000/api/cars/${car_id}`, 
              method: 'GET',
              headers: { 
                'Content-Type': 'application/json',
            },
        }, function(err, body){
            // si existe 
            const data = JSON.parse(body.body);
            console.log(`primer data service 1: ${JSON.stringify(data)}`)

            if( data.message == "ok" ) {
                console.log(`ingreso a ok`);
                console.log(`primer data service get: ${JSON.stringify(data.data)}`)

                console.log(data.data._id)
                // voy a actualizar
                request({
                    url: `${url2}${data.data._id}/`, 
                    method: 'PUT', 
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(car)
                    }, function(error, body){
                        // manejo el error de actualizacion de la data
                        const data = JSON.parse(body.body);
                        console.log(`primer data service put: ${JSON.stringify(data)}`)

                        if(!data.Error_msg) {
                            // si no se producjo ningun error pasa al endpoint 3 para actuallizar meli
                            

                            res.status(200).json({
                                data: data,
                                message: 'ok'
                            });
                        } else {
                            res.status(200).json({
                                data: data,
                                message: 'error'
                            });
                        }
                    }
                );

            } else {
                console.log(`paso un error`)
            }      
    });

});

router.put('/:car_id', function(req, res){

});

////--------------------- punto 3 ---------------------

router.get('/meli/:item_id', function(req, res){
    const { item_id } = req.params;


    request( `${url3}/${item_id} `, function(err, body){

        const data = JSON.parse(body.body);

        if(data) {
            res.status(200).json({
                data: data,
                message: 'ok'
            });
        } else {
            res.status(200).json({
                data: data,
                message: 'error'
            });
        }

    });

});

////--------------------- punto 4 ---------------------

router.put('/meli/:item_id', function(req, res){
    const { item_id } = req.params;
    const { body: car } = req; 
    
    request({
        url: `${url4}/${id_interno}/`, 
        method: 'PUT', 
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.parse(car)
        }, function(error, body){

            const data = JSON.parse(body.body);
            if(data) {
                res.status(200).json({
                    data: JSON.parse(data),
                    message: 'ok'
                });
            } else {
                res.status(200).json({
                    data: JSON.parse(data),
                    message: 'error'
                });
            }

        }
    );

});

module.exports = router;