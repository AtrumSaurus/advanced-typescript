const fetch = require("node-fetch");

const buildFullUrl = (res, id) =>
  `https://jsonplaceholder.typicode.com/${res}/${id}`;

const retrieveData = async (url, options) => {
  const response = await fetch(buildFullUrl(url), options);

  if (response === null) {
    return 100;
  }

  return response.text();
};

const postData = async (url, data, options) => {
  const response = await fetch(buildFullUrl(url), {
    ...options,
    body: { test: true },
  });

  if (response === null) {
    return 200;
  }

  return response.text();
};

module.exports = { retrieveData, postData };
