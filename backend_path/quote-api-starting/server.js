const express = require("express");
const app = express();

const { quotes } = require("./data");
const {
  getRandomElement,
  getSamePersonElement,
  deleteElementById,
  editElement,
} = require("./utils");

const PORT = process.env.PORT || 4001;

app.use(express.static("public"));

let idTrack = quotes.length;

app.get("/api/quotes/random", (req, res, next) => {
  const rand = getRandomElement(quotes);
  res.send({ quote: rand });
});

app.get("/api/quotes", (req, res, next) => {
  const person = req.query.person;
  if (person) {
    const get = getSamePersonElement(person, quotes);
    if (get.length > 0) {
      res.send({ quotes: get });
    } else {
      res.send({ quotes: [] });
    }
  } else {
    res.send({ quotes: quotes });
  }
});

app.post("/api/quotes", (req, res, next) => {
  const obj = req.query;
  idTrack++;
  obj.id = idTrack;
  if (
    obj.hasOwnProperty("quote") &&
    obj.hasOwnProperty("person") &&
    obj.quote &&
    obj.person
  ) {
    let duplicate = false;
    quotes.forEach((val) => {
      if (
        val.quote.toLowerCase() === obj.quote.toLowerCase() &&
        val.person.toLowerCase() === obj.person.toLowerCase()
      ) {
        duplicate = true;
      }
    });
    if (duplicate) {
      res.status(400).send("data already inserted");
    } else {
      quotes.push(obj);
      res.send({ quote: obj });
    }
  } else {
    res.status(400).send("please provide correct data");
  }
});

app.delete("/api/quotes/:id", (req, res, next) => {
  const id = Number(req.params.id);
  let temp = false;
  if (typeof id === "number" && id > 0) {
    temp = deleteElementById(id, quotes);
    if (temp) {
      res.send({ msg: "quote successfully deleted" });
      temp = "sent";
    } else {
      res.status(404).send({ message: "quote not found" });
      temp = "sent";
    }
  }
  if (temp !== "sent") {
    res.status(404).send({ message: "Invalid id" });
  }
});

app.put("/api/quotes/:id", (req, res, next) => {
  const id = Number(req.params.id);
  console.log(typeof id);
  let temp = false;
  if (typeof id === "number" && id > 0) {
    const obj = req.query;
    obj.id = id;
    console.log(obj);
    temp = editElement(obj, quotes);
    if (temp) {
      res.send({ msg: "quote successfully edited" });
      temp = "sent";
    } else {
      res.status(404).send({ message: "quote not found" });
      temp = "sent";
    }
  }
  if (temp !== "sent") {
    res.status(404).send({ message: "Invalid quote" });
  }
});

app.listen(PORT, () => {
  console.log("server is listening on port " + PORT);
});
