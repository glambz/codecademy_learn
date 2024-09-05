const fetchAllButton = document.getElementById("fetch-quotes");
const fetchRandomButton = document.getElementById("fetch-random");
const fetchByAuthorButton = document.getElementById("fetch-by-author");

const quoteContainer = document.getElementById("quote-container");
const quoteText = document.querySelector(".quote");
const attributionText = document.querySelector(".attribution");

const modal = document.getElementById("myModal");
const span = document.querySelector(".close");
let idEdit = 0;
const editQuote = document.getElementById("edit-quote");
const editPerson = document.getElementById("edit-person");
const submitEdit = document.getElementById("submit-edit");

const fetchAllHandle = () => {
  fetch("/api/quotes")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      renderQuotes(response.quotes);
    });
};

const fetchRandomHandle = () => {
  fetch("/api/quotes/random")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      renderQuotes([response.quote]);
    });
};

const fetchByAuthorHandle = () => {
  const author = document.getElementById("author").value;
  fetch(`/api/quotes?person=${author}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
    .then((response) => {
      renderQuotes(response.quotes);
    });
};

const deleteHandle = (e) => {
  e.preventDefault();
  fetch(`/api/quotes/${quote.id}`, { method: "DELETE" })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          const error = new Error(err.message || "An error occurred");
          error.status = response.status;
          throw error;
        });
      }
      return response.json();
    })
    .then((res) => {
      console.log(res.msg);
      alert(res.msg);
    })
    .catch((err) => {
      alert(err.message);
    });
};

const submitEditHandle = (e) => {
  e.preventDefault();
  fetch(
    `/api/quotes/${idEdit}?quote=${editQuote.value}&person=${editPerson.value}`,
    {
      method: "PUT",
    }
  )
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          const error = new Error(err.message || "An error occurred");
          error.status = response.status;
          throw error;
        });
      }
      return response.json();
    })
    .then((res) => {
      console.log(res.msg);
      modal.style.display = "none";
      alert(res.msg);
    })
    .catch((err) => {
      alert(err.message);
    });
};

const resetQuotes = () => {
  quoteContainer.innerHTML = "";
};

const renderError = (response) => {
  quoteContainer.innerHTML = `<p>Your request returned an error from the server: </p>
<p>Code: ${response.status}</p>
<p>${response.statusText}</p>`;
};

const renderQuotes = (quotes = []) => {
  resetQuotes();
  if (quotes.length > 0) {
    console.log(quotes);
    quotes.forEach((quote) => {
      const newQuote = document.createElement("div");
      const cont = document.createElement("div");
      const editButton = document.createElement("button");
      const deleteButton = document.createElement("button");
      editButton.innerHTML = "Edit";
      deleteButton.innerHTML = "Delete";
      newQuote.className = "single-quote";
      newQuote.innerHTML = `<div class="quote-text">${quote.quote}</div>
      <div class="attribution">- ${quote.person}</div>`;
      cont.append(editButton, deleteButton);
      newQuote.prepend(cont);
      editButton.addEventListener("click", (e) => {
        e.preventDefault();
        editQuote.value = quote.quote;
        editPerson.value = quote.person;
        idEdit = quote.id;
        modal.style.display = "block";
      });
      deleteButton.addEventListener("click", deleteHandle);
      quoteContainer.appendChild(newQuote);
    });
  } else {
    quoteContainer.innerHTML = "<p>Your request returned no quotes.</p>";
  }
};

fetchAllButton.addEventListener("click", fetchAllHandle);

fetchRandomButton.addEventListener("click", fetchRandomHandle);

fetchByAuthorButton.addEventListener("click", fetchByAuthorHandle);

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

submitEdit.addEventListener("click", submitEditHandle);
