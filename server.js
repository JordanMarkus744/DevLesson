// this server will be created using Node.js + Express + SQLite
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');


const app = express();
app.use(cors());
const port = 3001;

app.use(bodyParser.json());

const db = new sqlite3.Database('DevLearningDB.db', (err) => {
    if (err) {
      console.error('Error opening database', err.message);
    } else {
      console.log('Connected to the SQLite database.');
    }
  }
);

app.get(`/api/:chapter_id/lessons`, (req, res) => {
    const chapter_id = req.params.chapter_id;

    const sql = `SELECT * FROM Lessons WHERE chapter_id = ${chapter_id}`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching lessons:', err);
            return res.status(500).json({ error: 'Error fetching lessons' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No lessons found for this chapter' });
        }
        console.log("Rows found");
        res.status(200).json({ data: rows });
    });
});

app.get(`/api/:course/chapters`, (req, res) => {
    const course_name = req.params.course;

    const sql = `SELECT course_id FROM Courses WHERE course_name = ?`;
    db.get(sql, [course_name], (err, row) => {
        if (err) {
            console.error('Error fetching course:', err);
            return res.status(500).json({ error: 'Error fetching course' });
        }
        if (!row) {
            return res.status(404).json({ error: 'No Course with that name in database' });
        }
        console.log('Course row:', row); // Log the row to verify it's correct
        const course_id = row.course_id;

        const sql2 = `SELECT * FROM Chapters WHERE course_id = ? ORDER BY chapter_order ASC`;
        db.all(sql2, [course_id], (err, rows) => {
            if (err) {
                console.error('Error fetching chapters:', err);
                return res.status(500).json({ error: 'Error fetching chapters' });
            }
            if (!rows || rows.length === 0) {
                return res.status(404).json({ error: 'No chapters found for that course' });
            }
            console.log('Chapters rows:', rows); // Log the rows to verify they are correct
            return res.status(200).json({ data: rows });
        });
    });
});










app.get(`/api/courses`, (req, res) => {
    const sql = `SELECT * FROM Courses`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching courses' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Courses not found in database' });
        }
        console.log(rows);
        return res.json(rows); // Directly return the array of rows
    });
});















app.get(`/api/profilePictureRender/:username`, (req, res) => {
    const userName = req.params.username
    if (!userName){
        return res.status(400).json({ error: 'username required to fetch profile picture' });
    }

    const sql = `SELECT * FROM users WHERE userName = ?`;
    db.get(sql, [userName], function(err, row) {
        if (err){
            return res.status(500).json({ error: 'Error fetching profile picture' });
        }
        if (!row){
            return res.status(404).json({ error: 'No Profile Picture found' });
        }
        let fullURL = row.userProfilePicture;
        return res.json({ data: row });
    });
});

app.post('/api/signup', (req, res) => {
    const { userEmail, userName, userPassword } = req.body;
    const profilePic = 'DWf80tx'; // This is the default profile picture
    console.log(String(userEmail));
    console.log(userName);
    console.log(userPassword);
    const dateCreated = new Date().toISOString();
    console.log(dateCreated);

    const sql = `SELECT * FROM users WHERE userName = ?`;
    db.get(sql, [userName], function(err, row) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Error checking accounts' });
        }
        if (row) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password and insert into database
        bcrypt.hash(userPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Error hashing password' });
            }


            const insertSql = `INSERT INTO users (userEmail, userName, userPassword, userDateCreated, userProfilePicture) VALUES (?, ?, ?, ?, ?)`;
            db.run(insertSql, [userEmail, userName, hashedPassword, dateCreated, profilePic], function(err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Error creating account' });
                }
                const sql2 = `SELECT * FROM users WHERE userEmail = ?`
                db.run(sql2, [userEmail], function(err) {
                    if (err){
                        return res.status(500).json({ error: `Couldn't get ${userName} data`});
                    }
                });
                res.status(200).json({ message: 'Account created successfully' });
            });
        });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body; // Extract username and password from request body

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const sql = `SELECT * FROM users WHERE userName = ?`;
    db.get(sql, [username], function(err, row) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Error checking accounts' });
        } 
        if (!row) {
            return res.status(400).json({ error: 'Incorrect Username or Password' });
        }

        bcrypt.compare(password, row.userPassword, (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Error comparing passwords' });
            }
            if (result) {
                res.status(200).json({ success: `Logged in as ${username}.` });
            } else {
                res.status(400).json({ error: 'Incorrect Username or Password' });
            }
        });
    });
}); 

app.all('/api/dump', (req, res) => {
    const sql = `SELECT * FROM users`;
    db.all(sql, [], function(err) {
        if (err){
            res.status(500).json({ error: err.message });
        }
        else{
            res.json({ data: rows });
            console.log(rows);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})

