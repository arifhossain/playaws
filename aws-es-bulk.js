var elasticsearch = require("elasticsearch");

function generateFlightData(start, end) {
  var recordsCsv='';
  var k;
  for (k = start; k < end; k++) {
    var flightObj = {
      period: "period" + k,
      airline: "airline" + k,
      airlineiata: "airlineiata" + k,
      geosummary: "geosummary" + k,
      georegion: "georegion" + k,
      terminal: "terminal" + k,
      arrival: "arrival" + k,
      departure: "departure" + k,
      seat: "seat" + k,
      row: "row" + k,
      col: "col" + k,
      price: "price" + k,
      discountprice: "discountprice" + k,
      specialprice: "specialprice" + k,
      passenger_count: k
    };

    var indexObj = {
      index: {
        _index: "sfoflights",
        _type: "flights",
        _id: k
      }
    };

    recordsCsv =
      recordsCsv +
      JSON.stringify(indexObj) + "\n" +
      JSON.stringify(flightObj) + "\n";
  }

  return recordsCsv;
}

async function loadEsData() {
  var client = new elasticsearch.Client({
    host:
    "https://search-snapshot-test-3m6f3ebtkftrtbzkeolf62dani.us-east-2.es.amazonaws.com/",
    log: "info"
  });

  client.ping({ requestTimeout: 30000 }, function(error) {
    if (error) {
      console.error("Failed to connect to elasticsearch!");
    } else {
      console.log("<=================Connected==================>");
    }
  });

  var bulkCount;
  for (bulkCount = 1; bulkCount < 100; bulkCount++) {
    var records = generateFlightData(bulkCount * 100, (bulkCount + 1) * 100);

    client.bulk(
      {
        body: records
      },
      function(error, resp) {
        if (error) {
          console.error(JSON.stringify(error));
        } else {
          console.log("Batch: " + bulkCount + ' - ' + JSON.stringify(resp.took) + ' - ' + resp.errors);
        }
      }
    );

    await sleep(200);
  }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testElasticsearch() {
  var client = new elasticsearch.Client({
    host:
    "https://search-idfp-snapshot-test-njrxfsqsllrw6mcnaovywlk5i4.us-east-1.es.amazonaws.com/",
    log: "info"
  });

  client.ping({ requestTimeout: 30000 }, function(error) {
    if (error) {
      console.error("Failed to connect to elasticsearch!");
    } else {
      console.log("<=================Connected==================>");
    }
  });

  client.search({
    index:'sfoflights'
  }).then(
    function(body) {
      console.log('Total hits: ' + body.hits.hits.length);
    },
    function(error) {
      console.log('Failed!!!');
    }
  );

}

// testElasticsearch();

loadEsData();
