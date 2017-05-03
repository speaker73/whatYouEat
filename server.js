const http = require('http');
const host = {ip:'192.168.3.100', port:'8081'};
const url = require('url');
const static = require('node-static');
const request = require('request');
const db = require('diskdb');
const api_sett = {
					cor :'49.2253923,28.4327571',
					radius: 1000
				};

const api = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+api_sett.cor+'&radius='+api_sett.radius+'&type=food&key=AIzaSyCUu54aauFTD23tnuFVV1xk0H29ry191GE';

const public = new static.Server('./public');


db.connect('db', ['restorans', 'start', 'history', 'api']);


console.log('start: ' + host.ip+':'+host.port, 'gApi:' ,api);
db.api.remove({name:'one'});
request(api, (err, response, body)=>{
	//console.log(err, response, body);
	db.api.save({name:'one',err:err, response:response, body:body});
});
const server = new http.Server((req, res) => {
	 req.addListener( 'end', function () {
        public.serve( req, res );
    } ).resume();
	 const urlParse = url.parse(req.url, true);
     //console.log(req.url,req.method, urlParse);
     //update from db

	 if(urlParse.pathname == '/update' && urlParse.query.message){
	 	//console.log(urlParse.query.message);
	 	//db.start.save({restorans:[db.restorans.find().length]});
		db.restorans.save({restorans: urlParse.query.message.split(', ')});
		res.statusCode = 200;
		res.end();
	 }
	 //get from db
	 if(urlParse.pathname == '/restorans'){
	 	/*gPLaces = request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=AIzaSyCUu54aauFTD23tnuFVV1xk0H29ry191GE', 
	 						(err, response, body)=> {
	 							let arr = []; 
	 							JSON.parse(body).results.forEach((object)=>{
	 								arr.push(object.formatted_address);
	 							});
	 						
	 							return arr;
	 						});
	 	*/
	 	//req.pipe(gPLaces).pipe(res);
	 	//console.log('>>.',req, res);
			const result = {data: db.restorans.find()[db.restorans.find().length - 1].restorans , history:db.history.find()};
			res.statusCode = 200;
			res.end(JSON.stringify(result) );	 	
	 	
	 }
	 
	//update history
	 if(urlParse.pathname == '/history' && urlParse.query.message){
		//console.log(urlParse.query.message);
		db.history.save(JSON.parse(urlParse.query.message) );
	 	res.statusCode = 200;
	 	const result = db.history.find();
	 	res.end(urlParse.query.message + 'is add from db.');
	 }
	//clear history
    if(urlParse.pathname == '/clear'){
	 	res.statusCode = 200;
		res.end();
	 }
	if(urlParse.pathname == '/gApi'){
    	const api = db.api.find();
    	res.statusCode = 200;
    	res.end(JSON.stringify(api) ) ;
	}
})

server.listen(host.port, host.ip);


