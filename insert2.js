const request = require("request")

let options = {
    url:"http://localhost:9200/real-data/computer",
    method: "POST",
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify({
        name:"ys",
        memUsed: 45,
        cpuUsed: 71,
        processNum:1,
        time: new Date()
    })
}
request(options, function( err, res, body){
    if( err ){
        console.log( err )
    }
    console.log( body )
})

function send(){

    let body = {
        name:"ys",
        memUsed: Math.floor(Math.random()*500),
        cpuUsed: Math.floor(Math.random()*300),
        processNum:Math.floor(Math.random()*100),
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
        }, 20000)
    })


}

send()