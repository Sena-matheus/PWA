
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Running`)
  })

document.getElementById('movie-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const movieTitle = document.getElementById('movie-title').value;
    const apiKey = '99568e6c'; // Chave de API do OMDb

    // URL
    const apiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                // Dados do filme
                document.getElementById('movie-info').innerHTML = `
                    <h2>${data.Title} (${data.Year})</h2>
                    <img src="${data.Poster}" alt="Poster do Filme">
                    <p><strong>Gênero:</strong> ${data.Genre}</p>
                    <p><strong>Diretor:</strong> ${data.Director}</p>
                    <p><strong>Atores:</strong> ${data.Actors}</p>
                    <p><strong>Sinopse:</strong> ${data.Plot}</p>
                `;
            } else {
                // Erro filme não encontrado
                document.getElementById('movie-info').innerHTML = `<p>Filme não encontrado. Tente outro título.</p>`;
            }
        })
        .catch(error => {
            console.error('Erro ao buscar os dados:', error);
            document.getElementById('movie-info').innerHTML = `<p>Ocorreu um erro ao buscar os dados. Tente novamente.</p>`;
        });
});
