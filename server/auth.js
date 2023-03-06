const bcrypt = require("bcryptjs");

/**
 * Hashing the password to store it in the DB
 * @param {*} value User entered password
 * @returns The hashed password
 */
const hashing = async (value) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(value, salt);
    return hash;
  } catch (error) {
    return error;
  }
};

/**
 * Comparing the user entered password with the password(hashed) stored in the DB
 * @param {*} value The password entered by the user while logging into the system
 * @param {*} hash The hashed password stored in the DB
 * @returns Returns the Boolean if the passwords are matched
 */
const hashCompare = async (value, hash) => {
  try {
    return await bcrypt.compare(value, hash);
  } catch (error) {
    return error;
  }
};

module.exports = { hashing, hashCompare };
