const request = require("request")

let options = {
    url:"http://localhost:9200/real-data/computer",
    method: "POST",
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify({
        name:"dingchaolin",
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
        name:"dingchaolin",
        memUsed: Math.floor(Math.random()*600),
        cpuUsed: Math.floor(Math.random()*200),
        processNum:Math.floor(Math.random()*400),
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
        }, 30000)
    })


}

send()