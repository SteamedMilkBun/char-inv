import express from 'express';
import pg from 'pg';
/*import dotenv from 'dotenv';

dotenv.config();*/

const PORT = 8000;

const app = express();
app.use(express.json());

const pool = new pg.Pool({
    host: "localhost",
    port: 6432,
    user: "postgres",
    password: "postgres",
    database: "char_inv_db"
});

app.get('/', (req, res) => {
    console.log('Welcome');
    res.json('Welcome');
})

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

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})