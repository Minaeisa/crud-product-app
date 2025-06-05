
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let adds = document.getElementById("adds");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");

let mood = "create";
let tmp;


price.addEventListener("input", getTotal);
taxes.addEventListener("input", getTotal);
adds.addEventListener("input", getTotal);
discount.addEventListener("input", getTotal);


function getTotal() {
  if (price.value !== "") {
    let result =
      (+price.value || 0) + (+taxes.value || 0) + (+adds.value || 0) - (+discount.value || 0);
    total.innerHTML = result.toFixed(2);
    total.style.background = "#040";
    total.style.color = "#fff";
  } else {
    total.innerHTML = "";
    total.style.background = " #3B82F6";
    total.style.color = "#fff";
  }
}


let dataPro = localStorage.product ? JSON.parse(localStorage.product).filter(Boolean) : [];


submit.onclick = function () {
  let newPro = {
    title: title.value.trim(),
    price: price.value.trim(),
    taxes: taxes.value.trim() || "0",
    adds: adds.value.trim() || "0",
    discount: discount.value.trim() || "0",
    total: total.innerHTML,
    count: count.value.trim() || "1",
    category: category.value.trim(),
  };

  if (
    newPro.title !== "" &&
    newPro.price !== "" &&
    newPro.category !== "" &&
    (mood === "update" || (+newPro.count > 0 && +newPro.count < 100))
  ) {
    if (mood === "create") {
      if (+newPro.count > 1) {
        for (let i = 0; i < +newPro.count; i++) {
          dataPro.push({ ...newPro });
        }
      } else {
        dataPro.push(newPro);
      }
    } else {
      dataPro[tmp] = newPro;
      mood = "create";
      submit.innerHTML = "Create";
      count.style.display = "block";
    }

    localStorage.setItem("product", JSON.stringify(dataPro));
    clearData();
    showData();
  } else {
    alert("Please fill in all required fields.");
  }
};


function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  adds.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
  count.style.display = "block";
}


function showData() {
  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    if (!dataPro[i]) continue;

    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${dataPro[i].title}</td>
        <td>${dataPro[i].price}</td>
        <td>${dataPro[i].taxes}</td>
        <td>${dataPro[i].adds}</td>
        <td>${dataPro[i].discount}</td>
        <td>${dataPro[i].total}</td>
        <td>${dataPro[i].category}</td>
        <td><button onclick="updateData(${i})">Update</button></td>
        <td><button onclick="deleteData(${i})">Delete</button></td>
      </tr>
    `;
  }
  document.getElementById("tbody").innerHTML = table;

  let btnDeleteAll = document.getElementById("deleteALL");
  if (dataPro.length > 0) {
    btnDeleteAll.innerHTML = `<button onclick="deleteAll()">Delete All (${dataPro.length})</button>`;
  } else {
    btnDeleteAll.innerHTML = "";
  }

  getTotal();
}


function deleteData(i) {
  dataPro.splice(i, 1);
  localStorage.setItem("product", JSON.stringify(dataPro));
  showData();
}


function deleteAll() {
  dataPro = [];
  localStorage.removeItem("product");
  showData();
}


function updateData(i) {
  title.value = dataPro[i].title;
  price.value = dataPro[i].price;
  taxes.value = dataPro[i].taxes;
  adds.value = dataPro[i].adds;
  discount.value = dataPro[i].discount;
  category.value = dataPro[i].category;
  getTotal();
  count.style.display = "none";
  submit.innerHTML = "Update";
  mood = "update";
  tmp = i;
  window.scrollTo({ top: 0, behavior: "smooth" });
}


let searchMood = "title";

function getSearchMood(id) {
  let search = document.getElementById("search");
  searchMood = id === "searchTitle" ? "title" : "category";
  search.placeholder = "Search By " + searchMood;
  search.value = "";
  search.focus();
  showData();
}

function searchData(value) {
  value = value.toLowerCase();
  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    if (!dataPro[i]) continue;

    if (
      (searchMood === "title" && dataPro[i].title.toLowerCase().includes(value)) ||
      (searchMood === "category" && dataPro[i].category.toLowerCase().includes(value))
    ) {
      table += `
        <tr>
          <td>${i + 1}</td>
          <td>${dataPro[i].title}</td>
          <td>${dataPro[i].price}</td>
          <td>${dataPro[i].taxes}</td>
          <td>${dataPro[i].adds}</td>
          <td>${dataPro[i].discount}</td>
          <td>${dataPro[i].total}</td>
          <td>${dataPro[i].category}</td>
          <td><button onclick="updateData(${i})">Update</button></td>
          <td><button onclick="deleteData(${i})">Delete</button></td>
        </tr>
      `;
    }
  }
  document.getElementById("tbody").innerHTML = table;
}

document.getElementById("search").addEventListener("input", function () {
  searchData(this.value);
});


showData();
