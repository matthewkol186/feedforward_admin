"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
var async = require('async');


// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cs142password = require('cs142password');
var multer = require('multer');
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');

var fs = require("fs");

var app = express();

// XXX - Your submission should work without this line
//var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

var curTime = new Date();
var inADay = new Date();
inADay.setTime(curTime.getTime() + 30 * 60 * 1000);
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false, cookie: {expires: inADay}}));
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.count({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/loggedin - Return all the User object.
 */
app.get('/user/loggedin', function (request, response) {
	console.log('/user/loggedin called!');
	if(request.session.user_id && request.session.login_name) {
		User.findOne({'login_name': request.session.login_name}, '_id first_name', function(err, user) {
      if (!user) {
				// Query didn't return an error but didn't find the specific user object
				response.status(400).send('We could not find a user with login name '+request.session.login_name+' in our database.');
				return;
			} else {
				// Return the user
				console.log('User with id ', user._id);
				response.status(200).end(JSON.stringify(user));
			}
    });
	} else {
		response.status(200).send(JSON.stringify({notLoggedIn: true}));
	}
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
	if(request.session.user_id && request.session.login_name) {
    //response.status(200).send(cs142models.userListModel());
    console.log('/user/list called');
    User.find({}, '_id first_name last_name most_recent_action', function (err, info) {
			if (err) {
				// Query returned an error.  We pass it back to the browser with an Internal Service
				// Error (500) error code.
				console.error('Doing /user/list error:', err);
				response.status(500).send(JSON.stringify(err));
				return;
			} else if (info.length === 0) {
				// Query didn't return an error but didn't find the User object - This
				// is also an internal error return.
				response.status(500).send('Missing User');
				return;
			}
			
			// extra credit
			var userList = JSON.parse(JSON.stringify(info));
			async.each(userList, function(user, done_callback){
					Photo.count({'user_id': user._id}, function(err, count) {
							user.photoCount = count;
							done_callback(err);
					});
			}, function(err) {
					if (err) {
							response.status(500).send(JSON.stringify(err));
					} else {
							async.each(userList, function(user, done_comment_callback){
									user.numComments = 0;
									Photo.find({}, '').elemMatch('comments', {"user_id": user._id}).exec(function(err, results){
											for(var photoIndex in results){
													let comments = JSON.parse(JSON.stringify(results[photoIndex].comments));
													for(var commentIndex in comments){
															if(comments[commentIndex].user_id === user._id) {
																	user.numComments++;
															}
													}
											}
											done_comment_callback(err);
									});
							}, function(err) {
									if (err) {
											response.status(500).send(JSON.stringify(err));
									}
									console.log('List of Users', userList);
									response.status(200).send(JSON.stringify(userList));
							});
					}
			});			
    });
	} else {
		response.status(401).send('Not authorized');
	}
});

/*
 * URL /commentsBy/:id - Return all comments by a certain user.
 */
app.get('/commentsBy/:id', function (request, response) {
	if(request.session.user_id && request.session.login_name) {
		//response.status(200).send(cs142models.userListModel());
		var id = request.params.id;
		console.log('/commentsBy/:id called');
		Photo.find({}, '_id user_id comments file_name date_time').elemMatch('comments', {
			"user_id": id
		}).exec(function (err, results) {
			if (err) {
				if (err.name === "CastError") {
					response.status(400).send("Invalid user ID");
					return;
				}
				console.error('Doing /commentsBy/:id error:', err);
				response.status(500).send(JSON.stringify(err));
					return;
			}
			if (!results) {
				console.error('Couldn\'t find comments by this user /commentsBy/:id error:', err);
				response.status(400).send('Couldn\'t find comments by this user of id ' + id);
					return;
			}
			var strippedPhotos = JSON.parse(JSON.stringify(results));
			for (var photoIndex in strippedPhotos) {
				let photo = strippedPhotos[photoIndex];
				let specificCommentsArray = [];
				for (var commentIndex in photo.comments) {
					if (photo.comments[commentIndex].user_id === id) {
						specificCommentsArray.push(photo.comments[commentIndex]);
					}
				}
				photo.comments = specificCommentsArray;
			}
			response.status(200).send(JSON.stringify(strippedPhotos));
		});
	} else {
		response.status(401).send('Not authorized');
	}
});

/*
 * URL /favoritedBy - Return all photos favorited by a certain user.
 */
app.get('/favoritedBy', function (request, response) {
	if(request.session.user_id && request.session.login_name) {
		//response.status(200).send(cs142models.userListModel());
		var id = request.session.user_id;
		console.log('/favoritedBy called');
		Photo.find({'favoritedBy': id}, '_id user_id file_name date_time',function (err, results) {
			if (err) {
				if (err.name === "CastError") {
					response.status(400).send("Invalid user ID");
					return;
				}
				console.error('Doing /favoritedBy error:', err);
				response.status(500).send(JSON.stringify(err));
					return;
			}
			if (!results) {
				console.error('Couldn\'t find photos favorited by this user /favoritedBy error:', err);
				response.status(400).send('Couldn\'t find photos favorited by this user of id ' + id);
				return;
			}
			console.log("Favorited photo results: ", results);
			response.status(200).send(JSON.stringify(results));
		});
	} else {
		response.status(401).send('Not authorized');
	}
});

/*
 * URL /favoritedBy - Favorite a photo for a user
 */
app.post('/favoritedBy', function (request, response) {
		if(request.session.user_id && request.session.login_name) {
			var photoId = request.body.photo_id;
			console.log('/favoritedBy/:photo_id called with id', photoId);
			Photo.findOneAndUpdate({'_id': photoId}, {"$push": {favoritedBy: request.session.user_id}}, {new: true}, function(err, newPhoto) {
				if (err) {
						response.status(500).send(JSON.stringify(err));
				} else {
					// We got the specified photo of the user - return it in JSON format.
					var photo = JSON.parse(JSON.stringify(newPhoto));
					// return a boolean for favoritedby based on the user who called this
					if(photo.favoritedBy) {
						if(photo.favoritedBy.indexOf(request.session.user_id) !== -1) {
							photo.favoritedBy = true;
						} else {
							photo.favoritedBy = false;
						}
					} else {
						photo.favoritedBy = false;
					}
					async.each(photo.comments, function(comment, comment_callback){
						console.log(comment);
						User.find({'_id': comment.user_id}, '_id first_name last_name', function(err, userInfo) {
							if (err) {
							// Query returned an error.  We pass it back to the browser with an Internal Service
							// Error (500) error code.
								console.error('Doing /user/:id error in favoritedBy:', err);
								response.status(500).send(JSON.stringify(err));
								return;
							} else if (userInfo.length === 0) {
								console.log('User not found with id '+comment.user_id);
								// Query didn't return an error but didn't find the specific user object
								response.status(400).send('We could not find a user with id '+comment.user_id+' in our database.');
								return;
							}
							comment.user = userInfo[0];
							delete comment.user_id;
							comment_callback(err);
						});
						}, function(err) {
							if(err) {
								response.status(500).send(JSON.stringify(err));
							} else {
								console.log('Successfully favorited photo!', newPhoto);
								response.status(200).send(JSON.stringify(photo));
							}
						});
				}
				// gotta make the comments look good

			});
		} else {
			response.status(401).send('Not authorized');
		}
});

/*
 * URL /registerActivity - Register most recent activity
 */
app.post('/registerActivity', function (request, response) {
		if(request.session.user_id && request.session.login_name) {
			var action = request.body.action;
			User.findOneAndUpdate({'_id': request.session.user_id}, {"$set": {most_recent_action: action}}, {new: true}, function(err, newUser) {
				if (err) {
						response.status(500).send(JSON.stringify(err));
				} else {
					console.log('Successfully updated most recent activity!', newUser);
					response.status(200).send(JSON.stringify(newUser));
				}
			});
		} else {
			response.status(401).send('Not authorized');
		}
});

/*
 * URL /unfavoritedBy - Unfavorite a photo for a user
 */
app.post('/unfavoritedBy', function (request, response) {
		if(request.session.user_id && request.session.login_name) {
			var photoId = request.body.photo_id; // pass photo id in POST request
			console.log('/unfavoritedBy/:photo_id called with id', photoId);
			Photo.findOneAndUpdate({'_id': photoId}, {"$pull": {favoritedBy: request.session.user_id}}, {new: true}, function(err, newPhoto) {
				if (err) {
						response.status(500).send(JSON.stringify(err));
				} else {
					// Return the deleted thingy
						response.status(200).send(JSON.stringify(newPhoto));
				}
						// gotta make the comments look good
			});
		} else {
			response.status(401).send('Not authorized');
		}
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
	if(request.session.user_id && request.session.login_name) {
  	var id = request.params.id;
  	console.log('/user/:id called with id = ', id);
    User.findOne({'_id': id}, '_id first_name last_name location description occupation', function(err, info) {
      if (err) {
        // Query returned an error.  We pass it back to the browser with an Internal Service
        // Error (500) error code.
		console.error('Doing /user/:id error:', err);
		if(err.name === "CastError") {
		  response.status(400).send("Invalid user ID");
		  return;
		}
        response.status(500).send(JSON.stringify(err));
        return;
      } else if (info.length === 0) {
		  // Query didn't return an error but didn't find the specific user object
		  response.status(400).send('We could not find a user with id '+id+' in our database.');
		  return;
	  }
	  // We got the specified user - return it in JSON format.
	  console.log('User with id '+id, info);
	  response.status(200).send(JSON.stringify(info));
    });
	} else {
		response.status(401).send('Not authorized');
	}
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
	if(request.session.user_id && request.session.login_name) {
    var id = request.params.id;
  	console.log('/photosOfUser/:id called with user id = ', id);
    Photo.find({'user_id': id}, '_id user_id comments file_name date_time favoritedBy', function(err, info) {
      if (err) {
        // Query returned an error.  We pass it back to the browser with an Internal Service
        // Error (500) error code.
        console.error('Doing /photosOfUser/:id error:', err);
				if(err.name === "CastError") {
					response.status(400).send("Invalid user ID");
					return;
				}
        response.status(500).send(JSON.stringify(err));
        return;
      } else if (info.length === 0) {
				// Query didn't return an error but there were no photos
				response.status(200).send(JSON.stringify([]));
				return;
	  	}
	  var photos = JSON.parse(JSON.stringify(info)); // avoid mongoose ugliness
	  async.each(photos, function (photo, photo_callback) {
			// return a boolean for favoritedby based on the user who called this
			if(photo.favoritedBy) {
				if(photo.favoritedBy.indexOf(request.session.user_id) !== -1) {
					photo.favoritedBy = true;
				} else {
					photo.favoritedBy = false;
				}
			} else {
				photos.favoritedBy = false;
			}
			if(photo.comments) {
			  async.each(photo.comments, function(comment, comment_callback){
				User.find({'_id': comment.user_id}, '_id first_name last_name', function(err, userInfo) {
				  if (err) {
					// Query returned an error.  We pass it back to the browser with an Internal Service
					// Error (500) error code.
					console.error('Doing /user/:id error:', err);
					response.status(500).send(JSON.stringify(err));
					return;
				  } else if (info.length === 0) {
					  // Query didn't return an error but didn't find the specific user object
					  response.status(400).send('We could not find a user with id '+id+' in our database.');
					  return;
				  }
				  comment.user = userInfo[0];
				  delete comment.user_id;
				  comment_callback(err);
				});
			  }, function(err) {
				if(err) {
				  response.status(500).send(JSON.stringify(err));
				} else {
				  photo_callback(err);
				}
			  });
			} else {
			  photo_callback();
			}
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
              // We got the specified photos of the user - return it in JSON format.
			  			console.log('All photos of user with id '+id, photos);
							response.status(200).send(JSON.stringify(photos));
            }
        });
    });
	} else {
		response.status(401).send('Not authorized');
	}
});

/*
 * URL /mostRecentPhoto/:id - Return the most recent photo for User (id)
 */
app.get('/mostRecentPhoto/:id', function (request, response) {
	if(request.session.user_id && request.session.login_name) {
    var id = request.params.id;
  	console.log('/mostRecentPhoto/:id called with user id = ', id);
    Photo.find({'user_id': id}, '_id user_id file_name date_time', function(err, info) {
      if (err) {
        // Query returned an error.  We pass it back to the browser with an Internal Service
        // Error (500) error code.
        console.error('Doing /mostRecentPhoto/:id error:', err);
				if(err.name === "CastError") {
					response.status(400).send("Invalid user ID");
					return;
				}
        response.status(500).send(JSON.stringify(err));
        return;
      } else if (info.length === 0) {
				// Query didn't return an error but there were no photos
				response.status(200).send(JSON.stringify([]));
				return;
	  	}
			var photos = JSON.parse(JSON.stringify(info)); // avoid mongoose ugliness
			var mostRecentPhoto = false;
			for(var photoIndex in photos) {
				var dateOfPhoto = new Date(photos[photoIndex].date_time);
				if(!mostRecentPhoto) {
					mostRecentPhoto = photos[photoIndex];
				} else {
					var dateOfMostRecent = new Date(mostRecentPhoto.date_time);
					if(dateOfPhoto.getTime() > dateOfMostRecent.getTime()) {
						mostRecentPhoto = photos[photoIndex];
					}
				}
			}
			console.log('Most recent photo ' + id, mostRecentPhoto);
			response.status(200).send(JSON.stringify(mostRecentPhoto));
		});
	} else {
		response.status(401).send('Not authorized');
	}
});

/*
 * URL /photoMostComments/:id - Return the photo with the most comments for User (id)
 */
app.get('/photoMostComments/:id', function (request, response) {
	if(request.session.user_id && request.session.login_name) {
    var id = request.params.id;
  	console.log('/photoMostComments/:id called with user id = ', id);
    Photo.find({'user_id': id}, '_id user_id file_name comments', function(err, info) {
      if (err) {
        // Query returned an error.  We pass it back to the browser with an Internal Service
        // Error (500) error code.
        console.error('Doing /mostRecentPhoto/:id error:', err);
				if(err.name === "CastError") {
					response.status(400).send("Invalid user ID");
					return;
				}
        response.status(500).send(JSON.stringify(err));
        return;
      } else if (info.length === 0) {
				// Query didn't return an error but there were no photos
				response.status(200).send(JSON.stringify([]));
				return;
	  	}
			var photos = JSON.parse(JSON.stringify(info)); // avoid mongoose ugliness
			var mostCommentsPhoto = false;
			for(var photoIndex in photos) {
				var commentsOfPhoto = photos[photoIndex].comments.length;
				if(!mostCommentsPhoto) {
					mostCommentsPhoto = photos[photoIndex];
				} else {
					var commentsOnMostCommentsPhoto = mostCommentsPhoto.comments.length;
					if(commentsOfPhoto > commentsOnMostCommentsPhoto) {
						mostCommentsPhoto = photos[photoIndex];
					}
				}
			}
			mostCommentsPhoto.comments = mostCommentsPhoto.comments.length;
			console.log('Most comments photo ' + id, mostCommentsPhoto);
			response.status(200).send(JSON.stringify(mostCommentsPhoto));
		});
	} else {
		response.status(401).send('Not authorized');
	}
});

/*
 * URL /photos/new - Upload new photo
 */
app.post('/photos/new', function (request, response) {
		if(request.session.user_id && request.session.login_name) {
			console.log('/photos/new called');
			processFormBody(request, response, function (err) {
				if (err || !request.file) {
						response.status(500).send(JSON.stringify(err));
						return;
				}
				// request.file has the following properties of interest
				//      fieldname      - Should be 'uploadedphoto' since that is what we sent
				//      originalname:  - The name of the file the user uploaded
				//      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
				//      buffer:        - A node Buffer containing the contents of the file
				//      size:          - The size of the file in bytes

				// XXX - Do some validation here.
				// We need to create the file in the directory "images" under an unique name. We make
				// the original file name unique by adding a unique prefix with a timestamp.
				var timestamp = new Date().valueOf();
				var filename = 'U' +  String(timestamp) + request.file.originalname;

				fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
					// XXX - Once you have the file written into your images directory under the name
					// filename you can create the Photo object in the database
					var newPhoto = new Photo({
						file_name: filename,
						user_id: request.session.user_id,
						comments: []
					});

					console.log("New photo: ", newPhoto);

					newPhoto.save(function(err){
						if(err) {
							response.status(500).send('Server error with saving new photo');
							return;
						} else {
							response.status(200).send('Successfully saved image!');
						}
					});

				});
			});
		} else {
			response.status(401).send('Not authorized');
		}
});

