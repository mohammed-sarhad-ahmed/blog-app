const card = document.querySelector(".card");
const form = document.querySelector(".form");
const input = document.querySelector("input");
const textArea = document.querySelector("textarea");
let deleteBtn = document.querySelector(".deleteAll");

async function handleSubmit(e) {
  const id = crypto.randomUUID();
  e.preventDefault();
  if (card.children.length === 0) {
    card.insertAdjacentHTML(
      "beforeend",
      `<button type="reset" class="btn btn-danger deleteAll">Delete All</button>`
    );
    deleteBtn = document.querySelector(".deleteAll");
    deleteBtn.addEventListener("click", deleteAllHandler);
  }
  const inputValue = input.value;
  const textAreaValue = textArea.value;
  const dateTime = new Date();
  const cardHtml = `
  <div class="a-card">
    <div class="card-header">
      <span>${inputValue} </span>
       <div>
            <i class="fa-regular fa-pen-to-square" data-id=${id} data-type="edit"></i>
            <i class="fa-solid fa-delete-left" data-id=${id} data-type="delete"></i>
          </div>
    </div>
    <div class="card-body">
      <p class="card-text">${textAreaValue}</p>
      <p class="card-text">${dateTime.toLocaleString()}</p>
    </div>
  </div>  
    `;
  const newCard = {
    id,
    name: inputValue,
    content: textAreaValue,
    postDate: dateTime,
  };
  input.value = "";
  textArea.value = "";
  card.insertAdjacentHTML("afterbegin", cardHtml);

  await fetch("http://localhost", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newCard),
  });
}

async function deleteAllHandler(e) {
  card.innerHTML = "";
  await fetch("/", {
    method: "delete",
  });
}

async function handleDeleteItem(id, target) {
  target.remove();
  await fetch(`/${id}`, {
    method: "delete",
  });
}

function handleEditItem(id, target) {
  const tragetName = target.querySelector("[data-type='username']");
  const tragetContent = target.querySelector("[data-type='content']");
  const tragetDate = target.querySelector("[data-type='username']");

  const html = `
  
  
  `;
}

form.addEventListener("submit", handleSubmit);
deleteBtn?.addEventListener("click", deleteAllHandler);
card.addEventListener("click", (e) => {
  if (e.target.dataset.type !== "delete" && e.target.dataset.type !== "edit")
    return;
  const target = document
    .querySelector(`[data-id="${e.target.dataset.id}"]`)
    .closest(".a-card");
  const id = e.target.dataset.id;
  if (e.target.dataset.type === "delete") handleDeleteItem(id, target);

  if (e.target.dataset.type === "edit") handleEditItem(id, target);
});
