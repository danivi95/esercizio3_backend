// Importo le librerie di Express, ovvero un framework che fornisce funzionalità per sviluppare WebApp
const express = require('express');
// Importo le query
const Records = require("./query");
// Importo Json2csv che permette di convertire JSON in CSV
const Json2csvParser = require('json2csv').Parser;

// Creo un web server
const server = express();
// Configuro la porta. Vado a leggere la variabile d’ambiente PORT e, se c’è un valore definito, allora prende tale valore, altrimenti setta la porta 4000
const port = process.env.PORT || '4000';
// Metto il server in ascolto alla porta precedentemente settata
server.listen(port, () => {
    console.log('Server running on http://localhost:' + port);
});

// GET endpoint per il path iniziale
server.get('/', (req, res) => {
    // Mostro la pagina index.html
    res.sendFile(__dirname + '/index.html');
});

// GET endpoint per la lista dei record denormalizzati
server.get("/record-denormalizzati/", (req, res) => {
    Records.findAll()
    .then(records => {
        // Implementazione paginazione
        const page = parseInt(req.query.page);
        const offset = parseInt(req.query.offset);

        const startIndex = (page - 1) * offset;
        const endIndex = page * offset;

        // Ritorna la copia di una porzione dell'array contenente gli elementi compresi tra startIndex e endIndex (escluso)
        const results = records.slice(startIndex, endIndex);

        // Ritorna i json come risultati
        res.status(200).json(results);
    })
});

// GET endpoint per il download della lista dei record denormalizzati
server.get("/download/", (req, res) => {
    Records.findAll()
    .then(records => {
        // Converto i record JavaScript in una stringa JSON
        const jsonRecords = JSON.parse(JSON.stringify(records));
        // Definisco i campi del file CSV
        const csvFields = ['ID', 'Age', 'Workclass_ID', 'Education_level_ID', 
        'Education_num', 'Marital_status_ID', 'Occupation_ID', 'Race_id', 'Sex_ID', 
        'Capital_gain', 'Capital_loss', 'Hours_week', 'Country_ID', 'Over_50k', 'Workclass', 
        'Educational_level', 'Marital_status', 'Occupation', 'Relationship', 'Race', 'Sex', 'Country'];
        // Creo un nuovo oggetto Json2csvParser passandogli i campi
        const json2csvParser = new Json2csvParser({ csvFields });
        // Converto i records in formato CSV
        const csvData = json2csvParser.parse(jsonRecords);
        // Setto l'header HTTP
        res.setHeader('Content-disposition', 'attachment; filename=records.csv');
        res.set('Content-Type', 'text/csv');
        // Effettuo il download del file CSV
        res.status(200).end(csvData);
    })
});

// GET endpoint per le statistiche aggregate
server.get("/statistiche", (req, res) => {
    // Catturo i parametri di query dell'url
    var queryParameter = req.query;
    // Estraggo chiave e valore
    var keys = Object.keys(queryParameter);
    var values = Object.values(queryParameter);
    var aggregationType = keys[0];
    var aggregationValue = values[0];
    // Passo i parametri utili a filtrare le statistiche
    Records.statistics(aggregationType, aggregationValue)
    .then(records => {
        // Ritorna i json come risultati
        res.status(200).json(records);
    })    
});