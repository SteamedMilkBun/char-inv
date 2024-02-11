import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8000;

// const pgConnect = `postgresql://postgres:postgres@localhost:6432/char_inv_db`;

// const pgURI = process.env.DATABASE_URL || pgConnect;
// console.log("pgURI: ", pgURI);

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then((client) => {
        console.log(`Connected to postgres using connection string ${process.env.DATABASE_URL}`);
        client.release();
    })
    .catch((err)=>{
        console.log("Failed to connect to postgres: ", err.message);
    })

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/character', (req, res) => {
    pool.query(`SELECT * FROM character`)
    .then((data) => {
        res.json(data.rows);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

app.get('/character/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (Number.isNaN(id)) {
        res.status(400).send(`${req.params.id} is NaN`);
        return;
    }

    pool.query(`SELECT * FROM character WHERE char_id = $1`, [id])
    .then((data) => {
        if (data.rows.length === 0) {
            res.status(404).send(`character @ id: ${id} not found`);
            return;
        }
        res.json(data.rows[0]);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

app.post('/character', (req, res) => {
    const name = req.body.char_name;

    pool.query(`INSERT INTO character (char_name) VALUES ($1) RETURNING *`, [name])
    .then((data) => {
        console.log(data.rows[0]);
        res.json(data.rows[0]);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

app.patch('/character/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const name = req.body.char_name;

    if (Number.isNaN(id)) {
        res.status(400).send(`${req.params.id} is NaN`);
        return;
    }

    pool.query(`UPDATE character SET 
                char_name = COALESCE($1, char_name)
                WHERE char_id = $2 RETURNING *`,
                [name, id])
    .then((data) => {
        res.json(data.rows[0]);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

app.delete('/character/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const name = req.body.char_name;

    if (Number.isNaN(id)) {
        res.status(400).send(`${req.params.id} is NaN`);
        return;
    }

    pool.query(`DELETE FROM character WHERE char_id = $1 RETURNING *`, [id])
    .then((data) => {
        if (data.rows.length === 0) {
            res.status(404).send(`character @ id: ${id} not found`);
            return;
        }
        res.json(data.rows[0]);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

app.get('/item', (req, res) => {
    pool.query(`SELECT * FROM item`)
    .then((data) => {
        res.json(data.rows);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

app.get('/item/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (Number.isNaN(id)) {
        res.status(400).send(`${req.params.id} is NaN`);
        return;
    }

    pool.query(`SELECT * FROM item WHERE item_id = $1`, [id])
    .then((data) => {
        if (data.rows.length === 0) {
            res.status(404).send(`item @ id: ${id} not found`);
            return;
        }
        res.json(data.rows[0]);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

app.post('/item', (req, res) => {
    const { item_name, item_value } = req.body;

    pool.query(`INSERT INTO item (item_name, item_value) VALUES ($1, $2) RETURNING *`, [item_name, item_value])
    .then((data) => {
        console.log(data.rows[0]);
        res.json(data.rows[0]);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

app.patch('/item/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const { item_name, item_value } = req.body;

    if (Number.isNaN(id)) {
        res.status(400).send(`${req.params.id} is NaN`);
        return;
    }

    pool.query(`UPDATE item SET 
                item_name = COALESCE($1, item_name),
                item_value = COALESCE($2, item_value)
                WHERE item_id = $3 RETURNING *`,
                [item_name, item_value, id])
    .then((data) => {
        res.json(data.rows[0]);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

app.delete('/item/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const { item_name, item_value } = req.body;

    if (Number.isNaN(id)) {
        res.status(400).send(`${req.params.id} is NaN`);
        return;
    }
    
    pool.query(`DELETE FROM item WHERE item_id = $1 RETURNING *`, [id])
    .then((data) => {
        if (data.rows.length === 0) {
            res.status(404).send(`item @ id: ${id} not found`);
            return;
        }
        res.json(data.rows[0]);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

app.get('/ci', async (req, res) => {
    try {
        const result = await pool.query(`select c.char_id, c.char_name, i.item_id, i.item_name, i.item_value, ci.qty 
                                        FROM char_item ci 
                                        JOIN character c 
                                        ON ci.char_id = c.char_id 
                                        JOIN item i 
                                        ON ci.item_id = i.item_id;
                                        `)
        console.log(result.rows);
        res.json(result.rows);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
})

app.get('/ci/:char_id', async (req, res) => {
    console.log(`hit get char/${req.params.char_id}`);
    const char_id = Number.parseInt(req.params.char_id);

    if (Number.isNaN(char_id)) {
        res.status(400).send(`${req.params.char_id} is NaN`);
        return;
    }

    try {
        const result = await pool.query(`SELECT c.char_id, c.char_name, i.item_id, i.item_name, ci.qty
                                        FROM char_item ci
                                        JOIN character c
                                        ON ci.char_id = c.char_id
                                        JOIN item i
                                        ON ci.item_id = i.item_id
                                        WHERE ci.char_id = $1`, [char_id])
        console.log(result.rows);
        res.json(result.rows);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
})

app.get('/ci/:char_id/:item_id', async (req, res) => {
    const char_id = Number.parseInt(req.params.char_id);
    const item_id = Number.parseInt(req.params.item_id);

    if (Number.isNaN(char_id)) {
        res.status(400).send(`${req.params.char_id} is NaN`);
        return;
    }

    try {
        const result = await pool.query(`SELECT c.char_name, i.item_name, ci.qty
                                        FROM char_item ci
                                        JOIN character c
                                        ON ci.char_id = c.char_id
                                        JOIN item i
                                        ON ci.item_id = i.item_id
                                        WHERE ci.char_id = $1 AND ci.item_id = $2`, [char_id, item_id])
        console.log(result.rows[0]);
        res.json(result.rows[0]);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
})

app.patch('/ci/:char_id/:item_id', async (req, res) => {
    const char_id = Number.parseInt(req.params.char_id);
    const item_id = Number.parseInt(req.params.item_id);
    const qty = Number.parseInt(req.body.qty);

    if (Number.isNaN(char_id)) {
        res.status(400).send(`${req.params.char_id} is NaN`);
        return;
    }

    try {
        const result = await pool.query(`UPDATE char_item ci SET
                                        qty = COALESCE($1, qty)
                                        WHERE ci.char_id = $2 AND ci.item_id = $3 RETURNING *`,
                                        [qty, char_id, item_id])
        console.log(result.rows[0]);
        res.json(result.rows[0]);
    }
    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})