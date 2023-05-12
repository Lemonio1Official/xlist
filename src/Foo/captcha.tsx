const Alphabet = "abcdefghijklmnopqrstuvwxyz";

export function randomWord() {
  let word = "";
  for (let i = 0; i < 8; i++) {
    word += Alphabet[Math.floor(Math.random() * 26)];
  }
  return word;
}
