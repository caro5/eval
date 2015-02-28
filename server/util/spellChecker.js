var config = require('config');
var request = require('request');

function spellChecker(sentence, callback) {

  if (!sentence) {
    return;
  }
  var options = {
    method: "GET",
    url: generateQuery(sentence),
    headers : {
      "X-Mashape-Key" : config.get('spellcheck'),
      "Accept" : "application/json"
    }
  }
  request(query, function(err, response, body) {
    if (err) {
      console.log('error with spellchecker', err);
    }
    if (!JSON.parse(body).suggestion) {
      console.log(JSON.parse(body));
    }

    callback(JSON.parse(body).suggestion);
  })
}


function generateQuery(sentence) {
  var query = "https://montanaflynn-spellcheck.p.mashape.com/check/?text=";
  var words = sentence.replace(/ /g, "+");

  return query + words;
}

module.exports = spellCheckerController;