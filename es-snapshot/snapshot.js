'use strict'
const elasticsearch = require('elasticsearch')

module.exports.handler = async(event, context) => {
    console.log('here here');

    var client = new elasticsearch.Client({
        host:
        "https://search-snapshot-test-3m6f3ebtkftrtbzkeolf62dani.us-east-2.es.amazonaws.com/",
        log: "info"
      });
 

    var resp = await client.search({
        index:'sfoflights',
        q:'period311*'
      }).then(
        function(body) {
          console.log('Total hits: ' + body.hits.hits.length);
        },
        function(error) {
          console.log('Failed!!!');
        }
      );

    var resp2 = await client.snapshot.getRepository({
      repository:'es-snapshot-repo',
      format:'human'
    })
        .then(
          function(body) {
            console.log(JSON.stringify(body));
          },
          function(error) {
            console.error(error);
          }
        );

    return {
        statusCode: 200,
        body: JSON.stringify(resp2)
    };
};
