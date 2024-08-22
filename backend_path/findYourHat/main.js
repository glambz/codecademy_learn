const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const currentPathCharacter = "*";
const vertPathCharacter = "|";
const horzPathCharacter = "-";

class Field {
  constructor(array) {
    this.map = array;
    this.mapSize = [array[0].length - 1, array.length - 1];
    let stop = false;
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (array[i][j] === currentPathCharacter) {
          this.currentLocation = [j, i];
          stop = true;
          break;
        }
      }
      if (stop) {
        break;
      }
    }
  }
  print() {
    let temp = "";
    this.map.forEach((element) => {
      element.forEach((element) => {
        temp += element;
      });
      temp += "\n";
    });
    process.stdout.write(temp);
  }
  start() {
    this.print();
    this.stop = false;
    process.stdout.write("move to? (l: left, d: down, r: right, u:up)\n");
    let input = prompt();
    input = input.toLowerCase().trim();
    if (input === "l") {
      this.map[this.currentLocation[1]][this.currentLocation[0]] =
        horzPathCharacter;
      if (this.currentLocation[0] - 1 < 0) {
        this.currentLocation[0] = this.mapSize[0];
      } else {
        this.currentLocation[0] -= 1;
      }
    } else if (input === "r") {
      this.map[this.currentLocation[1]][this.currentLocation[0]] =
        horzPathCharacter;
      if (this.currentLocation[0] + 1 > this.mapSize[0]) {
        this.currentLocation[0] = 0;
      } else {
        this.currentLocation[0] += 1;
      }
    } else if (input === "u") {
      this.map[this.currentLocation[1]][this.currentLocation[0]] =
        vertPathCharacter;
      if (this.currentLocation[1] - 1 < 0) {
        this.currentLocation[1] = this.mapSize[1];
      } else {
        this.currentLocation[1] -= 1;
      }
    } else if (input === "d") {
      this.map[this.currentLocation[1]][this.currentLocation[0]] =
        vertPathCharacter;
      if (this.currentLocation[1] + 1 > this.mapSize[1]) {
        this.currentLocation[1] = 0;
      } else {
        this.currentLocation[1] += 1;
      }
    } else {
      process.stdout.write("Please input correctly as instructed!!\n");
    }
    if (this.map[this.currentLocation[1]][this.currentLocation[0]] === hole) {
      process.stdout.write("Oh no, you got lost in the blackhole!!\n");
      this.stop = true;
    } else if (
      this.map[this.currentLocation[1]][this.currentLocation[0]] === hat
    ) {
      process.stdout.write("Yay you found the hat!!\n");
      this.stop = true;
    } else {
      this.map[this.currentLocation[1]][this.currentLocation[0]] =
        currentPathCharacter;
    }
    if (!this.stop) {
      this.start();
    }
  }
  static generate(length, width, percent) {
    let holes = Math.floor(((length * width - 2) * percent) / 100);
    const tempArr = [currentPathCharacter, hat];
    for (let i = 2; i < length * width; i++) {
      if (holes == 0) {
        tempArr.push(fieldCharacter);
      } else {
        tempArr.push(hole);
        holes--;
      }
    }
    const res = [];
    for (let i = 0; i < length; i++) {
      const temp = [];
      for (let j = 0; j < width; j++) {
        const randNum = Math.floor(Math.random() * tempArr.length);
        temp.push(tempArr[randNum]);
        tempArr.splice(randNum, 1);
      }
      res.push(temp);
    }
    return res;
  }
}

let length, width, percent;
while (true) {
  process.stdout.write("set the length of the map\n");
  const temp = prompt().trim();
  try {
    if (Number(temp) > 0) {
      length = Number(temp);
      break;
    }
  } catch (error) {}
  process.stdout.write("set the correct length of the map please!!\n");
}
while (true) {
  process.stdout.write("set the width of the map\n");
  const temp = prompt().trim();
  try {
    if (Number(temp) > 0 && Number(temp) * length >= 2) {
      width = Number(temp);
      break;
    }
  } catch (error) {}
  process.stdout.write("set the correct width of the map please!!\n");
}
while (true) {
  process.stdout.write("set the percentage of the holes(0-100)\n");
  const temp = prompt().trim();
  try {
    if (Number(temp) >= 0 && Number(temp) <= 100) {
      percent = Number(temp);
      break;
    }
  } catch (error) {}
  process.stdout.write(
    "set the correct percentage of the holes please!!(0-100)\n"
  );
}
const first = new Field(Field.generate(length, width, percent));

process.stdout.write("note that the * is your character and ^ is the hat\n");
first.start();
