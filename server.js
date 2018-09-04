#!/usr/bin/env node
process.env.UV_THREADPOOL_SIZE = 128;

var express = require('express');
var request = require('request');
var rp      = require('request-promise');
var fs      = require('fs');
var cheerio = require('cheerio');
var nlp     = require('nlp-js-tools-french');


var app = express();


app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/nominations', function(req, res){
  
    var form = {
          champNatureTexte:'DECRET',
          champMots: 'nomination magistrature',
          radioMots: 'MTI'
        };
    
    var numPage = 1; //20 articles par page
    var url = 'https://www.legifrance.gouv.fr/rechTexte.do?reprise=true&page='
    
    var options = {
        method: 'POST',
        uri: url + numPage,
        form: form,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
  
    //Recherche des décrets portant nomination (magistrature)
    // rp(options) lancement de la requete http
    // then : fonction a exécuter en cas de succes
    // $ : page retournée en reponse a la requete
    rp(options).then(function ($) {
                
        // On recupere le nombre d'articles resultat de la recherche
        // (#center h3) titre en rouge sur la page "Résultat de votre recherche : <nbr articles> documents trouves
        // match pour récupérer le nombre seulement à l'aide d'une expression régulière
        var nbArticles = $("#center h3").text().match(/\d+/)[0];
        var nbPages = nbArticles / 20;
            
        for(numPage = 1; numPage < nbPages; numPage++) {
            
            options.uri = url + numPage;
            rp(options).then(function($) {
                
                $('#center').find('a').each(function(i, elem) {
                  
                    if(i % 2 == 0) {
                      
                        options.uri = 'https://www.legifrance.gouv.fr' + $(this).attr('href').substring(2);
                        rp(options).then(function($) {
                          
                            var nom = $(".enteteTexte").text().match(/NOR:  \w{12}/)[0];
                            fs.writeFileSync('nominations/' + nom.substring(0,3) + nom.substring(6), $('.data').text());
                          
                        });
                    }
                });
            });
        }
        res.send("Nb articles : " + nbArticles);
    });
});
  
//npl configurations
app.get('/nlp', function(req, res) {
  
    
    // Noms : Claude Mathon
    var corpus = "Par décret du Président de la République en date du 5 décembre 2001, M. Claude Mathon, procureur de la République près le tribunal de grande instance de Lille, est nommé chef du service central de prévention de la corruption pour une durée de quatre ans.";
  
    var config = {
        tagTypes: ["nom"],
        strictness: true,
        minimumLength: 2
    };
  
    var nlpToolsFr = new nlp(corpus, config);
  
    var tokenizedWords   = nlpToolsFr.tokenized;
    var posTaggedWords   = nlpToolsFr.posTagger();
    var lemmatizedWords  = nlpToolsFr.lemmatizer();
    var stemmedWords     = nlpToolsFr.stemmer();
   
   
  
  
    
    console.log("####### tokenizedWords ###########");
    console.log(tokenizedWords);
    console.log("####### posTaggedWords ###########");
    console.log(posTaggedWords);                        // claude : NOM et mathon : UNK !!!!!!!!!!!!
    console.log("####### lemmatizedWords ###########");
    console.log(lemmatizedWords);
    console.log("####### stemmedWords ###########");
    console.log(stemmedWords);
  
   
   

    res.send("Extraction effectuée");
});



// listen for requests :)
  var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});