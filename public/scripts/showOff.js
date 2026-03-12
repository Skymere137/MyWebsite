const express = require('express')
const { MessagingResponse } = require('twilio').twiml;


const app = express();

app.post('/sms', (req, res) => {
    const twiml = new Messaging_response();

    twiml.message('Annie Is A Goddess!!!')

    res.type('text/xml').send(twiml.toString());
});

app.listen(3000, () => {
    console.log('Express server listening on port 3000')
})