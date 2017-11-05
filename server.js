var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var teCal = require("./calendar-const");
var app = express();

app.get('/scrape', function(req, res) {
    // Let's scrape Anchorman 2
    let url = 'http://telugu.panchangam.org/';

    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            //var month, release, rating;
            var json = { month: "", paksham: "", thithi: "", nakshtram: "", rahukalam: "" };

            const uuidv1 = require('uuid/v1');
            var uid = uuidv1()
            var responseMessage = {
                "uid": `urn:uuid:${uid}`,
                "updateDate": new Date(),
                "titleText": "sobodayam, ee rooju panchangham vivaraalu.",
                "mainText": "",
                //"streamUrl": "https://developer.amazon.com/public/community/blog/myaudiofile.mp3",
            }

            $('div .table-responsive tbody tr').filter(function() {
                var data = $(this);

                //console.log(data.length);
                if (data.children().first().text().trim().startsWith("Month")) {
                    json.month = data.children().first().next().text().trim();
                    json.month = ` ${teCal.teluguMonths[json.month]} maasamu`
                    console.log(json.month)
                }

                if (data.children().first().text().trim().startsWith("Paksham")) {
                    json.paksham = data.children().first().next().text().trim();
                    json.paksham = `${teCal.teluguPaksham[json.paksham]} pakshamu`
                    console.log(json.paksham)
                }

                if (data.children().first().text().trim().startsWith("Tithi")) {
                    json.thithi = data.children().first().next().text().trim();
                    json.thithi = json.thithi.split(" ")[0];
                    console.log(json.thithi)
                    json.thithi = `thidi ${teCal.teluguThithi[json.thithi]}`
                }

                if (data.children().first().text().trim().startsWith("Nakshatram")) {
                    json.nakshtram = data.children().first().next().text().trim();
                    json.nakshtram = json.nakshtram.split(" ")[0];
                    console.log(json.nakshtram)
                    json.nakshtram = `nakshatram ${teCal.teluguNakshtralu[json.nakshtram]}`
                }

                // if (data.children().first().text().trim().startsWith("Rahukalam")) {
                //     json.rahukalam = data.children().first().next().text().trim();
                // }

                responseMessage.mainText = `${json.month}, ${json.paksham}, ${json.thithi}, ${json.nakshtram}`
            })

            // $('.ratingValue').filter(function() {
            //     var data = $(this);
            //     rating = data.text().trim();

            //     json.rating = rating;
            // })
        }

        // fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
        //     console.log('File successfully written! - Check your project directory for the output.json file');
        // })
        res.contentType = "application/json"
        res.send(responseMessage);
        res.end()
            //res.send('Check your console!')
    })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;