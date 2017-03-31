const http = require('http');
const url = require('url');
const static = require('node-static');

const db = require('diskdb');


const public = new static.Server('./public');


db.connect('db', ['restorans', 'start']);



const server = new http.Server((req, res) => {
	 req.addListener( 'end', function () {
        public.serve( req, res );
    } ).resume();
	 const urlParse = url.parse(req.url, true);
     console.log(req.url,req.method, urlParse);
     //update from db
	 if(urlParse.pathname == '/update' && urlParse.query.message){
	 	console.log(urlParse.query.message);
	 	db.start.save(db.restorans.find().length);
		db.restorans.save([urlParse.query.message.split(', ')]);
		res.statusCode = 200;
		res.end();
	 }
	 //get from db
	 if(urlParse.pathname == '/restorans'){
	 	const result = db.restorans.find().slice(db.start.find()[db.start.find().length - 1]||0)
	 	console.log(result, db.start.find());
	 	res.statusCode = 200;
		res.end(JSON.stringify(result) );
	 }
})

server.listen(8081, '192.168.3.100');