/*
 * URL /commentsOfPhoto/:photo_id - Add comment to photo
 */
app.post('/commentsOfPhoto/:photo_id', function (request, response) {
		if(request.session.user_id && request.session.login_name) {
			var photoId = request.params.photo_id;
			var comment = request.body.comment;
			console.log('/commentsOfPhoto/:photo_id called with comment', comment, "and id", photoId);
			if(!comment) {
				response.status(400).send('Empty comment');
				return;
			} else {
				var newComment = {"comment": request.body.comment, "user_id": request.session.user_id};
				Photo.findOneAndUpdate({'_id': photoId}, {"$push": {comments: newComment}}, {new: true}, function(err, newPhoto) {
					if (err) {
							response.status(500).send(JSON.stringify(err));
					} else {
						// We got the specified photo of the user - return it in JSON format.
						var photo = JSON.parse(JSON.stringify(newPhoto));
						async.each(photo.comments, function(comment, comment_callback){
							console.log(comment);
							User.find({'_id': comment.user_id}, '_id first_name last_name', function(err, userInfo) {
								if (err) {
								// Query returned an error.  We pass it back to the browser with an Internal Service
								// Error (500) error code.
									console.error('Doing /user/:id error:', err);
									response.status(500).send(JSON.stringify(err));
									return;
								} else if (userInfo.length === 0) {
									console.log('User not found with id '+comment.user_id);
									// Query didn't return an error but didn't find the specific user object
									response.status(400).send('We could not find a user with id '+comment.user_id+' in our database.');
									return;
								}
								comment.user = userInfo[0];
								delete comment.user_id;
								comment_callback(err);
							});
							}, function(err) {
								if(err) {
									response.status(500).send(JSON.stringify(err));
								} else {
									console.log('Successfully posted comment!', newComment);
									response.status(200).send(JSON.stringify(photo));
								}
							});

					}
					// gotta make the comments look good

				});
			}
		} else {
			response.status(401).send('Not authorized');
		}
});

