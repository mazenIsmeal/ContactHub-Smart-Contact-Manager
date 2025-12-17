var inputName = document.getElementById("inputName");
var inputNumber = document.getElementById("inputnumber");
var inputEmail = document.getElementById("inputEmail");
var inputAddress = document.getElementById("inputAddress");
var inputSelect = document.getElementById("inputSelect");
var inputTextarea = document.getElementById("inputTextarea");
var imageInput = document.getElementById("imageInput");
var avatarImg = document.getElementById("avatarImg");
var firstChart = document.getElementById("firstChart");
var addBtn = document.getElementById("add");
var updateBtn = document.getElementById("update");
var fav = document.getElementById("favoritt");
var emergency = document.getElementById("emergency");
var allProducts =
  JSON.parse(localStorage.getItem("items")) || "Click the addContact";
var updateItem;

displayItem();
displayFav();
displayEmg();

function addProduct() {
  // no send data not valid
  if (
    inputName.classList.contains("is-valid") &&
    inputNumber.classList.contains("is-valid") &&
    inputEmail.classList.contains("is-valid")
  ) {
    Swal.fire({
      title: "Drag me!",
      icon: "success",
      draggable: true,
    });
    // valid is number is already registered
    var existNumber = allProducts.find(function (item) {
      return item.number === inputNumber.value;
    });

    if (existNumber) {
      Swal.fire({
        icon: "warning",
        title: "Number already exists",
        text: "This phone number is already registered",
      });
      return;
    }

    if (imageInput.files[0]) {
      reader = new FileReader();
      reader.readAsDataURL(imageInput.files[0]);
      reader.onload = function () {
        var newProduct = {
          id: Date.now(),
          name: inputName.value,
          number: inputNumber.value,
          fav: fav.checked,
          emg: emergency.checked,
          email: inputEmail.value,
          address: inputAddress.value,
          select: inputSelect.value,
          textarea: inputTextarea.value,
          image: reader.result,
        };
        allProducts.push(newProduct);
        displayItem();
        saveItem();
        clearForm();
        displayFav();
        displayEmg();
      };
    } else {
      var newProduct = {
        id: Date.now(),
        name: inputName.value,
        number: inputNumber.value,
        fav: fav.checked,
        emg: emergency.checked,
        email: inputEmail.value,
        address: inputAddress.value,
        select: inputSelect.value,
        textarea: inputTextarea.value,
        image: "",
      };
      allProducts.push(newProduct);

      displayItem();
      saveItem();
      clearForm();
      displayFav();
      displayEmg();
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "pleas enter input data Or this Number already regester",
    });
  }
}

