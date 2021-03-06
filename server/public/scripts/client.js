$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.deleteButton', handleDelete);
  $('#bookShelf').on('click', '.readButton', updateRead);
}

// a function to update a book to read
function updateRead() {
    let id = $(this).closest('tr').data('id');
    console.log('in updateRead with id: ', id);
    $.ajax({
        method: 'PUT',
        url: `/books/${id}`
    }).then(function(response) {
        console.log('update complete: ', response);
        refreshBooks();
    }).catch(function(error) {
        console.log('Error on updateRead');
    })
}

// a function to delete the book that was clicked
function handleDelete() {
  console.log('in handleDelete');
  console.log('this is $this id ', $(this).closest('tr').data('id'));
  let idToDelete = $(this).closest('tr').data('id');
  $.ajax({
      method: 'DELETE',
      url: `/books/${idToDelete}`
  }).then(function(response) {
      console.log('Delete Successful: ', response);
      refreshBooks();
  }).catch(function(error) {
      console.log('Error on delete: ', error);
  })
  
  
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr data-id="${book.id}">
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td><button class="readButton">Mark As Read</button></td>
        <td><button class="deleteButton">DELETE</button></td>
      </tr>
    `);
  }
}
