var express = require('express');
var app = express();
var firebase = require('firebase');
var request = require('request');

firebase.initializeApp({
  databaseURL: 'https://pwa-test-1362.firebaseio.com/',
  serviceAccount: 'PWA-test-9fb647b6916f.json'
});

app.use('/public', express.static(__dirname + '/public'));


app.get('/', function(req, res){

  var allToken = firebase.database().ref('/token');
  Promise.all([allToken.once('value')]).then(function(resp) {
    var allToken = resp[0].val();
    tokenRep = '';
     Object.keys(allToken).forEach(function(uid) {
       var token = allToken[uid];
       request({
        url: 'https://android.googleapis.com/gcm/send',
        method: 'POST',
        headers: {
          'Content-Type' :' application/json',
          'Authorization': 'key=AIzaSyAmNUGZHF2A-KqHAUXmE4YEbfkrBghznxM',
        },
        body: JSON.stringify(
          {
            "registration_ids" : [token.subscriptionId]
          }
        )
      }, function(error, response, body) {
        if (error) {
          console.error(error, response, body);
        }
        else if (response.statusCode >= 400) {
          console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body);
        }
        else {
          console.log(response);
        }
      });
      });



    res.send(tokenRep);
  }).catch(function(error) {
    console.log('Failed to start weekly top posts emailer:', error);
  });
});

app.listen(3000);
