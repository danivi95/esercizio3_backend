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