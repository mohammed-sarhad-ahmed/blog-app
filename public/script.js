const card = document.querySelector(".card");
const form = document.querySelector(".form");
const input = document.querySelector("input");
const textArea = document.querySelector("textarea");

function handleSubmit(e) {
  e.preventDefault();
  const inputValue = input.value;
  const textAreaValue = textArea.value;
  const DateTime = new Date().toLocaleString();
  const cardHtml = `<div class="card-header">
    ${inputValue}
  </div>
  <div class="card-body">
    <p class="card-text">${textAreaValue}</p>
    <p class="card-text">${DateTime}</p>
  </div>`;

  input.value = "";
  textArea.value = "";
  card.insertAdjacentHTML("afterbegin", cardHtml);
}

form.addEventListener("submit", handleSubmit);
