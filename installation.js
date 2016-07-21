// ************************************************

// NEXUS Node Server
//				Jesse Allison (2015)
//
//	To Launch:
//		NODE_ENV=production sudo node nexus-server.js
//		(sudo is required to launch on port 80.)

// ************************************************


// Setup web app - using express to serve pages
var express = require('express'),
	sio = require('socket.io'),
	http = require('http');

var app = express();

// set up express web application
app.use(express.static(__dirname + '/app/m'));

// FIXME: probably don't need this
// app.get('/', function (req, res) {
// 	res.send('hello');
// });


// server is the node server (web app via express)
// this code launches the server on port 80 and switches the user id away from sudo
// apparently this makes it more secure - if something goes awry it isn't running under the superuser.
var server = http.createServer(app)
	.listen(8001, function(err) {
		if (err) return cb(err);

		// Find out which user used sudo through the environment variable
		var uid = parseInt(process.env.SUDO_UID);
		// Set our server's uid to that user
		if (uid) process.setuid(uid);
		console.log('Server\'s UID is now ' + process.getuid());
	});

		// start socket.io listening on the server
var io = sio.listen(server);


// *********************
	// Global Variables!

var ioClients = [];		// list of clients who have logged in.
var ioTheaters = [];
var currentSection = 0;		// current section.
var theaterID;
var conrollerID;
var audioControllerID;


// *********************

	// Respond to web sockets with socket.on
