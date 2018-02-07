const Intercept = require('apr-intercept');
const Execa = require('execa');

module.exports = async (name, fallback) => {
  const [err, { stdout: value } = {}] = await Intercept(
    Execa('mdata-get', [name])
  );

  if (err) {
    console.error(err);
    return fallback;
  }

  return value || fallback;
};
