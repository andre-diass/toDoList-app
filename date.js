exports.getDate = getDate;

function getDate() {
  const today = new Date();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const day = today.toLocaleDateString("en-us", options);
  return day;
}

exports.getDay = getDay;

function getDay() {
  const today = new Date();

  const options = {
    weekday: "long",
  };

  let day = today.toLocaleDateString("en-us", options);
  return day;
}
