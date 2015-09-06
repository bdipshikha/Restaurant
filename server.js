

var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require("sqlite3").verbose();
var cors = require('cors');

var db = new sqlite3.Database("db/diner.db");
var app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.use(express.static('public'));
app.get('/', function(req, res){
	res.render('index.html')
});

app.get('/categories', function(req, res){
	db.all("SELECT * FROM categories", function(err, rows){
		//console.log("it works-line 19")
		if(err){
			throw err;
		}
		res.json(rows);
	});
});

app.get('/category/:id', function(req, res){
	console.log("it works-line 30")
	var id = req.params.id;
	console.log(id);
	
	var selectSql = "SELECT dishes.id, dishes.name "
					+ "FROM dishes "
					+ "INNER JOIN categories ON categories.id = dishes.category_id "
					+ "WHERE categories.id = ?;"
	db.all(selectSql, id, function(err, dishes) {
		console.log("it works - line 37")

		if(err){
			throw err;
		}
		res.json(dishes);
	});

});

app.post('/categories', function(req, res){
	db.run("INSERT INTO categories (name) VALUES (?)", req.body.name, function(err,row){
		if(err){
			throw err;
		}
		var id = this.lastID;
        db.get("SELECT * FROM categories WHERE id = ?", id, function(err, row) {
        	if(err) {
        		throw err;
        	}
        	res.json(row);
        });
    });
});

app.put('/category/:id', function(req, res){
	var id = req.params.id;
	//console.log("it works-line 59")
	db.run("UPDATE categories SET name = ? WHERE id = ?", req.body.name, id, function(err){
		console.log("it works-line 61")
		if(err){
			throw err;
		}
		db.get("SELECT * FROM categories WHERE id = ?", id, function(err, row){
			//console.log("it works-line 66")
			if(err){
				throw err;
			}
			res.json(row);
		});
	});
});

app.delete('/category/:id', function(req, res){
	db.run("DELETE FROM categories WHERE id = ?", req.params.id, function(err){
		if(err){
			throw err;
		}
		res.json({deleted: true});
	});
});


app.get('/dishes', function(req, res) {
	db.all("SELECT * FROM dishes", function(err, rows) {
		if(err) {
			throw err;
		}
		res.json(rows);
	});
});


app.get('/dish/:id', function(req, res) {
	db.get("SELECT * FROM dishes WHERE id = ?", req.params.id, function(err, row){
		if(err) {
			throw err;
		}
		res.json(row);
	});
});

app.post('/dishes', function(req, res) {
	db.run("INSERT INTO dishes (name, price, image_url, category_id) VALUES (?,?,?,?)", req.body.name, req.body.price, req.body.image_url, req.body.category_id, function(err) {
		if(err) {
			throw err;
		} else {
			

	 	}

    var id = this.lastID;
    db.get("SELECT * FROM dishes WHERE id = ?", id, function(err, row) {
    	if(err) {
    		throw err;
    	}
    	res.json(row);
    });
  });
});

app.put('/dish/:id', function(req, res) {
	var id = req.params.id;
	db.run("UPDATE dishes SET name = ?, image_url = ?, price = ?, category_id = ? WHERE id = ?", req.body.name, req.body.image_url, req.body.price, req.body.category_id, id, function (err) {
		if(err) {
			throw err;
		}
		db.get("SELECT * FROM dishes WHERE id = ?", id, function(err, row) {
			if(err) {
				throw err;
			}
			res.json(row);
		});
	});
});

app.delete('/dish/:id', function(req, res) {
	db.run("DELETE FROM dishes WHERE id = ?", req.params.id, function(err) {
		if(err) {
			throw err;
		}
		res.json({deleted: true});
	});
});

app.listen(3000);
console.log('Listening on port 3000');



