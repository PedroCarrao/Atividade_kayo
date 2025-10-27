const modal = document.getElementById("meuModal");
const modalConteudo = document.getElementById("conteudoModal");
const span = document.querySelector(".fechar");

const form = document.querySelector('.Base-Input');
const inputPesquisa = document.querySelector('.input-pesquisa');
const filmesContainer = document.querySelector('.cards-filmes');

let pesquisaAtual = "";
let paginaAtual = 1;
let carregando = false;
let temMais = true; 


function fazerLogin() {
      const nome = document.getElementById("nome").value;
      const senha = document.getElementById("senha").value;

      if (nome === "" || senha === "") {
        alert("Por favor, preencha todos os campos.");
      } else {
        window.location.href = "inicial.html";
      }
}
function IrOutraPagina() {
    window.location.href = "inicial.html";
}


async function buscarFilmes(titulo) {
  filmesContainer.innerHTML = "";
  const maxPaginas = 3;
  let totalResultados = 0;

  for (let pagina = 1; pagina <= maxPaginas; pagina++) {
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(titulo)}&page=${pagina}&apikey=d4456938`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      totalResultados += data.Search.length;

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
              <p class="avaliacao"> Nao disponivel</p>
              <button class="detalhes" onclick="pegarFilme('${filme.imdbID}')">Detalhes</button>
            </div>
          </div>
        `;
      });
    } else {
      break; 
    }
  }

  if (totalResultados === 0) {
    filmesContainer.innerHTML = `<p>Nenhum filme encontrado.</p>`;
  }
}
  
  form.addEventListener('submit', e => {
    e.preventDefault();
    pesquisaAtual = inputPesquisa.value.trim();
    if (pesquisaAtual === "") return;
    paginaAtual = 1;
    temMais = true;
    buscarFilmes(pesquisaAtual, paginaAtual);
  });
  

  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !carregando && temMais) {
      carregando = true;
      paginaAtual++;
      buscarFilmes(pesquisaAtual, paginaAtual);
    }
  });

async function pegarFilme(filmeID) {
  const url = `https://www.omdbapi.com/?i=${encodeURIComponent(filmeID)}&apikey=d4456938`;
  const response = await fetch(url);
  const data = await response.json();

  modalConteudo.innerHTML = `
    <h2>${data.Title}</h2>
    <img src="${data.Poster !== "N/A" ? data.Poster : 'imagens/sem-poster.png'}" alt="${data.Title}" style="width:150px;">
    <p><strong>Ano:</strong> ${data.Year}</p>
    <p><strong>Genero:</strong> ${data.Genre}</p>
    <p><strong>Diretor:</strong> ${data.Director}</p>
    <p><strong>Sinopse:</strong> ${data.Plot}</p>
  `;

  modal.style.display = "block";
}


span.onclick = function() {
  modal.style.display = "none";
}


window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

