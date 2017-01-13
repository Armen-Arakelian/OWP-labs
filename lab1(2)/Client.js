const net = require('net');

console.log("Write needed host and port,please...")
const stdin = process.openStdin();
const connectionOptions = {
    host: undefined,
    port: undefined
};
var i = 0;
let client;

const stdinDataListener = function(data) {

    let str = data.toString().trim();
    switch(i){
        case (0):
            console.log("Host is: " + str);
            connectionOptions.host = str;
            i++;
            break;
        case (1):
            console.log("Port is: " + str);
            connectionOptions.port = str;
            connectToServer(connectionOptions);
            i++;
            break;
        default:
            processClientInput(data);
            break;
    }
};

function connectToServer(data) {
    client = net.connect(connectionOptions);
    console.log('connected to server!');
    client.write('Hello world!\r\n');
    client.on('data', (data) => {
        console.log("Server: " + data.toString());
    });
    // when client disconnected
    client.on('end', () => {
        console.log('disconnected from server');
        stdin.removeListener('data', stdinDataListener);  // unsubscribe
        stdin.destroy();  // close stdin
    });
}

function processClientInput(data) {
    let str = data.toString().trim();
    console.log("You entered: " + str);
    switch (str) {
        case "q":
            client.end();  // disconnect client from server
            break;
        default:
            client.write(str);  // send input string to server
            break;
    }
}

// send data to server
stdin.addListener('data', stdinDataListener);
