// display item
function displayItem(arr = allProducts) {
  if (!arr || arr.length === 0) {
    document.getElementById("displayItems").innerHTML = `
      <i class="fa-solid fa-address-book"></i>
      <p class="text-center text-muted my-4">No contacts found</p>
      <p class="text-center text-muted">Click "Add Contact" to get started</p>
    `;
    document.getElementById("totalItems").innerHTML = 0;
    document.getElementById("counterLength").innerHTML =
      "Manage and organize your 0 contacts";
    return;
  }
  var htmlMarkUp = "";

  for (var i = 0; i < arr.length; i++) {
    htmlMarkUp += `
    <div class="col-6 mb-2">
      <div class="box bg-light">
    <div class="header-box d-flex align-items-center gap-2">
      <div class="wrapper-image">
      <img src="${arr[i].image}" class="w-100 d-block" id="test" alt=""></img>
      <div id="firstChart" class="chart">${getChartname(arr[i].name)}</div>
      <div class='show' id=''><i class="fa-solid fa-star"></i></div>
      <div class='showHeart'><i class='fa-solid fa-heart-pulse'></i></div>
      </div>
      <div class="wrapper-text">
        <h3 class="h5 m-0">${arr[i].name}</h3>
        <div class="icon">
          <i class="fa-solid fa-phone"></i>
          <span>${arr[i].number}</span>
        </div>
      </div>
    </div>
    <div class="body-box ">
      <div class="d-flex align-items-center gap-2 my-3">
        <i class="fa-solid fa-envelope"></i>
        <p class="m-0">${arr[i].email}</p>
      </div>
      <div class="d-flex align-items-center gap-2 my-3">
        <i class="fa-solid fa-location-dot location"></i>
        <p class="m-0">${arr[i].address}</p>
      </div>
      <div class="other">
        <p>${arr[i].select}</p>
      </div>
    </div>
    <div class="footer-box d-flex  alighn-items-center justify-content-between">
      <div class="right-icon">
        <i class="fa-solid fa-phone"></i>
        <i class="fa-solid fa-envelope"></i>
      </div>
      <div class="left-icon">
        <i onclick="toggleIconFav(this, ${arr[i].id})" class=" ${
      arr[i].fav == true ? "fa-solid fa-star" : "fa-regular fa-star"
    }"></i>
        <i onclick='toggleIconEmg(this, ${arr[i].id})' class=" ${
      arr[i].emg == true ? "fa-solid fa-heart-pulse" : "fa-regular fa-heart"
    }"></i>
        <i class="fa-solid fa-pen" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="updateItemContact(${
          arr[i].id
        })"></i>
        <i class="fa-solid fa-trash-can" onclick="deleteItem(${arr[i].id})"></i>
      </div>
    </div>
  </div>
    </div>
    `;
  }
  document.getElementById("displayItems").innerHTML = htmlMarkUp;
  document.getElementById("totalItems").innerHTML = allProducts.length;
  document.getElementById(
    "counterLength"
  ).innerHTML = `Manage and organize your ${allProducts.length} contacts`;
}
// <i class="fa-solid fa-star"></i>
// live image
imageInput.onchange = function () {
  var reader = new FileReader();
  reader.readAsDataURL(imageInput.files[0]);
  reader.onload = function () {
    avatarImg.setAttribute("src", reader.result);
    document
      .getElementById("avatarIcon")
      .classList.replace("d-block", "d-none");
  };
};

// delete item
function deleteItem(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
      allProducts = allProducts.filter(function (item) {
        return item.id != id;
      });
      displayItem();
      saveItem();
      displayFav();
      displayEmg();
    }
  });
}

// Local Storage allProduct
function saveItem() {
  localStorage.setItem("items", JSON.stringify(allProducts));
}

// update item contact
function updateItemContact(id) {
  addBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
  updateItem = allProducts.find(function (item) {
    return item.id == id;
  });

  inputName.value = updateItem.name;
  inputNumber.value = updateItem.number;
  inputEmail.value = updateItem.email;
  inputAddress.value = updateItem.address;
  inputSelect.value = updateItem.select;

  document.getElementById("title").innerHTML = "Edit Contact";
}

function updateContact() {
  firstChart = inputName.value.charAt(0);
  if (imageInput.files[0]) {
    reader = new FileReader();
    reader.readAsDataURL(imageInput.files[0]);
    reader.onload = function () {
      updateItem.name = inputName.value;
      updateItem.number = inputNumber.value;
      updateItem.email = inputEmail.value;
      updateItem.address = inputAddress.value;
      updateItem.select = inputSelect.value;
      updateItem.image = reader.result;
      displayItem();
      saveItem();
      clearForm();
      displayFav();
      displayEmg();
    };
  } else {
    updateItem.name = inputName.value;
    updateItem.number = inputNumber.value;
    updateItem.email = inputEmail.value;
    updateItem.address = inputAddress.value;
    updateItem.select = inputSelect.value;
    updateItem.image = firstChart;
    displayItem();
    saveItem();
    clearForm();
    displayFav();
    displayEmg();
  }
}

function clearForm() {
  inputName.value = null;
  inputNumber.value = null;
  inputEmail.value = null;
  inputAddress.value = null;
  inputSelect.value = null;
  inputTextarea.value = null;
}

// search data
function search(term) {
  var newArr = allProducts.filter(function (item) {
    return (
      item.name.toLowerCase().includes(term.toLowerCase()) ||
      item.number.includes(term) ||
      item.email.includes(term)
    );
  });
  displayItem(newArr);
}

