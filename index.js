// Importo le librerie di Express, ovvero un framework che fornisce funzionalità per sviluppare WebApp
const express = require('express');
// Creo un web server
const server = express();
// Configuro la porta. Vado a leggere la variabile d’ambiente PORT e, se c’è un valore definito, allora prende tale valore, altrimenti setta la porta 4000
const port = process.env.PORT || '4000';
// Metto il server in ascolto alla porta precedentemente settata
server.listen(port, () => {
    console.log('Server running on http://localhost:' + port);
});

// Importo le query
const Records = require("./query");

// GET endpoint
server.get("/record-denormalizzati/", (req, res) => {
    Records.findAll()
    .then(records => {
        // Implementazione paginazione
        const page = parseInt(req.query.page);
        const offset = parseInt(req.query.offset);

        const startIndex = (page - 1) * offset;
        const endIndex = page * offset;

        const results = records.slice(startIndex, endIndex);

        // Ritorna i json come risultati
        res.status(200).json(results);
    })
});