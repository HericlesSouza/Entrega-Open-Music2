import { categories, products } from "./database.js";

const genreActive = Number(localStorage.getItem("genreId")) || 0;

function renderGenreList(genreList) {
    const ulGenreList = document.querySelector("#ul-genre-list");

    const fragment = document.createDocumentFragment();

    genreList.forEach((element, index) => {
        const li = document.createElement("li");
        li.classList.add("genre-list__item");

        const button = document.createElement("button");
        button.classList.add("genre__button");
        if (index === genreActive) {
            button.classList.add("genre__button--active");
        }
        button.dataset.genreId = index;
        button.textContent = element;

        li.appendChild(button);
        fragment.appendChild(li);
    });

    ulGenreList.appendChild(fragment);

    ulGenreList.addEventListener("click", (event) => {
        const button = event.target.closest(".genre__button");
        if (!button) return;

        const index = Number(button.dataset.genreId);

        const currentButtonActive = document.querySelector(
            ".genre__button--active"
        );
        if (currentButtonActive) {
            currentButtonActive.classList.remove("genre__button--active");
        }

        localStorage.setItem("genreId", index);
        button.classList.add("genre__button--active");
        filterAlbumsByGenreId(index, products);
    });
}

function renderAlbumList(albumsList) {
    const divAlbumList = document.querySelector("#albums-list");
    divAlbumList.innerHTML = "";

    divAlbumList.innerHTML = albumsList
        .map(
            (product) => `
    <article class="list__album-item">
      <figure class="album-item__figure">
        <img
          class="figure__album-cover"
          src="${product.img}"
          alt="Capa do álbum ${product.title} de ${product.band}"
        />
      </figure>
      <div class="album-item__info">
        <div class="info__artist-info">
          <p>${product.band}</p>
          <p>${product.year}</p>
        </div>
        <h3 class="info__title">${product.title}</h3>
        <div class="info__album-buy">
          <strong class="album-item__price">R$ ${product.price.toFixed(
              2
          )}</strong>
          <button class="album-item__buy-button">Comprar</button>
        </div>
      </div>
    </article>
  `
        )
        .join("");
}

function filterAlbumsByGenreId(genreId, albumsList) {
    const filteredAlbumList =
        genreId === 0
            ? albumsList
            : albumsList.filter((element) => element.category === genreId);
    renderAlbumList(filteredAlbumList);
}

renderGenreList(categories);
filterAlbumsByGenreId(genreActive, products);
