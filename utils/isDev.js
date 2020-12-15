/**
 * @returns {boolean} is the app running in a development env
 */
module.exports = () => (process.env.NODE_ENV === 'development' ? true : false);
