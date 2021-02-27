// Importo le librerie di knex
const knex = require("knex");
// Importo le configurazioni dal knexfile
const config = require("./knexfile");
// Utilizzo le configurazioni settate
const db = knex(config.development);
// Query da esportare
module.exports = {
    findAll
}

function findAll() {
    return db("records");
}