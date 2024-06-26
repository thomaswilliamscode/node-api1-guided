// IMPORTS AT THE TOP
const express = require('express');
const Dogs = require('./dog-model.js')

// INSTANCE OF EXPRESS APP
const server = express();

// GLOBAL MIDDLEWARE
server.use(express.json())

// ENDPOINTS

// [GET]    /             (Hello World endpoint)
server.get('/', (req, res) => {
	res.send('Hello World!');
});

// [GET]    /api/dogs     (R of CRUD, fetch all dogs)
server.get('/api/dogs', async (req, res) => {
	try {
		const dogs = await Dogs.findAll()
		res.status(200).json(dogs)
	} catch (err) {
		res.status(500).json({message: `Something Horrible: ${err.message}`})
	}
});

// [GET]    /api/dogs/:id (R of CRUD, fetch dog by :id)
server.get( '/api/dogs/:id', async ( req, res ) => {
	try {
		const { id } = req.params;
		const dog = await Dogs.findById(id)
		if (!dog) {
			res.status(404).json({message: `No Dog with id: ${id} Found`})
		} else {
			res.status(200).json(dog);
		}
		
	} catch (err) {
		res.status(500).json({message: `Error Fetching dog ${req.params.id}: ${err.message}`})
	}
})

// [POST]   /api/dogs     (C of CRUD, create new dog from JSON payload)
server.post( '/api/dogs', async ( req, res ) => {
	try {
		const { body } = req
		const newDog = await Dogs.create(body)
		res.status(200).json(newDog)
	} catch ( err ) {
		res
			.status(500)
			.json({ message: `Error Creating dog ${req.body.name}: ${err.message}` });
	}
} )

// [PUT]    /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)

server.put( '/api/dogs/:id', ( req, res ) => {
	Dogs.update(req.params.id, req.body)
		.then( (dog) => {
			if (dog) {
				res.status(200).json(dog)
			} else {
				res.status(404).json({message: `Dog with id: ${req.params.id} not found`})
			}
			
		})
		.catch( (err) => {
			res.status(500).json({message: `Error updating Dog ${req.body.name}: ${err.message}`})
		})
})

// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)
server.delete( '/api/dogs/:id', (req, res) => {
	Dogs.delete(req.params.id)
		.then( (dog) => {
			if (dog) {
				res.status(200).json(dog)
			} else {
				res.status(404).json({message: `error dog with id ${req.params.id} not found`})
			}
		})
		.catch( (err) => {
			res.status(500).json({message: `Server error: ${err.message}`})
		})
} )

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server