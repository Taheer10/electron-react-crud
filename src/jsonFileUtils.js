// jsonFileUtils.js
const fs = require("fs");

function readJSONFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContent);
}

function addDataToJSONFile(filePath, newData) {
  const data = readJSONFile(filePath);
  data.posts.push(newData);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
function updateDataInJSONFile(filePath, id, newName, newDescription) {
  const data = readJSONFile(filePath);
  const index = data.posts.findIndex((post) => post.id === id);

  if (index !== -1) {
    data.posts[index].name = newName;
    data.posts[index].description = newDescription;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}

function deleteDataFromJSONFile(filePath, id) {
  const data = readJSONFile(filePath);
  data.posts = data.posts.filter((post) => post.id !== id);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  readJSONFile,
  addDataToJSONFile,
  updateDataInJSONFile,
  deleteDataFromJSONFile,
};
