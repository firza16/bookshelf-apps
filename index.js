const buku = [];
const RENDER_EVENT = "render-todo";
const SAVED_EVENT = "saved-buku";
const STORAGE_KEY = "BUKU_APPS";

function generateId() {
  return +new Date();
}

function generateObjekBuku(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBuku(bukuId) {
  for (bukuItem of buku) {
    if (bukuItem.id === bukuId) {
      return bukuItem;
    }
  }
  return null;
}

function findBukuIndex(bukuId) {
  for (index in buku) {
    if (buku[index].id === bukuId) {
      return index;
    }
  }
  return -1;
}

function isiDataBuku(objekBuku) {
  const { id, title, author, year, isComplete } = objekBuku;

  const textJudul = document.createElement("h3");
  textJudul.innerText = title;

  const textPenulis = document.createElement("p");
  textPenulis.innerText = "Penulis : " + author;

  const textTahun = document.createElement("p");
  textTahun.innerText = "Tahun terbit : " + year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textJudul, textPenulis, textTahun);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `buku-${id}`);

  if (isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      batalinBukuSelesai(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      hapusBukuSelesai(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      tambahBukuSelesai(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      hapusBukuSelesai(id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function tambahBuku() {
  const judulBuku = document.getElementById("judul").value;
  const penulisBuku = document.getElementById("penulis").value;
  const tahunTerbit = parseInt(document.getElementById("tahun").value);
  const isCompleted = document.getElementById("cek-buku").checked;

  const generatedID = generateId();
  const objekBuku = generateObjekBuku(generatedID, judulBuku, penulisBuku, tahunTerbit, isCompleted);
  buku.push(objekBuku);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function tambahBukuSelesai(bukuId) {
  const bukuTarget = findBuku(bukuId);
  if (bukuTarget == null) return;

  bukuTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function hapusBukuSelesai(bukuId) {
  const bukuTarget = findBukuIndex(bukuId);
  if (bukuTarget === -1) return;
  buku.splice(bukuTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function batalinBukuSelesai(bukuId) {
  const bukuTarget = findBuku(bukuId);
  if (bukuTarget == null) return;

  bukuTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    tambahBuku();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  console.log(buku);
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
  const belumDibaca = document.getElementById("belum-dibaca");
  const sudahDibaca = document.getElementById("sudah-dibaca");

  belumDibaca.innerHTML = "";
  sudahDibaca.innerHTML = "";

  for (const bukuItem of buku) {
    const todoElement = isiDataBuku(bukuItem);
    if (bukuItem.isComplete) {
      sudahDibaca.appendChild(todoElement);
    } else {
      belumDibaca.appendChild(todoElement);
    }
  }
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(buku);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const buk of data) {
      buku.push(buk);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
