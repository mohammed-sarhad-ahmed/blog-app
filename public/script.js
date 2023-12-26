const card = document.querySelector(".card");
const form = document.querySelector(".form");
const input = document.querySelector("input");
const textArea = document.querySelector("textarea");
let deleteBtn = document.querySelector(".deleteAll");
const logout = document.querySelector("#logout");
async function handleSubmit(e) {
  const id = crypto.randomUUID();
  e.preventDefault();
  const numOfCurrentUSerPosts = document.querySelectorAll(
    `[data-username=${input.value}]`
  ).length;
  if (numOfCurrentUSerPosts === 0) {
    card.insertAdjacentHTML(
      "beforeend",
      `<button type="reset" class="btn btn-danger deleteAll">Delete All Your posts</button>`
    );
    deleteBtn = document.querySelector(".deleteAll");
    deleteBtn.addEventListener("click", deleteAllHandler);
  }
  const inputValue = input.value;
  const textAreaValue = textArea.value;
  const dateTime = new Date();
  const cardHtml = `
    <div class="the-card"> 
     <div class="likes">
          <i class="fa-solid fa-up-long" data-type="up" data-id=${id}></i>
          <span class="numOflikes">0</span>
          <i class="fa-solid fa-down-long" data-type="down" data-id=${id}></i>
        </div>
      <div class="a-card">
    <div class="card-header">
      <span data-type="username" data-username='${inputValue}' >YOU</span>
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

    </div>
    `;
  const newCard = {
    id,
    username: inputValue,
    content: textAreaValue,
    postDate: dateTime,
  };
  textArea.value = "";
  card.insertAdjacentHTML("afterbegin", cardHtml);
  await fetch("/", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newCard),
  });
}

async function deleteAllHandler(e) {
  const yourPosts = card.querySelectorAll(`[data-username=${input.value}]`);

  yourPosts.forEach((post) => post.closest(".the-card").remove());
  e.target.remove();

  await fetch("/", {
    method: "delete",
  });
}

async function handleDeleteItem(id, target) {
  target.remove();
  const numOfCurrentUSerPosts = card.querySelector(
    `[data-username='${input.value}']`
  );
  if (!numOfCurrentUSerPosts) card.querySelector(".deleteAll").remove();
  await fetch(`/${id}`, {
    method: "delete",
  });
}
// TODO
function handleEditItem(id, target) {}

function handleLikes(id, blogId, type, target) {
  const el = target.querySelector(".numOflikes");
  if (type === "up") {
    el.innerText = Number(el.innerText) + 1;
    target.querySelector("[data-type='up']").style.color = "red";
    target.querySelector("[data-type='down']").style.color = "white";
  } else if (type === "down") {
    el.innerText = Number(el.innerText) - 1;
    target.querySelector("[data-type='down']").style.color = "red";
    target.querySelector("[data-type='up']").style.color = "white";
  }
  fetch(`/${id}`, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id: crypto.randomUUID(),
      type,
      blogId,
      username: input.value,
    }),
  });
}

form.addEventListener("submit", handleSubmit);
deleteBtn?.addEventListener("click", deleteAllHandler);
card.addEventListener("click", (e) => {
  if (
    e.target.dataset.type !== "delete" &&
    e.target.dataset.type !== "edit" &&
    e.target.dataset.type !== "up" &&
    e.target.dataset.type !== "down"
  )
    return;
  const target = document
    .querySelector(`[data-id="${e.target.dataset.id}"]`)
    .closest(".the-card");
  const id = e.target.dataset.id;
  if (e.target.dataset.type === "delete") handleDeleteItem(id, target);

  if (e.target.dataset.type === "edit") handleEditItem(id, target);

  if (e.target.dataset.type === "up" || e.target.dataset.type === "down")
    handleLikes(id, e.target.dataset.id, e.target.dataset.type, target);
});
