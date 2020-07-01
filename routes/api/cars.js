var express = require('express');
var router = express.Router();
var request = require('request');
const { json } = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


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

////--------------------- punto 2 --------------------- (punto de entrada para los demas endpoint)

// actualizar codigo segun si existe
router.put('/:car_id', function(req, res){

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
                        const dataUpdate = JSON.parse(body.body);
                        console.log(`primer data service put: ${JSON.stringify(dataUpdate.data)}`)

                        if(!dataUpdate.Error_msg) {
                            // si no se producjo ningun error pasa al endpoint 3 para actuallizar meli
                            // TODO
                            // consigo la data con url 3 
                            request( `http://localhost:3000/api/cars/meli/${data.data.mlid}/`, function(err, body){

                                const dataGetMeli = JSON.parse(body.body);
                                console.log(`segundo data service get meli: ${JSON.stringify(dataGetMeli.data)}`)

                                // una vez que consigo el seller_id y status
                                if(!dataGetMeli.Error_msg && dataGetMeli.data.status === 'active') {

                                    let objetTemp = {
                                        seller_id: dataGetMeli.data.seller_id,
                                        precio: car.precio,
                                        kilometros: car.kilometros
                                    }
                                    // actualizacion en meli
                                    console.log(objetTemp)
                                    request({
                                        url: `http://localhost:3000/api/cars/meli/${data.data.mlid}/`, 
                                        method: 'PUT', 
                                        headers: { 
                                            'Content-Type': 'application/json',
                                        },
                                        auth: {
                                            'bearer': 'bearerToken',
                                            'id_interno':jwt.sign(dataGetMeli.data.seller_id) // esto puede ser token y no id_interno
                                        },
                                        body: JSON.stringify(objetTemp)
                                        }, function(error, body){
                                
                                            const data = JSON.parse(body.body);
                                            console.log(`segundo data service put meli: ${JSON.stringify(data)}`)
                                
                                            if(!data.Error_msg) {
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
                                    res.status(200).json({
                                        data: dataGetMeli,
                                        message: 'error'
                                    });
                                }
                        
                            });

                            // res.status(200).json({
                            //     data: data,
                            //     message: 'ok'
                            // });
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

// router.put('/:car_id', function(req, res){

// });

////--------------------- punto 3 ---------------------

router.get('/meli/:item_id', function(req, res){
    const { item_id } = req.params;

    request( `${url3}${item_id} `, function(err, body){

        const data = JSON.parse(body.body);
        console.log(`primer data service get meli: ${JSON.stringify(data)}`)

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
        url: `${url4}${id_interno}/`, 
        method: 'PUT', 
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(car)
        }, function(error, body){

            const data = JSON.parse(body.body);
            console.log(`primer data service put meli: ${JSON.stringify(data)}`)

            if(!data.Error_msg) {
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
});

module.exports = router;