io.sockets.on('connection', function (socket) {
	var ioClientCounter = 0;		// Can I move this outside into global vars?

	socket.on('addme', function(data) {
		username = data.name;
		var userColor = data.color;
		var userNote = data.note;
		var userLocation = data.location;

		if(username == "theater"){
			theaterID = socket.id;
			// ioTheaters.push(socket.id);
			console.log("Hello Theater: " + theaterID);
		}

		if(username == "controller"){
			controllerID = socket.id;
			console.log("Hello Controller: " + controllerID);
		}
		
		if(username == "audio_controller"){
			audioControllerID = socket.id;
			console.log("Hello Audio Controller: " + audioControllerID);
		}

		if(username == "a_user") {
			ioClients.push(socket.id);
		}

		socket.username = username;  // allows the username to be retrieved anytime the socket is used
		// Can add any other pertinent details to the socket to be retrieved later
		socket.userLocation = userLocation;
		socket.userColor = userColor;
		socket.userNote = userNote;
		// .emit to send message back to caller.
		socket.emit('chat', 'SERVER: You have connected. Hello: ' + username + " " + socket.id + 'Color: ' + socket.userColor);
		// .broadcast to send message to all sockets.
		//socket.broadcast.emit('chat', 'SERVER: A new user has connected: ' + username + " " + socket.id + 'Color: ' + socket.userColor);
		// socket.emit('bump', socket.username, "::dude::");
		var title = getSection(currentSection);
		
		if(username == "a_user") {
			// console.log("Hello:", socket.username, "currentSection:", currentSection, "id:", socket.id, "userColor:", socket.userColor, "userLocation:", socket.userLocation, "userNote:", socket.userNote);
		}

		socket.emit('setSection', {sect: currentSection, title: title});
		// io.sockets.emit('setSection', {sect: sect, title: title});
		if(username == "a_user") {
			if(audioControllerID) {
					io.to(audioControllerID).emit('/causeway/registerUser', {id: socket.id, color: socket.userColor, locationX: socket.userLocation[0], locationY: socket.userLocation[1], note: socket.userNote}, 1);
				// console.log("Added New User", {id: socket.id, color: socket.userColor, locationX: socket.userLocation[0], locationY: socket.userLocation[1], note: socket.userNote});
	    }
		}
	});

	 socket.on('disconnect', function() {
		// ioClients.remove(socket.id);	// FIXME: Remove client if they leave
		io.sockets.emit('chat', 'SERVER: ' + socket.id + ' has left the building');
	 });

	 socket.on('sendchat', function(data) {
		// Transmit to everyone who is connected //
		io.sockets.emit('chat', socket.username, data);
	 });

	socket.on('tap', function(data) {
		// console.log("Data: ", data.inspect);
		socket.broadcast.emit('tapped', socket.username, 1);
	});

	socket.on('shareToggle', function(data) {
		socket.broadcast.emit('setSharedToggle', data);
	});

	socket.on('location', function(data) {
		if(data) {
			// send location somewhere?
		}
	});

	socket.on('item' , function(data) {
		console.log(socket.id + " tapped item: " + data);
		// TODO: Take out all the socket.broadcast.emits.
		// socket.broadcast.emit('chat', socket.id + " : " + data, 1);

	    if(theaterID) {
			// io.to(theaterID).emit('itemback', {phrase: data, color: socket.userColor}, 1);
			io.sockets.emit('itemback', {phrase: data, color: socket.userColor}, 1);
	    }
		// socket.broadcast.emit('itemback', {phrase: data, color: socket.userColor}, 1);
		if(audioControllerID) {
			io.to(audioControllerID).emit('/causeway/phrase/number', {id: socket.id, item: data}, 1);
				// console.log("Item", data);
    }
	});

	socket.on('triggerCauseway', function(data) {
		if(audioControllerID) {
				io.to(audioControllerID).emit('/causeway/triggerCauseway', {id: socket.id}, 1);
    }
	});

	socket.on('triggerPitch', function(data) {
		if(audioControllerID) {
        io.to(audioControllerID).emit('/causeway/triggerPitch', {id: socket.id}, 1);
    }
	});


	// Return random user name
	socket.on('getSomebody', function(data) {
		console.log("Get Somebody! ");

		var user = getNextUser();
					// Make sure you don't get yourself
		if(user.username == socket.username || user.username === null) {
			user = getNextUser();
			if(user.username == socket.username || user.username === null) {
				socket.emit("somebodyToYou","Somebody");
			}
		} else {
			socket.emit("somebodyToYou",user.username);
		}
	});


	socket.on('section', function(data) {
		// console.log("Section is now: "+ data);
		currentSection = data;
		sendSection(currentSection);
	});

	// *********************
			// Functions for handling stuff

			// **** SECTIONS ****
	var sectionTitles = ["Welcome", "Preface", "Section 1", "Section 2", "Section 3", 
		"Section 4", "Section 5", "Section 6", "Section 7", "Section 8", "Section 9", 
		"Section 10", "Section 11", "Section 12", "Section 13", "Section 14", "Section 15",  
		"Section 16", "Section 17", "Section 18", "Section 19", "Section 20", "Section 21", 
		"Section 22", "Section 23", "Section 24", "Section 25", "Section 26", "Section 27", 
		"Section 28", "Section 29", "Section 30", "Section 31", "Section 32", "Section 33", 
		"End"];

	// Todo: Add sections to correspond to organ interactions
	// sendSection(currentSection);	 // Sets everyone's section
	sendSection = function (sect) {
		var title = getSection(sect);
		io.sockets.emit('setSection', {sect: sect, title: title});
		if(audioControllerID) {
				io.to(audioControllerID).emit('/causeway/currentSection', {section: sect, title: title}, 1);
				// console.log("Section sent", sect);
    }

	};

		// Section shared from Max to UIs
	shareSection = function(sect) {
		var title = getSection(sect);
		io.sockets.emit('setSection', sect, title);
	};

	getSection = function(sect) {
		var title = "none";
		
		if(sect == 'w'){
			title = sectionTitles[0];
		} 

		if(sect == 'e'){
			title = sectionTitles[35];
		} 

		if(sect !== 'e' && sect !== 'w') {
			sect++;
			title = sectionTitles[sect];
		} 
		
		return title;
	};

	// pick a random user from those still connected and return the user
	getRandomUser = function() {
		var randomUser = Math.floor(Math.random() * ioClients.length);
		var user = io.sockets.socket(ioClients[randomUser]);
		return user;
	};

	getNextUser = function() {
		// console.log("ioClients Length: ", ioClients.length);
		// console.log("io.sockets.socket length: ", io.sockets.socket.length);
		var user = io.sockets.socket(ioClients[ioClientCounter]);
		ioClientCounter = ioClientCounter + 1;
		if (ioClientCounter >= ioClients.length) {
			ioClientCounter = 0;
		}
		// console.log("Username ", user.username);

		return user;
	};

});

function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
	    color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

