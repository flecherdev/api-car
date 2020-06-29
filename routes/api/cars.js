var express = require('express');
var router = express.Router();
var request = require('request');
const { json } = require('body-parser');

// para consumir otra api neseito instalar request
// npm install request 
//  DEBUG=api-car:* npm start 

// punto 1
// car_id 17491, 17492 y 17493
/**
 * 17491
 * 
 * {
    "car_id": 17491,
    "_id": "5e14f581bf0d686228f6436a",
    "mlid": "MLA851699685"
}
 * 
 * 
 * 1792
 * 
 * {
    "car_id": 17492,
    "_id": "5e14f581bf0d686228f6436b",
    "mlid": "MLA851699686"
}
 * 
 * 
 * 
 * {
    "car_id": 17493,
    "_id": "5e14f581bf0d686228f6436c",
    "mlid": "MLA851699687"
}
 * 
 * 
 */



let url1 = 'https://al3xcr91.pythonanywhere.com/test/api/v1/site/'
let url3 = 'https://al3xcr91.pythonanywhere.com/test/api/v1/meli-api/';
let url4 = 'https://al3xcr91.pythonanywhere.com/test/api/v1/meli/'

////--------------------- punto 1 ---------------------

// verifico que el car_id exista en ERP OK
router.get('/:car_id', function(req, res){
    const { car_id } = req.params;
    
    request( `${url1}/${car_id} `, function(err, body){

        const data = JSON.parse(JSON.stringify(body.body));

        if(!data.car_id) {
            if(car_id == data.car_id) {
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

////--------------------- punto 2 ---------------------

// actualizar codigo segun si existe
router.put('/:card_id', function(req, res){

    const { car_id } = req.params;
    // const { body: car } = req; 
    const card_id_existe = JSON.parse( JSON.stringify( verifcarCardId(url1, car_id) ) );

    if(card_id_existe === 'error') {
        let id_interno = card_id_existe.data._id;
        res.status(200).json({
            data: id_interno,
            message: 'ok'
        });
    } else {
        res.status(200).json({
            data: car_id,
            message: 'error'
        });
    }

    // No se pudo probar
    request({
            url: `https://al3xcr91.pythonanywhere.com/test/api/v1/site-by-id/${id_interno}/`, //URL to hit
            // qs: {from: 'example', time: +new Date()}, //Query string data
            method: 'PUT', // specify the request type
            headers: { // speciyfy the headers
                'Content-Type': 'application/json',
            },
            body: car //Set the body as a string
            }, function(error, response, body){

                const data = JSON.parse(JSON.stringify(body.body));

                if(error) {
                    console.log(error);
                } else {
                    console.log(response.statusCode, body);
                }
            }
    );


});


////--------------------- punto 3 ---------------------

router.get('/meli/:item_id', function(req, res){
    const { item_id } = req.params;
    
    request( `${url3}/${item_id} `, function(err, body){

        const data = JSON.parse(JSON.stringify(body.body));

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
        url: `${url4}/${id_interno}/`, //URL to hit
        // qs: {from: 'example', time: +new Date()}, //Query string data
        method: 'PUT', // specify the request type
        headers: { // speciyfy the headers
            'Content-Type': 'application/json',
        },
        body: car //Set the body as a string
        }, function(error, response, body){

            // const data = JSON.parse(JSON.stringify(body.body));

            if(error) {
                console.log(error);
            } else {
                console.log(response.statusCode, body);
            }
        }
);

});

/// Helpers

const verifcarCardId = (url, car_id) => {
    request( `${url}/${car_id} `, function(err, body){

        const data = JSON.parse(JSON.stringify(body.body));

        if(!data.car_id) {
            if(car_id == data.car_id) {
                return data;
                
            } else {
                return 'error';
            }
        }
    });
}

module.exports = router;