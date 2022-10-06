const { postData, retrieveData } = require("../api/api");

const getPerson = id => {
  const personData = retrieveData();

  const address = retrieveData("/person/address", id);

  if (personData.role === 1) {
    return (personData.acting = "user");
  }

  if (personData.role === 2) {
    return (personData.roleName = "admin");
  }

  return (personData.address = address);
};

const addPerson = data => {
  postData(data);
};

const updatePerson = (id, data, peopleDb) => {
  return data.map(p => (p.id === id ? { ...p, ...peopleDb } : p));
};

module.exports = {
  getPerson,
  addPerson,
  updatePerson,
};
