function fazerLogin() {
      const nome = document.getElementById("nome").value;
      const senha = document.getElementById("senha").value;

      if (nome === "" || senha === "") {
        alert("Por favor, preencha todos os campos.");
      } else {
        window.location.href = "inical.html";
      }
}
function IrOutraPagina() {
    window.location.href = "inicial.html";
}

const form = document.querySelector('.Base-Input');
const inputPesquisa = document.querySelector('.input-pesquisa');
const filmesContainer = document.querySelector('.cards-filmes');

let pesquisaAtual = "";
let paginaAtual = 1;
let carregando = false;
let temMais = true; 

async function buscarFilmes(titulo, pagina = 1) {
  const url = `https://www.omdbapi.com/?s=${encodeURIComponent(titulo)}&page=${pagina}&apikey=d4456938`;
  const response = await fetch(url);
  const data = await response.json();

  if (pagina === 1) filmesContainer.innerHTML = "";

  if (data.Response === "True") {
    data.Search.forEach(filme => {
      filmesContainer.innerHTML += `
        <div class="card">
          <img src="${filme.Poster !== "N/A" ? filme.Poster : 'imagens/sem-poster.png'}" 
               alt="${filme.Title}" 
               class="filme-imagem">
          <div class="card-info">
            <h3>${filme.Title}</h3>
            <p>Ano: ${filme.Year}</p>
            <p class="genero">Tipo: ${filme.Type}</p>
            <p class="avaliacao">⭐ Não disponível</p>
          </div>
        </div>
      `;
    });

    const total = parseInt(data.totalResults);
    temMais = !(pagina * 10 >= total);
  } else {
    if (pagina === 1) filmesContainer.innerHTML = `<p>Nenhum filme encontrado.</p>`;
    temMais = false;
  }

  carregando = false;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  pesquisaAtual = inputPesquisa.value.trim();
  if (pesquisaAtual === "") return;
  paginaAtual = 1;
  temMais = true;
  buscarFilmes(pesquisaAtual, paginaAtual);
});

// Rolagem infinita (opcional)
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !carregando && temMais) {
    carregando = true;
    paginaAtual++;
    buscarFilmes(pesquisaAtual, paginaAtual);
  }
});
