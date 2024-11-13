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

    ulGenreList.addEventListener("click", handleGenreChange);
}

function handleGenreChange(event) {
    const button = event.target.closest(".genre__button");
    if (!button) return;

    const genreId = Number(button.dataset.genreId);

    document
        .querySelector(".genre__button--active")
        ?.classList.remove("genre__button--active");
    button.classList.add("genre__button--active");

    localStorage.setItem("genreId", genreId);
    filterAlbumsByGenreActive(products);
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
          <strong class="album-item__price">${formatToBRL(
              product.price
          )}</strong>
          <button class="album-item__buy-button">Comprar</button>
        </div>
      </div>
    </article>
  `
        )
        .join("");
}

function filterAlbumsByGenreActive(albumsList) {
    const genreIdActive = Number(localStorage.getItem("genreId")) || 0;

    const filteredAlbumList =
        genreIdActive === 0
            ? filterAlbumsByPrice(albumsList)
            : filterAlbumsByPrice(
                  albumsList.filter((album) => album.category === genreIdActive)
              );

    renderAlbumList(filteredAlbumList);
}

function filterAlbumsByPrice(albumsList) {
    const inputRangeValue = Number(
        document.querySelector("#price-range").value
    );
    return albumsList.filter((album) => album.price <= inputRangeValue);
}

function handleInputRange(albumsList) {
    const inputRange = document.querySelector("#price-range");
    const priceLabel = document.querySelector("#price-label");

    const [minPrice, maxPrice] = albumsList.reduce(
        ([min, max], { price }) => [Math.min(min, price), Math.max(max, price)],
        [Infinity, 0]
    );

    inputRange.value = maxPrice;
    inputRange.min = minPrice;
    inputRange.max = maxPrice;

    priceLabel.textContent = formatToBRL(maxPrice);

    inputRange.addEventListener("input", () => {
        updateInputStyle(inputRange, priceLabel);
        filterAlbumsByGenreActive(albumsList);
    });

    updateInputStyle(inputRange, priceLabel);
}

function updateInputStyle(inputRange, priceLabel) {
    const value = Number(inputRange.value);
    const minValue = Number(inputRange.min);
    const maxValue = Number(inputRange.max);

    priceLabel.textContent = formatToBRL(value);

    const percentage = ((value - minValue) / (maxValue - minValue)) * 100;

    inputRange.style.background = `linear-gradient(to right, var(--color-brand-1) ${percentage}%, var(--color-grey-5) ${percentage}%)`;
}

function formatToBRL(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

renderGenreList(categories);
filterAlbumsByGenreActive(products);
handleInputRange(products);
