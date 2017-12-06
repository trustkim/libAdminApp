// Userlist data array for filling in info box
let bookListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Booktitle link click
    $('#bookList table tbody').on('click', 'td a.linkshowbook', showBookInfo);

    // Add Book button click
    $('#btnAddBook').on('click', addBook);

    // Delete Book link click
    $('#bookList table tbody').on('click', 'td a.linkdeletebook', deleteBook);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/books/booklist', function( data ) {

        // Stick our book data array into a bookList variable in the global object
        bookListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.bookid + '</td>';
            tableContent += '<td><a href="#" class="linkshowbook" rel="' + this.booktitle + '">' + this.booktitle + '</a></td>';
            tableContent += '<td><a href="#" class="linkdeletebook" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#bookList table tbody').html(tableContent);
    });
};

// Show Book Info
function showBookInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve booktitle from link rel attribute
    var thisBookTitle = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = bookListData.map(function(arrayItem) { return arrayItem.booktitle; }).indexOf(thisBookTitle);


    // Get our Book Object
    var thisBookObject = bookListData[arrayPosition];

    //Populate Info Box
    $('#bookInfoID').text(thisBookObject.bookid);
    $('#bookInfoTitle').text(thisBookObject.booktitle);
    $('#bookInfoAuthor').text(thisBookObject.author);
    $('#bookInfoPublisher').text(thisBookObject.publisher);
    $('#bookInfoYear').text(thisBookObject.year);
    $('#bookInfoISBN').text(thisBookObject.isbn);


};

// Add Book
function addBook(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addBook input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all book info into one object
        var newBook = {
            'bookid' : $('#addBook fieldset input#inputBookID').val(),
            'booktitle': $('#addBook fieldset input#inputBookTitle').val(),
            'author': $('#addBook fieldset input#inputBookAuthor').val(),
            'publisher': $('#addBook fieldset input#inputBookPublisher').val(),
            'year': $('#addBook fieldset input#inputBookYear').val(),
            'isbn': $('#addBook fieldset input#inputBookISBN').val(),
        }

        // Use AJAX to post the object to our addbook service
        $.ajax({
            type: 'POST',
            data: newBook,
            url: '/books/addbook',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addBook fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete Book
function deleteBook(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this book?');

    // Check and make sure the book confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/books/deletebook/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
