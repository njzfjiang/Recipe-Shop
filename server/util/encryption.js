const bcrypt = require('bcrypt');

const saltRounds = 10;


async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error('Error hashing password:', err);
    throw new Error('Failed to hash password');
  }
}

async function checkPasswordMatch(userPassword , hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(userPassword.trim(), hashedPassword);
    return isMatch;
  } catch (err) {
    console.error('Error comparing passwords:', err);
    throw new Error('Failed to compare passwords');
  }
}



module.exports = {hashPassword,checkPasswordMatch}
