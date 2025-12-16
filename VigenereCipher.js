class VigenereCipher {
  constructor(key, alphabetType = "english") {
    this.setAlphabet(alphabetType);
    this.setKey(key);
  }

  setAlphabet(type) {
    if (type === "english") {
      this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      this.alphabetRegex = /^[A-Za-z]+$/;
    } else if (type === "russian") {
      this.alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
      this.alphabetRegex = /^[А-Яа-яЁё]+$/;
    }
    this.alphabetType = type;
  }

  setKey(key) {
    this.originalKey = key;

    this.key = key
      .toUpperCase()
      .split("")
      .filter((char) => this.alphabet.includes(char))
      .join("");
  }

  isValidKey() {
    if (!this.originalKey || this.originalKey.trim() === "") {
      return false;
    }

    const keyUpper = this.originalKey.toUpperCase();

    if (this.alphabetType === "english") {
      const russianRegex = /[А-ЯЁ]/;
      return !russianRegex.test(keyUpper);
    } else if (this.alphabetType === "russian") {
      const englishRegex = /[A-Z]/;
      return !englishRegex.test(keyUpper);
    }

    return false;
  }

  isPureKey() {
    if (!this.originalKey || this.originalKey.trim() === "") {
      return false;
    }

    const keyUpper = this.originalKey.toUpperCase();

    if (this.alphabetType === "english") {
      return /^[A-Z]+$/i.test(this.originalKey);
    } else if (this.alphabetType === "russian") {
      return /^[А-ЯЁа-яё]+$/.test(this.originalKey);
    }

    return false;
  }

  encrypt(text) {
    return this._process(text, true);
  }

  decrypt(text) {
    return this._process(text, false);
  }

  _process(text, encrypt) {
    let result = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const upperChar = char.toUpperCase();

      if (this.alphabet.includes(upperChar)) {
        const keyChar = this.key[keyIndex % this.key.length];
        keyIndex++;

        const charPos = this.alphabet.indexOf(upperChar);
        const keyPos = this.alphabet.indexOf(keyChar);

        let newPos;
        if (encrypt) {
          newPos = (charPos + keyPos) % this.alphabet.length;
        } else {
          newPos =
            (charPos - keyPos + this.alphabet.length) % this.alphabet.length;
        }

        const newChar = this.alphabet[newPos];

        result += char === char.toUpperCase() ? newChar : newChar.toLowerCase();
      } else {
        result += char;
      }
    }

    return result;
  }

  generateSquare() {
    const square = [];
    const n = this.alphabet.length;

    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        row.push(this.alphabet[(i + j) % n]);
      }
      square.push(row);
    }

    return square;
  }

  getCurrentKeyChar(position) {
    if (!this.key) return null;
    return this.key[position % this.key.length];
  }
}
