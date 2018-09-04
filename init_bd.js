var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: ".data/db.sqlite3"
    },
    debug: true,
  useNullAsDefault: true
});

async function init() {
  await knex.schema.dropTableIfExists('magistrats');

  await knex.schema.createTable('magistrats', (table) => {
    table.string('idf');
    table.string('nom');
    table.string('prenom');
    table.string('sexe');
    table.string('date_naissance');
    table.string('depart_naissance');
    table.string('fonction');
    table.string('date_installation_poste');
    table.string('grade_magistrat');
  
  });
  
  await knex.destroy();
}
init();