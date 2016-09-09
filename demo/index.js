var express = require('express');
var app = express();
var bodyParser     =         require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var Web3 = require('web3');
var sandboxId = 'f5da1f0398';
var sandboxUrl = 'https://lisha.by.ether.camp:8555/sandbox/' + sandboxId;
var web3 = new Web3(new Web3.providers.HttpProvider(sandboxUrl));
var contractAddress = '0x052ecb441e56e28803008f70daa586959797f937';
require('./abi.js');
console.log(JSON.stringify(contractAbi));
web3.eth.defaultAccount = web3.eth.accounts[0];



var contractObject = web3.eth.contract(contractAbi);
var contractInstance = contractObject.at(contractAddress);
console.log(contractAddress);


app.use(express.static('public'));  //must be done for css and javascript file

app.get('/', function (req, res) {
   res.sendfile("index.html"); // must name "index.html"
   //res.send('Hello World Kitty'); // html
   console.log(contractInstance.getPrice(req.body.type,req.body.SumL));
   var showprice= (contractInstance.getPrice(req.body.type,req.body.SumL));
})

//app.post()

app.post('/',function(req,res){
  var type=req.body.type;
  var SumL=req.body.SumL;
  var price = req.body.price;
  var SubTH = req.body.SubTH;
  var ValTH = req.body.ValTH;
  console.log("Type = "+type+", Summarization Level = "+SumL+",Price ="+price);
  console.log("Submission Threshold = "+SubTH+ ", Value Threshold= "+ValTH);
  console.log("gotcha");
  res.end("yes");
  var type1=req.body.type1;
  var SumL1=req.body.SumL1;
  var number = req.body.number;
  console.log("Type = "+type1+", Summarization Level = "+SumL+",Number of data point ="+number);
   
  console.log("gotcha1");
  
  
  //try to set the Price in Smart contract
  console.log(contractInstance.setPrice(type,SumL,price,SubTH,ValTH));
  console.log(contractInstance.payUser(0,type1,SumL1,number));
 
    
});
app.get('/getBlock', function (req, res) {
   res.send('blockCount: ' + web3.eth.blockNumber);
})

app.get('/setGreeting', function (req, res) {
    contractInstance.setGreeting('Hello BIOTS2016!');
    res.send('set greeting!');
})

app.get('/getGreeting', function (req, res) {
    contractInstance.getGreeting(function(error, response) {
        console.log('greeting: ' + response + ', error: ' + error);
    });
    res.send(contractInstance.getGreeting());
    console.log(contractInstance.getGreeting());
    //res.send('got greeting!');
})

app.get('/getTime', function (req, res) {
    contractInstance.getNumber(function(error, response) {
        console.log('response: ' + response + ', error: ' + error);
    });
    res.send('got time!');
})

var server = app.listen(8080, function () {
  console.log("express server running");
//  console.log('default account: ' + web3.eth.accounts[0])
})



// note: going after sebastian suggestion. comment out 2 line