// AUTH RELATED
/*
 * URL /user - register user
 */
app.post('/user', function (request, response) {
		if(!request.body.first_name || !request.body.last_name) {
			response.status(400).send("Empty first or last name string");
			return;
		}
		console.log('/user/new was called');
		console.log(request.body);
  	var login_name = request.body.login_name;
  	console.log('/user/new called with login name = ', login_name);
    User.findOne({'login_name': login_name}, '_id first_name', function(err, user) {
			if (err) {
				response.status(400).send('Error with mongo find method');
				return;
			}
      else if (!user) {
				var userInfo = request.body; // hopefully the request has all the right fields
				var saltedPassword = cs142password.makePasswordEntry(userInfo.password);
				userInfo.password_digest = saltedPassword.hash;
				userInfo.salt = saltedPassword.salt;
				delete userInfo.password;
				var newUser = new User(userInfo);
				newUser.save(function(err) {
					if(err) {
						response.status(400).send('Error with saving new user');
					} else {
						response.status(200).send('New user created!');
					}
				});
	  	} else {
				response.status(400).send('A user already has this login name');
				return;
			}
    });
});

/*
 * URL /admin/login - Login user
 */
app.post('/admin/login', function (request, response) {
  	var login_name = request.body.login_name;
		var password = request.body.password;
  	console.log('/admin/login called with login name = ', login_name, 'and password = ', password);
    User.findOne({'login_name': login_name}, '_id first_name password_digest salt', function(err, user) {
      if (!user) {
				// Query didn't return an error but didn't find the specific user object
				response.status(400).send('We could not find a user with login name '+login_name+' in our database.');
				return;
	  	} else if (!cs142password.doesPasswordMatch(user.password_digest, user.salt, password)) {
				response.status(400).send('Wrong password.');
				return;
			} else {
				// Write the cookies
				console.log('User with id ', user._id);
				request.session.user_id = user._id;
				request.session.login_name = login_name;
				var secureUser = JSON.parse(JSON.stringify(user));
				delete secureUser.password_digest;
				delete secureUser.salt;
				response.status(200).end(JSON.stringify(secureUser));
			}
    });
});

/*
 * URL /admin/logout - Logout user
 */
app.post('/admin/logout', function (request, response) {
  	if(request.session.user_id && request.session.login_name) {
			request.session.destroy(function(err) {
				if(err) {
					response.status(500).send('Server error with destroying session');
					return;
				}
				response.status(200).send('Successfully logged out!');
				return;
			});
		} else {
			response.status(400).send('User is not currently logged in.');
		}
});

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


