const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const parser = require('body-parser');
const cors = require('cors');


const app = express();
const db = new sqlite3.Database('users.db');
const PORT = 8000;

app.use(cors());
app.use(parser.urlencoded({ extended: false })); 
  

app.get('/',(req,res) => {
    res.send('Hello world!');
});

app.get('/users', (req,res) => {
    db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({error: "Ошибка выбора данных"});
            return;
        }
        res.json(rows);
    })
});

app.get('/users/:id', (req,res) => {
    const userID = parseInt(req.params.id);
    db.get("SELECT * FROM users WHERE id = ?", [userID] , (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({error: "Ошибка выбора данных"});
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({error: "пользователь не найден"});
            return;
        }
    })
});

app.post('/users', (req, res) => {
    const param1 = req.body.name;

    db.get("SELECT MAX(id) as maxId FROM users", (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Ошибка выбора данных" });
            return;
        }

        const maxId = (row && row.maxId) || 0;

        const newId = maxId + 1;
    
        const insertUser = db.prepare("INSERT INTO users (id, name) VALUES (?, ?)");
    
        insertUser.run(newId, `Пользователь ${param1}`);
        insertUser.finalize();
    
        console.log("Данные пользователя добавлены в базу данных с id:", newId);
        res.send('POST-запрос выполнен');
      });
  });  

  app.delete('/users/:id',(req,res) => {
    const userID = parseInt(req.params.id);
    db.get("SELECT * FROM users WHERE id = ?", [userID] , (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Ошибка выбора данных" });
            return;
        }

        if (row) {
            db.run("DELETE FROM users WHERE id = ?", [userID], (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: "Ошибка при удалении пользователя" });
                } else {
                    res.status(200).json({ message: "Пользователь успешно удален" });
                }
            })
        }else {
            res.status(404).json({ error: "Пользователь не найден" });
        }
    });
  });



app.listen(PORT,() => {
    console.log(`Server staring in ${PORT}`);
});