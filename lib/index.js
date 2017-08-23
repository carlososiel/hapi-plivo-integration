'use strict';

const plivo = require('plivo');

let plivoIntegration = {
    register: function(server, options, next) {
        const api = plivo.RestAPI({
            authId: options.authId,
            authToken: options.authToken
        });

        /**
         * Send a message with plivo API
         * @param to {number} A number of recipient of message. Need include a prefix of country.
         * @param from {number} A number of identify a message sender. If it null, search a from value from options.
         * @param text {string} A text of message sended.
         * @return Emit an event 'plivo-message-sended' with a object of status and response.
         * */
        server.method('sendSMS', function(to, from, text) {
            server.event('plivo-message-sended');
            api.send_message({
                'src': from ? from : options.from,
                'dst': to,
                'text': text
            }, (status, response) => {
                server.emit('plivo-message-sended', {status: status, response: response});
            })
        });

        /**
         * Create a call and emit a server event.
         * @param to {number} A number of receive a call.
         * @param from {number} A number that identify to a caller. If it null, search a from value in options.
         * @param url {string} A url when the call is connected, make something using a xml of response.
         * @param method {string} A HTTP method to call a previous url.
         * @return Emit an evento 'plivo-call-created' with a object of status and response.
         * */
        server.method('createCall', function(to, from, url, method) {
            server.event('plivo-call-created');
            api.create_call({
                to: to,
                from: from ? from : options.from,
                answer_url: url,
                answer_method: method
            }, (status, response) => {
                server.emit('plivo-call-created', {status: status, response: response});
            });
        });

        /**
         * Create a route to send a message using POST http method.
         * @param to {number} A number of recipient of message. Need include a prefix of country.
         * @param from {number} A number of identify a message sender. If it null, search a from value from options.
         * @param text {string} A text of message sended.
         * @return Return an object of reponse of operation.
         * */
        server.route({
            method: 'POST',
            path: '/plivo/sms',
            handler: (request, reply) => {
                api.send_message({
                    'src': request.payload.from ? request.payload.from : options.from,
                    'dst': request.payload.to,
                    'text': request.payload.text
                }, function(status, response) {
                    reply({status: status, response: response});
                });
            }
        });

        /**
         * Create a xml for a call response.
         * @param From {number} A number of call received.
         * @return A xml output.
         * */
        server.route({
            method: 'GET',
            path: '/plivo/call',
            handler: (request, reply) => {
                console.log(request.query.From);
                let response = plivo.Response();
                let dial = response.addDial();
                dial.addNumber('+' + request.query.From);
                let xml = response.toXML();
                reply(xml).header('Content-type', 'text/xml');
            }
        });

        next();
    }
};

plivoIntegration.register.attributes = {
    name: 'Plivo Integration',
    version: '0.0.1'
};

module.exports = plivoIntegration;