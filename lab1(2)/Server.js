var net = require('net');
const fs = require('fs');
const filename = 'persons.json';
var persons;
var clients=0;
var addrClients = new Array (10);

function read(filename){
    return new Promise(function(resolve,reject){
        fs.readFile(filename, (err, buf) => {
            if (err){
                reject(String(err));
            } else{
                resolve(String(buf).trim());
    }
    });
    });
}
read(filename)
    .then(data => {
    persons = JSON.parse(data.toString().trim());
})
.catch(data => {
    console.log(String(data));
})

function filterbyIq(){
    var n = 10;
    for (var i = 0; i < n; i++)
    { var p = persons[ i ], j = i-1;
        while (j >= 0 && persons[j].iq > p.iq)
        { persons[j+1] = persons[j]; j--; }
        persons[j+1] = p;
    }
    return persons;
}

var server = net.createServer(function(connection) {
    console.log('client %s:%s connected', connection.remoteAddress, connection.remotePort);
    clients++;
    addrClients[clients]=(connection.remoteAddress+" "+connection.remotePort);


    connection.on("data", data => {
        console.log(String(data));
    switch (String(data)) {
        case "getJson"://get Json
            connection.write(JSON.stringify(persons, null, '\t'));
            break;
        case "getJsonIq":
            connection.write(JSON.stringify(filterbyIq(),null, '\t'));
            break;
        case "getClientsAmount"://get Json filtered by year
            connection.write(String(clients));
            break;
        case "getClients"://get Json filtered by year
            for(var i=1;i<=clients;i++){
                connection.write(addrClients[i]);
            }
            break;
    }
});

    connection.on('end', function() {
        console.log('client disconnected');
        for(var i = 1;i<=clients;i++){
            if (addrClients[i]==(connection.remoteAddress+" "+connection.remotePort)){
                for (var j = i+1; j<=clients;j++){
                    addrClients[i] = addrClients[j];
                }
            }
        }
        clients--;

    });

    connection.write('Hello World!\r\n');  // send message to client

    connection.pipe(connection);
});
server.listen(8000, function() {
    console.log('server is listening');
});
