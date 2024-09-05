const getRandomElement = (arr) => {
  if (!Array.isArray(arr)) throw new Error("Expected an array");
  return arr[Math.floor(Math.random() * arr.length)];
};

const getSamePersonElement = (person, arr) => {
  return arr.filter((val) => {
    return val.person.search(new RegExp(person, "i")) >= 0;
  });
};

const deleteElementById = (id, arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == id) {
      arr.splice(i, 1);
      return true;
    }
  }
  return false;
};

const editElement = (obj, arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == obj.id) {
      arr[i] = obj;
      return true;
    }
  }
  return false;
};

module.exports = {
  getRandomElement,
  getSamePersonElement,
  deleteElementById,
  editElement,
};