function toggleIconFav(el, id) {
  // convert true or fleas
  var findItemFav = allProducts.find(function (product) {
    return product.id == id;
  });
  findItemFav.fav = !findItemFav.fav;
  saveItem();
  // convert icon
  if (el.classList.contains("fa-solid")) {
    el.classList.replace("fa-solid", "fa-regular");
  } else {
    el.classList.replace("fa-regular", "fa-solid");
  }
  // convert on action
  displayFav();
}
// favorites
function displayFav() {
  var favList = allProducts.filter(function (favProduct) {
    return favProduct.fav === true;
  });

  var htmlMarkUp = "";

  if (favList.length === 0) {
    htmlMarkUp = `
      <div class="undefiund text-center my-4">
        <p>No favorites yet</p>
      </div>
    `;
  } else {
    for (var i = 0; i < favList.length; i++) {
      var imageHTML = "";
      if (favList[i].image && favList[i].image.trim() !== "") {
        imageHTML = `<img src="${favList[i].image}" alt="" class="wrapper-image" />`;
      } else {
        imageHTML = `
          <div class="icon p-3 me-3 my-2 chart">
            ${getChartname(favList[i].name)}
          </div>
        `;
      }
      htmlMarkUp += `
        <div class="card-fav rounded-3 px-2 py-2">
          ${imageHTML}
          <div class="text-fav">
            <h4 class="m-0">${favList[i].name}</h4>
            <p class="m-0">${favList[i].number}</p>
          </div>

          <a class="link-fav p-2 rounded-3" href="tel:${favList[i].number}">
            <i class="fa-solid fa-phone" style="color: #63E6BE;"></i>
          </a>
        </div>
      `;
    }
  }

  document.getElementById("favLength").innerHTML = favList.length;
  document.getElementById("favorites").innerHTML = htmlMarkUp;
}

function getChartname(fullname) {
  var parts = fullname.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 1).toUpperCase();
  }

  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function toggleIconEmg(el, id) {
  var findEmgItem = allProducts.find(function (product) {
    return product.id == id;
  });
  findEmgItem.emg = !findEmgItem.emg;
  saveItem();
  if (el.classList.contains("fa-heart-pulse")) {
    el.classList.replace("fa-heart-pulse", "fa-heart");
  } else {
    el.classList.replace("fa-heart", "fa-heart-pulse");
  }
  displayEmg();
}

function displayEmg() {
  var emgList = allProducts.filter(function (product) {
    return product.emg === true;
  });
  var htmlMarkUp = "";
  if (emgList.length === 0) {
    htmlMarkUp = `
    <div class="undefiund2 ">
      <p>No emergency contacts</p>
    </div>
    `;
  } else {
    for (var i = 0; i < emgList.length; i++) {
      var imageHTML = "";
      if (emgList[i].image && emgList[i].image.trim() !== "") {
        imageHTML = `<img src="${emgList[i].image}" alt="" class="wrapper-image" />`;
      } else {
        imageHTML = `
          <div class="icon p-3 me-3 my-2 chart">
            ${getChartname(emgList[i].name)}
          </div>
        `;
      }
      htmlMarkUp += `
      
      <div class="card-fav2 rounded-3 px-2 py-2">
      ${imageHTML}
        <div class="text-fav2">
          <h4 class="m-0">${emgList[i].name}</h4>
          <p class="m-0">${emgList[i].number}</p>
        </div>
        <a class="link-fav2 p-2 rounded-3" href="tel:${emgList[i].number}"><i class="fa-solid fa-phone"
            style="color: #d67168;"></i></a>
      </div>
      `;
    }
  }
  document.getElementById("emgInner").innerHTML = htmlMarkUp;
  document.getElementById("emgLength").innerHTML = emgList.length;
}

// validation function
function validationInputs(element) {
  console.log(element.id, element.value);
  // create object for all regex input
  var regex = {
    inputName: /^\w{2,20}\s?\w{2,20}?$/i,
    inputnumber: /^(002|\+2)?01[0125][0-9]{8}$/,
    inputEmail: /^\w{2,20}@(gmail|yhaoo)\.com$/,
  };
  if (regex[element.id].test(element.value) == true) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    element.nextElementSibling.classList.add("d-none");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    element.nextElementSibling.classList.remove("d-none");
  }
}
