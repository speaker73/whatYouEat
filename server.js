const http = require('http');
const url = require('url');
const static = require('node-static');

const db = require('diskdb');


const public = new static.Server('./public');


db.connect('db', ['restorans', 'start', 'history']);



const server = new http.Server((req, res) => {
	 req.addListener( 'end', function () {
        public.serve( req, res );
    } ).resume();
	 const urlParse = url.parse(req.url, true);
     console.log(req.url,req.method, urlParse);
     //update from db
	 if(urlParse.pathname == '/update' && urlParse.query.message){
	 	console.log(urlParse.query.message);
	 	//db.start.save({restorans:[db.restorans.find().length]});
		db.restorans.save({restorans: urlParse.query.message.split(', ')});
		res.statusCode = 200;
		res.end();
	 }
	 //get from db
	 if(urlParse.pathname == '/restorans'){
	 	const result = {data: db.restorans.find()[db.restorans.find().length - 1].restorans , history:db.history.find()}
	 	res.statusCode = 200;
		res.end(JSON.stringify(result) );
	 }
	 
	//update history
	 if(urlParse.pathname == '/history' && urlParse.query.message){
		console.log(urlParse.query.message);
		db.history.save(JSON.parse(urlParse.query.message) );
	 	res.statusCode = 200;
	 	const result = db.history.find();
	 	res.end(urlParse.query.message + 'is add from db.');
	 }
	//clear hostory
    if(urlParse.pathname == '/clear'){
	 	res.statusCode = 200;
		res.end();
	 }
})

server.listen(8081, '192.168.3.100');