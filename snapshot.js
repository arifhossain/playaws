'use strict'
const elasticsearch = require('elasticsearch')

module.exports.handler = async(event, context) => {
    console.log('here here');

    var client = new elasticsearch.Client({
        host:
            "https://search-idfp-snapshot-test-njrxfsqsllrw6mcnaovywlk5i4.us-east-1.es.amazonaws.com/",
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

    return {
        statusCode: 200,
        body: JSON.stringify(resp)
    };
};
