document.addEventListener('DOMContentLoaded', () => {
    let books;
    if (!localStorage.getItem('books')) localStorage.setItem('books', JSON.stringify([]));
    books = JSON.parse(localStorage.getItem('books'));

    const isDuplicateBook = (title) => books.some(book => book.title.toLowerCase() === title.toLowerCase());

    const createArticleBook = (book) => {
        const articleEl = document.createElement('article');
        articleEl.className = 'book_item';

        const titleEl = document.createElement('h3');
        titleEl.innerHTML = `Title: ${book.title}`;

        const authorParagraphEl = document.createElement('p');
        authorParagraphEl.innerHTML = `Author: ${book.author}`;

        const yearParagraphEl = document.createElement('p');
        yearParagraphEl.innerHTML = `Year: ${book.year}`;

        const actionContainerEl = document.createElement('div');
        actionContainerEl.className = 'action';

        const deleteBtnEl = document.createElement('button');
        deleteBtnEl.innerHTML = "Hapus buku";
        deleteBtnEl.className = "red";
        deleteBtnEl.addEventListener('click', () => deleteBook(book.id));

        const updateBtnEl = document.createElement('button');
        updateBtnEl.innerHTML = "Edit buku";
        updateBtnEl.className = "blue";
        updateBtnEl.addEventListener('click', () => updateInfoBook(book.id));

        const completeBtnEl = document.createElement('button');
        completeBtnEl.addEventListener('click', () => setToCompleteBook(book.id));
        completeBtnEl.innerHTML = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
        completeBtnEl.className = book.isComplete ? "yellow" : "green";

        actionContainerEl.append(deleteBtnEl, updateBtnEl, completeBtnEl);
        articleEl.append(titleEl, authorParagraphEl, yearParagraphEl, actionContainerEl);

        return articleEl;
    };

    const updateBookshelf = (listOfBooks) => {
        const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
        const completeBookshelfList = document.getElementById('completeBookshelfList');

        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        listOfBooks.forEach((book) => {
            book.isComplete
                ? completeBookshelfList.append(createArticleBook(book))
                : incompleteBookshelfList.append(createArticleBook(book));
        });
    };

    const deleteBook = (id) => {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            const userConfirmation = confirm(`Are you sure to delete book: ${books[index].title} (ID: ${id})?`);
            if (userConfirmation) {
                books.splice(index, 1);
                localStorage.setItem('books', JSON.stringify(books));
                updateBookshelf(books);
            } else {
                alert('Delete book cancelled.');
            }
        }
    };

    const setToCompleteBook = (id) => {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books[index].isComplete = !books[index].isComplete;
            localStorage.setItem('books', JSON.stringify(books));
            updateBookshelf(books);
        }
    };

    const updateInfoBook = (id) => {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            const newTitle = prompt(`Masukkan judul baru buku (Judul lama: ${books[index].title})`);
            const newAuthor = prompt(`Masukkan nama pengarang baru (Pengarang lama: ${books[index].author})`);
            const newYear = parseInt(prompt(`Masukkan tahun terbit baru (Tahun terbit lama: ${books[index].year})`), 10);

            // Validasi input
            const emptyNewTitle = !newTitle || newTitle.trim() === '';
            const emptyNewAuthor = !newAuthor || newAuthor.trim() === '';
            const invalidNewYear = isNaN(newYear);

            if (emptyNewTitle || emptyNewAuthor || invalidNewYear) {
                alert('Pastikan semua informasi buku terisi dengan benar!');
                return;
            }

            // Memperbarui informasi buku
            books[index].title = newTitle.trim();
            books[index].author = newAuthor.trim();
            books[index].year = newYear;
            localStorage.setItem('books', JSON.stringify(books)); // Menyimpan perubahan ke localStorage
            updateBookshelf(books); // Memperbarui tampilan rak buku
            alert('Update informasi buku berhasil.');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();

        const query = document.getElementById('searchBookTitle').value.toLowerCase().trim();
        const searchResults = books.filter(book => (
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query) || 
            book.year.toString().includes(query)
        ));

        updateBookshelf(searchResults);
    };

    document.getElementById('inputBook').addEventListener('submit', (e) => {
        e.preventDefault();

        const bookTitle = document.getElementById('inputBookTitle').value.trim();
        const bookAuthor = document.getElementById('inputBookAuthor').value.trim();
        const bookYear = parseInt(document.getElementById('inputBookYear').value.trim(), 10);
        const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

        if (isDuplicateBook(bookTitle)) {
            alert(`Buku dengan judul "${bookTitle}" sudah ada dalam daftar.`);
            return;
        }

        const book = {
            id: new Date().getTime(),
            title: bookTitle,
            author: bookAuthor,
            year: bookYear,
            isComplete: bookIsComplete,
        };

        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
        updateBookshelf(books);

        document.getElementById('inputBookTitle').value = '';
        document.getElementById('inputBookAuthor').value = '';
        document.getElementById('inputBookYear').value = '';
        document.getElementById('inputBookIsComplete').checked = false;
    });

    document.getElementById('searchBook').addEventListener('submit', handleSearch);
    document.getElementById('searchBook').addEventListener('keyup', handleSearch);

    updateBookshelf(books);
});
