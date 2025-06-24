document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('results');

    const showMessage = (message, isHtml = false) => {
        resultsDiv.innerHTML = isHtml ? message : `<p class="initial-message">${message}</p>`;
    };

    async function searchBooks(query, isInitialLoad = false) {
        if (!query && !isInitialLoad) {
            showMessage('Silakan masukkan kata kunci untuk mencari buku.');
            return;
        }

        showMessage('<div class="loading-message"><div class="spinner"></div><span>Mencari buku...</span></div>', true);

        try {
            const apiQuery = query ? encodeURIComponent(query) : 'bestseller fiction';
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${apiQuery}&maxResults=20`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.items && data.items.length > 0) {
                displayBooks(data.items);
            } else {
                showMessage('Tidak ada buku yang ditemukan untuk pencarian ini.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showMessage(`<p class="initial-message" style="color: red;">Terjadi kesalahan saat mencari buku: ${error.message}. Mohon coba lagi nanti.</p>`, true);
        }
    }

    function displayBooks(books) {
        resultsDiv.innerHTML = '';

        books.forEach(book => {
            const volumeInfo = book.volumeInfo;
            
            const bookLink = document.createElement('a');
            bookLink.href = volumeInfo.infoLink || '#';
            bookLink.target = '_blank';
            bookLink.rel = 'noopener noreferrer';
            bookLink.title = `Lihat detail tentang ${volumeInfo.title || 'buku ini'}`;

            const bookCard = document.createElement('div');
            bookCard.classList.add('book-card');

            const title = volumeInfo.title || 'Judul Tidak Tersedia';
            const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Penulis Tidak Tersedia';
            const publishedDate = volumeInfo.publishedDate ? volumeInfo.publishedDate.substring(0, 4) : 'Tidak Tersedia';
            const description = volumeInfo.description ? volumeInfo.description.substring(0, 150) + '...' : 'Deskripsi Tidak Tersedia';
            const thumbnail = volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail 
                              ? volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')
                              : 'https://via.placeholder.com/128x190?text=Tidak+Ada+Sampul';

            bookCard.innerHTML = `
                <img src="${thumbnail}" alt="Sampul buku ${title}">
                <h3>${title}</h3>
                <p><strong>Penulis:</strong> ${authors}</p>
                <p><strong>Terbit:</strong> ${publishedDate}</p>
                <p>${description}</p>
            `;
            
            bookLink.appendChild(bookCard);
            resultsDiv.appendChild(bookLink);
        });
    }

    searchButton.addEventListener('click', () => {
        searchBooks(searchInput.value);
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchBooks(searchInput.value);
        }
    });

    searchBooks('', true);
});