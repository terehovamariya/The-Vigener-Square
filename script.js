let cipher = new VigenereCipher("KEY", "english");
let currentSquare = [];

function init() {
  updateSquare();
  updateExample();
  validateKey();

  document.getElementById("encryptBtn").addEventListener("click", encryptText);
  document.getElementById("decryptBtn").addEventListener("click", decryptText);
  document
    .getElementById("alphabet")
    .addEventListener("change", handleAlphabetChange);
  document.getElementById("key").addEventListener("input", handleKeyInput);
}

function validateKey() {
  const key = document.getElementById("key").value;
  const alphabet = document.getElementById("alphabet").value;

  cipher.setAlphabet(alphabet);
  cipher.setKey(key);

  const keyStatus = document.getElementById("keyStatus");
  const encryptBtn = document.getElementById("encryptBtn");
  const decryptBtn = document.getElementById("decryptBtn");

  if (!key || key.trim() === "") {
    keyStatus.innerHTML = '<span class="key-invalid">Введите ключ</span>';
    encryptBtn.disabled = true;
    decryptBtn.disabled = true;
    return false;
  }

  if (!cipher.isPureKey()) {
    const langName = alphabet === "english" ? "английского" : "русского";
    const otherLangName = alphabet === "english" ? "русские" : "латинские";
    keyStatus.innerHTML = `<span class="key-invalid">Ошибка: ключ должен содержать только буквы ${langName} алфавита. Удалите ${otherLangName} буквы.</span>`;
    encryptBtn.disabled = true;
    decryptBtn.disabled = true;
    return false;
  }

  if (cipher.key.length === 0) {
    keyStatus.innerHTML =
      '<span class="key-invalid">Ключ не содержит букв выбранного алфавита</span>';
    encryptBtn.disabled = true;
    decryptBtn.disabled = true;
    return false;
  }

  keyStatus.innerHTML = `<span class="key-valid">✓ Ключ корректен.</span>`;
  encryptBtn.disabled = false;
  decryptBtn.disabled = false;
  return true;
}

function updateSquare() {
  const alphabet = document.getElementById("alphabet").value;
  cipher.setAlphabet(alphabet);
  cipher.setKey(document.getElementById("key").value);

  currentSquare = cipher.generateSquare();
  const table = document.getElementById("vigenereSquare");
  const alphabetStr = cipher.alphabet;

  table.innerHTML = "";

  if (alphabet === "russian") {
    table.classList.add("russian-table");
  } else {
    table.classList.remove("russian-table");
  }

  const headerRow = document.createElement("tr");
  const emptyHeader = document.createElement("th");
  emptyHeader.textContent = "";
  headerRow.appendChild(emptyHeader);

  for (let i = 0; i < alphabetStr.length; i++) {
    const th = document.createElement("th");
    th.textContent = alphabetStr[i];
    th.title = `Столбец ${i + 1}: ${alphabetStr[i]}`;
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  for (let i = 0; i < alphabetStr.length; i++) {
    const row = document.createElement("tr");

    const rowHeader = document.createElement("th");
    rowHeader.textContent = alphabetStr[i];
    rowHeader.title = `Строка ${i + 1}: ${alphabetStr[i]}`;
    row.appendChild(rowHeader);

    for (let j = 0; j < alphabetStr.length; j++) {
      const cell = document.createElement("td");
      const letter = currentSquare[i][j];
      cell.textContent = letter;
      cell.id = `cell-${i}-${j}`;
      cell.title = `${alphabetStr[i]} + ${alphabetStr[j]} = ${letter}`;

      if (letter === "Ё" || letter === "Й") {
        cell.classList.add("small-letter");
      }

      row.appendChild(cell);
    }

    table.appendChild(row);
  }
}

function highlightInSquare(text, encrypt) {
  const cells = document.querySelectorAll("#vigenereSquare td");
  cells.forEach((cell) => cell.classList.remove("highlight"));

  const inputText = text.toUpperCase();
  const alphabet = cipher.alphabet;
  let keyIndex = 0;

  for (let i = 0; i < inputText.length; i++) {
    const char = inputText[i];
    if (alphabet.includes(char)) {
      const keyChar = cipher.getCurrentKeyChar(keyIndex);
      keyIndex++;

      if (keyChar) {
        const row = alphabet.indexOf(keyChar);
        let col;

        if (encrypt) {
          col = alphabet.indexOf(char);
        } else {
          col =
            (alphabet.indexOf(char) -
              alphabet.indexOf(keyChar) +
              alphabet.length) %
            alphabet.length;
        }

        const cell = document.getElementById(`cell-${row}-${col}`);
        if (cell) {
          cell.classList.add("highlight");
        }
      }
    }
  }
}

function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";

  setTimeout(() => {
    errorDiv.style.display = "none";
  }, 5000);
}

function hideError() {
  document.getElementById("errorMessage").style.display = "none";
}

function encryptText() {
  hideError();

  if (!validateKey()) {
    showError("Невозможно зашифровать: ключ содержит буквы другого алфавита");
    return;
  }

  const text = document.getElementById("text").value;
  const result = cipher.encrypt(text);
  document.getElementById("result").textContent = result;
  highlightInSquare(text, true);
}

function decryptText() {
  hideError();

  if (!validateKey()) {
    showError("Невозможно расшифровать: ключ содержит буквы другого алфавита");
    return;
  }

  const text = document.getElementById("text").value;
  const result = cipher.decrypt(text);
  document.getElementById("result").textContent = result;
  highlightInSquare(text, false);
}

function updateExample() {
  const alphabet = document.getElementById("alphabet").value;
  const key = document.getElementById("key").value || "KEY";

  let example;
  if (alphabet === "english") {
    example = "HELLO WORLD";
  } else {
    example = "ПРИВЕТ МИР";
  }

  document.getElementById("text").value = example;
  document.getElementById("key").value = key;

  validateKey();
}

function handleAlphabetChange() {
  updateSquare();
  updateExample();
  validateKey();
}

function handleKeyInput() {
  cipher.setKey(this.value);
  updateSquare();
  validateKey();
}

window.onload = init;
