const { request } = require('express');
const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Marks a book as read
router.put('/:id', (req, res) => {
    let id = req.params.id;
    console.log('in mark as read PUT with id: ', id);
    let queryText = `
    UPDATE "books"
    SET "isRead" = true
    WHERE "id" = $1;
    `
    let values = [id];
    pool.query(queryText, values)
  .then((response) => {
    console.log('Update Successful: ', response);
    res.sendStatus(200);
  }).catch((error) => {
    console.log('Error on mark as read: ', error);
    res.sendStatus(500)
  })
})

// Deletes a book from the list of awesome reads
router.delete('/:id', (req, res) => {
    console.log('in DELETE');
    let id = req.params.id;
    let queryText = `
        DELETE FROM "books"
        WHERE "id" = $1;
    `
    let values = [id];
    pool.query(queryText, values)
    .then(response => {
      console.log('DELETE Successful: ', response);
      res.sendStatus(204)
    }).catch(error => {
      console.log('Error on DELETE: ', error);
    });  
})

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status


// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id


module.exports = router;
