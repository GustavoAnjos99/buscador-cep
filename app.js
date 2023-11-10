const express = require('express')
const app = express()
const handlebars = require("express-handlebars").engine;
const bodyParser = require("body-parser");
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const Correios = require('node-correios');
const correios = new Correios();

const serviceAccount = require('./fir-api-4ac0f-firebase-adminsdk-5phg5-78406a983e.json');

initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore()

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.get("/", function(req,res){
    res.render("home");
})
 
let infoCep = []
app.post("/cadastrar", function(req, res){
    correios.consultaCEP({ cep: req.body.cep })
    .then(result => {
        infoCep.push(result);
        db.collection('cadastros').add({
            cep: req.body.cep,
            result
        }).then(function(){
            console.log('Registro adicionado');
        })
        res.render("home", {result});
        console.log(infoCep);
    })
    .catch(error => {
        console.log(error);
    });

   
})



app.listen(8081, function(){
    console.log("SERVIDOR RODANDO!");
})