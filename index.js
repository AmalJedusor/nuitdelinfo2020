var express = require("express");
const path = require('path');
const fetch=require('node-fetch')

const uri = require ('./database/variables.js')

var app = express();

//data
var countProducts = {};
var countCities = {};
var countSpots = {};
var frequentation_baigneurs = 0;
var frequentation_pratiquants =0;
var frequentation_bateaux = 0;
//data
app.use(express.static('views'));

app.use(express.urlencoded({
  extended: true
}))
app.get('/index', async function(req,res) {
    res.sendFile('./views/index.html', { root: __dirname });
});
app.get('/', async function(req,res) {
    res.sendFile('./views/index.html', { root: __dirname });
});
app.get('/formulaire', async function(req,res) {
    res.sendFile('./views/formulaire.html', { root: __dirname });
});

app.get('/stats', async function(req,res) {
    res.sendFile('./views/statistiques.html', { root: __dirname });
});
app.get('/services', async function(req,res) {
    res.sendFile('./views/services.html', { root: __dirname });
});

app.post('/submit', async function(req,res) {
  const city = req.body.city;
  const spot = req.body.spot;
  const pollution = req.body.pollution;
  const date = req.body.date;
  const start = req.body.start;
  const end = req.body.end;
  const baigneurs = req.body.baigneurs;
  const pratiquants = req.body.pratiquants;
  const bateaux = req.body.bateaux;
  const products = req.body.products;
  console.log(products);

  if (products == null){
    products = ["Peinture"];
  }

  sendData(city,spot,pollution,date,start,end,baigneurs,pratiquants,bateaux,products);
setTimeout(function(){ }, 11000);
  res.redirect('/index');

});
app.listen(4444);
console.log('Express server started');

app.get('/Data',  function(req, res) {
      // Get your data from your database
      const MongoClient = require('mongodb').MongoClient;
      const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
      const collection = client.db("Confined_Project").collection("Avis").find({}).toArray(function(err, result) {
        if (err) throw err;
        result.forEach(function(item) {
          // récupération des chiffres
        countCities[item.ville] = (countCities[item.ville]||0) + 1;
        countSpots[item.spot] = (countSpots[item.spot]||0) + 1;
        frequentation_baigneurs += item.frequentation_baigneurs;
        frequentation_pratiquants += item.frequentation_pratiquants;
        frequentation_bateaux +=  item.frequentation_bateaux;
      item.produits.forEach(function(i) { countProducts[i] = (countProducts[i]||0) + 1;});

      });
         let data =  { 'countCities' :countCities, 'countSpots' :countSpots, 'countProducts' : countProducts,'freq_baigneurs' :frequentation_baigneurs,
         'freq_pratiquants':frequentation_pratiquants, 'freq_bateaux' : frequentation_bateaux } ;
        client.close();
        console.log("envoi des infos");
        console.log(data);
          res.send(data);
      });
      });
  });

function sendData(city,spot,pollution,date,start,end,baigneurs,pratiquants,bateaux,products ) {
  const MongoClient = require('mongodb').MongoClient;
  const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  if (err) throw err;
  var myobj = { ville: city, spot: spot, pollution: pollution,
     date: date, heure_debut : start, heure_fin :end, frequentation_baigneurs : baigneurs,
      frequentation_pratiquants : pratiquants, frequentation_bateaux : bateaux , produits : products  };
    const collection = client.db("Confined_Project").collection("Avis").insertOne(myobj, function(err, res) {

    console.log("1 document inserted");

  });
      client.close();
        });
}
