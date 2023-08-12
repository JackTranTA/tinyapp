const getUserByEmail = (email, database) => {
  const users = Object.values(database);
  for (const user of users) {
    if (user.email === email) {
      return user;
    }
  }
  return undefined;
};

function generateRandomString() {
  const chars ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let string = '';
  for (let i = 0; i < 6; i++){
    string += chars.charAt(Math.floor(Math.random() * chars.length));
  };
  return string;
};

function urlsForUser(id, database) {
  const shortURLs = Object.keys(database);
  urls = {};
  for (const shortURL of shortURLs) {
    if (database[shortURL].userID === id) {
      urls[shortURL] = database[shortURL];
    }
  }
  return urls;
};

module.exports = { getUserByEmail, urlsForUser, generateRandomString };