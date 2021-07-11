module.exports = {
  // Ensure password is at least 6 characters
  validatePassword: function (password) {
    if (password.length < 6) {
      return "Password should be at least 6 characters";
    }
    return null;
  },

  // Ensure email is valid email format
  validateEmail: function (email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase())) {
      return null;
    }
    return "Please enter a valid email.";
  },

  // Ensure username is at least 6 characters
  validateUsername: function (username) {
    if (username.length < 6) {
      return "Username should be at least 6 characters";
    }
    return null;
  },
};
