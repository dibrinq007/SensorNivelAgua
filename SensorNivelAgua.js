
'use strict';
var connectionString = 'HostName=IoThubCisterna.azure-devices.net;DeviceId=SensorNivelAgua;SharedAccessKey=/8V68e1oan5kOUTE2OqAvKdQoNy14VTDQTfPvslfCJU=';

var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

setInterval(function(){
  var nivelAgua = (Math.random() * 100);
  var descricao;

  if (nivelAgua >= 80)
  {
    descricao = "Cheia";
  }
  else if (nivelAgua >= 61 && nivelAgua <= 79) 
  {
    descricao = "Quase Cheia";
  }   
  else if (nivelAgua >= 31 && nivelAgua <= 60) 
  {
    descricao = "Razoavel";
  } 
  else if (nivelAgua >= 11 && nivelAgua <= 30 ) 
  {
    descricao = "Quase Vazia";
  } 
  else if (nivelAgua <= 10) 
  {
    descricao = "Vazia";
  }  

  var data = JSON.stringify({ nivelAgua: nivelAgua, descricao: descricao});
  var message = new Message(data);

  message.properties.add('nivelAguaAlert', (nivelAgua <= 20) ? 'true' : 'false');
  console.log('Sending message: ' + message.getData());

  client.sendEvent(message, printResultFor('send'));
}, 1000);