function initStorage() {
  if (!localStorage.getItem("products-data")) {
    localStorage.setItem("products-data", "[]");
  }
}
initStorage();

function setProductsToStorage(students) {
  localStorage.setItem("products-data", JSON.stringify(students));
}

function getProductsFromStorage() {
  let students = JSON.parse(localStorage.getItem("products-data"));
  return students;
}

// ! read
function render(data = getProductsFromStorage()) {
  let container = document.querySelector(".container");
  container.innerHTML = "";
  // let data = getProductsFromStorage();
  data.forEach((item, index) => {
    container.innerHTML += `
      <div class="card" style="width: 18rem;" id="${index}">
          <img src="${item.url}" class="card-img-top" alt="...">
          <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text"><b>Surname</b>: ${item.name}</p>
              <p class="card-text"><b>Number</b>: ${item.number}</p>
              <p class="card-text"><b>Weekly KPI</b>: ${item.weekly}</p>
              <p class="card-text"><b>Monthly KPI</b>: ${item.monthly} </p>
              <a href="#" class="btn btn-danger" id="delete-product-btn">Delete</a>
              <a href="#" class="btn btn-success"id="update-product-btn"data-bs-toggle="modal"
              data-bs-target="#staticBackdrop">Update</a>
          </div>
      </div>
      `;
  });
  if (data.length === 0) return;
  addDeleteEvent();
  addUpdateEvent();
}
render();

// ! create
function createProduct() {
  let imgInp = document.querySelector("#product-url-inp");
  let titleInp = document.querySelector("#product-title-inp");
  let nameInp = document.querySelector("#position-title-inp");
  let numberInp = document.querySelector("#skills-title-inp");
  let weeklyInp = document.querySelector("#product-work-inp");
  let monthlyInp = document.querySelector("#product-price-inp");

  let studentObj = {
    url: imgInp.value,
    title: titleInp.value,
    name: nameInp.value,
    number: numberInp.value,
    weekly: weeklyInp.value,
    monthly: monthlyInp.value,
  };

  let students = getProductsFromStorage();
  students.push(studentObj);
  setProductsToStorage(students);

  imgInp.value = "";
  titleInp.value = "";
  nameInp.value = "";
  numberInp.value = "";
  weeklyInp.value = "";
  monthlyInp.value = "";

  render();
}
let addProductBtn = document.querySelector("#add-product-btn");
addProductBtn.addEventListener("click", createProduct);

// ! delete
function deleteProduct(e) {
  let productId = e.target.parentNode.parentNode.id;
  let students = getProductsFromStorage();
  students.splice(productId, 1);
  setProductsToStorage(students);
  render();
}

function addDeleteEvent() {
  let deleteBtns = document.querySelectorAll("#delete-product-btn");
  deleteBtns.forEach(item => item.addEventListener("click", deleteProduct));
}

// ! update
let imgInp = document.querySelector("#product-url-inp");
let titleInp = document.querySelector("#product-title-inp");
let nameInp = document.querySelector("#position-title-inp");
let numberInp = document.querySelector("#skills-title-inp");
let weeklyInp = document.querySelector("#product-work-inp");
let monthlyInp = document.querySelector("#product-price-inp");
let saveChangesBtn = document.querySelector("#save-changes-btn");
console.log(imgInp);

function getOneProductById(id) {
  let studentObj = getProductsFromStorage()[+id];
  return studentObj;
}

function updateProduct(e) {
  let productId = e.target.parentNode.parentNode.id;
  let studentObj = getOneProductById(productId);
  imgInp.value = studentObj.url;
  titleInp.value = studentObj.title;
  nameInp.value = studentObj.name;
  numberInp.value = studentObj.number;
  weeklyInp.value = studentObj.weekly;
  monthlyInp.value = studentObj.monthly;
  saveChangesBtn.setAttribute("id", productId);
}

function saveChanges(e) {
  if (!saveChangesBtn.id) return;
  let students = getProductsFromStorage();
  let studentObj = students[+saveChangesBtn.id];
  studentObj.url = imgInp.value;
  studentObj.title = titleInp.value;
  studentObj.name = nameInp.value;
  studentObj.number = numberInp.value;
  studentObj.weekly = weeklyInp.value;
  studentObj.monthly = monthlyInp.value;
  setProductsToStorage(students);
  imgInp.value = "";
  titleInp.value = "";
  nameInp = "";
  numberInp = "";
  weeklyInp = "";
  monthlyInp.value = "";
  saveChangesBtn.removeAttribute("id");
  render();
}

saveChangesBtn.addEventListener("click", saveChanges);

function addUpdateEvent() {
  let updateBtns = document.querySelectorAll("#update-product-btn");
  updateBtns.forEach(item => {
    item.addEventListener("click", updateProduct);
  });
}

// ! search
let searchInp = document.querySelector("#search-inp");
searchInp.addEventListener("input", e => {
  let students = getProductsFromStorage();
  students = students.filter(item => {
    return (
      item.title.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
    );
  });
  render((data = students));
});

const STUDENTS_API = "http://localhost:8001/students";

// ! pagination
let nextPage = document.querySelector("#next-page");
let prevPage = document.querySelector("#prev-page");

async function checkPages() {
  let students = await fetch(STUDENTS_API);
  let data = await students.json();
  let pages = Math.ceil(data.lenght / 3);

  if (currentPage === 1) {
    prevPage.style.display = "none";
    nextPage.style.display = "block";
  } else if (currentPage === pages) {
    prevPage.style.display = "block";
    nextPage.style.display = "none";
  } else {
    prevPage.style.display = "block";
    nextPage.style.display = "block";
  }
}
checkPages();

nextPage.addEventListener("click", () => {
  currentPage++;
  render();
  checkPages();
});

prevPage.addEventListener("click", () => {
  currentPage--;
  render();
  checkPages();
});
