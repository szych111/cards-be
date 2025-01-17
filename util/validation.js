function isValidText(value) {
  return value && value.trim().length > 0;
}

function isValidDate(value) {
  const date = new Date(value);
  return value && date !== "Invalid Date";
}

function isValidEmail(value) {
  return value && value.includes("@");
}

exports.isValidText = isValidText;
exports.isValidDate = isValidDate;
exports.isValidEmail = isValidEmail;
