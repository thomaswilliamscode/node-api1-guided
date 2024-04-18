// import the server and start it!
const server = require('./api/server.js')

const port = 8000;

server.listen(port, () => {
	console.log(`listening on port: ${port}`);
});