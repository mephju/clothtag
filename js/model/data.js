//url: db.f4.htw-berlin.de:5432:require
//db: _s0541224__clothtagdb
//user: _s0541224__clothtagdb_generic
//pass: clothtag
//
//
var pg = require('pg')

var connectionString = 'postgres://_s0541224__clothtagdb_generic:clothtag@db.f4.htw-berlin.de:5432/_s0541224__clothtagdb'

client = new pg.Client(connectionString);
client.connect();

query = client.query('SELECT * FROM image');

console.log(query)

query.on('row', function(row) { console.log(row)})
query.on('end', function() { client.end(); })
