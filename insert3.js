const request = require("request")

let options = {
    url:"http://localhost:9200/real-data/computer",
    method: "POST",
    headers: {
        "content-type": "application/json",
    },
    body: ""
}
request(options, function( err, res, body){
    if( err ){
        console.log( err )
    }
    console.log( body )
})

function send(){

    let body = {
        name:"jay",
        os: "ubuntu",
        memUsed: Math.floor(Math.random()*1000),
        cpuUsed: Math.floor(Math.random()*800),
        processNum:Math.floor(Math.random()*600),
        time: new Date()
    }
    options.body = JSON.stringify(body)

    request(options, function( err, res, body){
        if( err ){
            console.log( err )
        }
        console.log( body )
        setTimeout( function(){
            send()
        }, 1000)
    })


}

send()