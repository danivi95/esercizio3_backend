// Importo le librerie di Knex.js, ovvero un query builder per SQLite
const knex = require("knex");
// Importo le configurazioni dal knexfile
const config = require("./knexfile");
// Utilizzo le configurazioni settate
const db = knex(config.development);
// Query da esportare
module.exports = {
    findAll,
    statistics
}
// Query che ritorna la lista dei record denormalizzati
function findAll() {
    const result_query = db("records")
    .join('workclasses', 'records.workclass_id', 'workclasses.id')
    .join('education_levels', 'records.education_level_id', 'education_levels.id')
    .join('marital_statuses', 'records.marital_status_id', 'marital_statuses.id')
    .join('occupations', 'records.occupation_id', 'occupations.id')
    .join('relationships', 'records.relationship_id', 'relationships.id')
    .join('races', 'records.race_id', 'races.id')
    .join('sexes', 'records.sex_id', 'sexes.id')
    .join('countries', 'records.country_id', 'countries.id')    
    .select('records.*', {workclass: 'workclasses.name'}, {educational_level: 'education_levels.name'}, {marital_status: 'marital_statuses.name'}, {occupation: 'occupations.name'}, {relationship: 'relationships.name'}, {race: 'races.name'}, {sex: 'sexes.name'}, {country: 'countries.name'});
    return result_query;
}
// Query che ritorna le statistiche aggregate
function statistics(aggregationType, aggregationValue) {
    const result_query = db("records")
    .where(aggregationType, aggregationValue)
    .groupBy(aggregationType)
    .select(aggregationType)
    .sum({capital_gain_sum: 'capital_gain'})
    .avg({capital_gain_avg: 'capital_gain'})
    .sum({capital_loss_sum: 'capital_loss'})
    .avg({capital_loss_avg: 'capital_loss'})
    .count({over_50k_count: db.raw('case when over_50k = 1 then 1 else null end')})
    .count({under_50k_count: db.raw('case when over_50k = 0 then 1 else null end')})
    return result_query;
}