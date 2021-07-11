// Ensure password is at least 6 characters
function validatePassword(password) {
  if (password.length < 6) {
    return "Password should be at least 6 characters";
  }
  return null;
}

// Ensure email is valid email format
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(String(email).toLowerCase())) {
    return null;
  }
  return "Please enter a valid email.";
}

// Ensure username is at least 6 characters
function validateUsername(username) {
  if (username.length < 6) {
    return "Username should be at least 6 characters";
  }
  return null;
}

// Display a text based on its id
function showText(id, text) {
  $(id).text(text);
  $(id).show();
}
