const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const IP_address = "0.0.0.0";

// api status
app.get("/status", (request, response) => {
    const status = {"Status": "Running"};
    response.send(status);
});


// connect to the database
const db = new sqlite3.Database('sensor_data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});


// create table if table doesn't exist
let sql_queryall = `SELECT * FROM sensors`;
db.all(sql_queryall, [], (err, rows) => {
    if (err) {
        sql_create_table = `CREATE TABLE sensors(lighting,temperature,moisture)`;
        db.run(sql_create_table);
    };
})

// ------------ ENDPOINTS ------------ //

// get all values
app.get('/', (req, res) => {
    const sql_query = 'SELECT * FROM sensors';
    db.all(sql_query, (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});


// update sensor values
app.put('/', (req, res) => {

    // check if table is empty
    const sql_check_empty = 'SELECT COUNT(*) AS count FROM sensors';
    db.get(sql_check_empty, [], (err, row) => {
        if (err) return res.status(500).send(err.message);

        // if table is empty, add data
        if (row.count == 0) {
            const sql_insert_sensor = 'INSERT INTO sensors(lighting, temperature, moisture) VALUES (?, ?, ?)';
            db.run(sql_insert_sensor, [req.body.lighting, req.body.temperature, req.body.moisture], (err) => { 
                if (err) return res.status(500).send(err.message)
            });
        } 
        else {
            // if table isn't empty, update data
            const sql_update_sensor = 'UPDATE sensors SET lighting = ?, temperature = ?, moisture = ?';
            db.run(sql_update_sensor, [req.body.lighting, req.body.temperature, req.body.moisture], (err) => {
                if (err) return res.status(500).send(err.message);
            });
        }
    });
});

app.listen(PORT, IP_address, () => {
    console.log("Server Listening on http://" + IP_address + ":" + PORT);
});