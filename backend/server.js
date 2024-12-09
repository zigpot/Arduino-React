const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const {SerialPort} = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const port = new SerialPort({path: '/dev/ttyACM0',  baudRate: 9600 }); // Replace with your port
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (data) => {
    /*const parts = data.split('\t'); // Split into ["sensor = 1023", " output = 255"]
    /*const sensorValue = parseInt(parts[0].split('=')[1].trim(), 10); // Extract "1023"
    const outputValue = parseInt(parts[1].split('=')[1].trim(), 10); // Extract "255"

    const jsonObject = {
        sensor: sensorValue,
        output: outputValue,
    };//*/
    const jsonObject = data;

    console.log(data); // { sensor: 1023, output: 255 }
    io.emit('sensor-data', jsonObject); // Send JSON to the client
});


server.listen(3001, () => console.log('Server running on http://localhost:3001'));

