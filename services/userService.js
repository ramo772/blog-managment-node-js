const userRepository = require("../repositories/userRepository");
const bcrypt = require('bcrypt');


const checkUserExists = async (email) => {
  const user = await userRepository.findOneBy({ email });
  return user;
};
const createUser = async (userData) => {
  const userExist =await checkUserExists(userData.email);
  if (userExist) throw new Error("User already registered.");
  let user = await userRepository.create({
    name: userData.name,
    email: userData.email,
    password: userData.password
  })
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  return { user, token };

}
const loginUser = async (userData) => {
  let user = await checkUserExists(userData.email);
  if (!user) throw new Error("Invalid email or password.");
  const validPassword = await bcrypt.compare(userData.password, user.password);
  if (!validPassword) throw new Error("Invalid email or password.");

  const token = user.generateAuthToken();

  return { user, token };

}

module.exports = {
  createUser,
  loginUser
}