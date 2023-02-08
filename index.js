#!/usr/bin/env node
//#!/bin/node

const http = require('http');
const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'abascal';
let db;
let collection;

async function dbConnect() {
  await client.connect();
  console.log('Connected successfully to server');
  db = client.db(dbName);

  return 'Connected to MongoDB database';
}

dbConnect()
  .then(console.log)
  .catch(console.error);

http.createServer(function(request, response) {
	console.log("Alguien se conecta");
	collection = db.collection('characters');
	
	collection.find({}).toArray()
		.then(query => {
			console.log(query);

			let charactersName = [];

			for (let i = 0; i < 4; i++) {
				charactersName.push(query[i].name);
			}

			response.write(JSON.stringify(charactersName));
			response.end();
		});

}).listen(8080);

