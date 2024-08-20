// Import the encryptors functions here.
const cipher = require("./encryptors.js");
let cipherMethodChosen = "caesar";
let caesarShift = 5;

const encodeMessage = (str) => {
  if (cipherMethodChosen === "caesar") {
    return cipher.caesar(str, caesarShift);
  } else if (cipherMethodChosen === "symbol") {
    return cipher.symbol(str);
  } else if (cipherMethodChosen === "reverse") {
    return cipher.reverse(str);
  } else {
    return cipher.reverse(cipher.symbol(cipher.caesar(str, caesarShift)));
  }
};

const decodeMessage = (str) => {
  if (cipherMethodChosen === "caesar") {
    return cipher.caesar(str, caesarShift * -1);
  } else if (cipherMethodChosen === "symbol") {
    return cipher.symbol(str);
  } else if (cipherMethodChosen === "reverse") {
    return cipher.reverse(str);
  } else {
    return cipher.reverse(cipher.symbol(cipher.caesar(str, caesarShift * -1)));
  }
};

// User input / output.

const handleInput = (userInput) => {
  const str = userInput.toString().trim();
  let output;
  if (process.argv[2] === "encode") {
    output = encodeMessage(str);
  }
  if (process.argv[2] === "decode") {
    output = decodeMessage(str);
  }

  process.stdout.write(output + "\n");
  process.exit();
};

const handleCipherMethod = (userInput) => {
  const str = userInput.toString().trim().toLowerCase();
  if (str === "caesar" || str === "symbol" || str === "reverse") {
    cipherMethodChosen = str;
    if (str === "caesar") {
      process.stdout.write("Enter the caesar shift number...\n> ");
      process.stdin.once("data", handleCipherMethodCaesarShift);
    } else {
      process.stdout.write(
        "Enter the message you would like to encrypt...\n> "
      );
      process.stdin.once("data", handleInput);
    }
  } else {
    cipherMethodChosen = "mix";
    process.stdout.write("Enter the message you would like to encrypt...\n> ");
    process.stdin.once("data", handleInput);
  }
};

const handleCipherMethodCaesarShift = (userInput) => {
  const num = Number(userInput);
  if (Number.isNaN(num)) {
    process.stdout.write(`Try again with a valid amount argument. \n`);
  } else {
    caesarShift = num;
    process.stdout.write("Enter the message you would like to encrypt...\n> ");
    process.stdin.once("data", handleInput);
  }
};

// Run the program.
process.stdout.write(
  "Enter the cipher method... mix(default)/caesar/reverse/symbol\n> "
);
process.stdin.on("data", handleCipherMethod);
