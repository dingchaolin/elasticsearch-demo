const request = require("request")

let options = {
    url:"http://localhost:9200/real-data/computer/vHqOeWEBLh3mjcSppBjc",
    method: "DELETE"
}
request(options, function( err, res, body){
    if( err ){
        console.log( err )
    }
    console.log( body )
})