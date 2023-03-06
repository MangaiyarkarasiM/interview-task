const { UserDetails } = require("../models/user");
const mongoose = require("mongoose");
const { hashing, hashCompare } = require("../auth");

//Connecting to the mongo db
mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);

/**
 * Retrieving all users from the DB
 * @param {*} req
 * @param {*} res
 */
exports.getUserDetails = async (req, res) => {
  try {
    const details = await UserDetails.find();
    res.status(200).send({
      statusCode: 200,
      users: details,
    });
  } catch (error) {
    console.log("Error occurred while retrieving the user details from DB");
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      message: "User data retrieval failed",
    });
  }
};

/**
 * Saving the user details in the DB
 * @param {*} req
 * @param {*} res
 */
exports.registerUser = async (req, res) => {
  try {
    let user = req.body;
    let data = await UserDetails.findOne({
      $or: [{ email: user.email }, { mobile: user.mobile }],
    });
    if (data) {
      res.status(400).json({
        statusCode: 400,
        message: "User email or mobile number already registered in the system",
      });
    } else {
      let hashedPassword = await hashing(user.password);
      user.password = hashedPassword;
      let details = await UserDetails.create(user);
      res.status(201).json({
        statusCode: 201,
        details,
      });
    }
  } catch (error) {
    console.log("Error occurred while saving the user details in DB");
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      message: "User creation has failed",
    });
  }
};

/**
 * Validating the user credentials for login
 * @param {*} req
 * @param {*} res
 */
exports.login = async (req, res) => {
  try {
    const user = req.body;
    const userData = await UserDetails.findOne({
      $or: [{ email: user.userId }, { mobile: user.userId }],
    });
    if (userData) {
      //Compare the password entered by user and stored in the DB
      const compare = await hashCompare(user.password, userData.password);
      if (compare === true) {
        res.status(200).json({
          statusCode: 200,
          user: userData,
          message: "Login Successfull",
        });
      } else {
        res.status(401).json({
          statusCode: 401,
          message: "Password is incorrect",
        });
      }
    } else {
      res.status(404).json({
        statusCode: 404,
        message: "Email or mobile is not found in the system",
      });
    }
  } catch (error) {
    console.log("Error occurred while validating the user credentials");
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      message: "Login has failed",
    });
  }
};

/**
 * Updating the user details in DB
 * @param {*} req
 * @param {*} res
 */
exports.updateUserWithId = async (req, res) => {
  try {
    const details = await UserDetails.updateOne(
      { _id: req.params.id },
      req.body
    );
    res.status(200).send({
      statusCode: 200,
      details,
      message: "Updated the user details",
    });
  } catch (error) {
    console.log("Error occurred while updating the user details in DB");
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      message: "User data update has failed, please try again later",
    });
  }
};

/**
 * Deleting the user details from DB
 * @param {*} req
 * @param {*} res
 */
exports.deleteUserWithId = async (req, res) => {
  try {
    await UserDetails.deleteOne({ _id: req.params.id });
    res.status(200).json({
      statusCode: 200,
      message: "Successfully deleted the user details",
    });
  } catch (error) {
    console.log("Error occurred while deleting the user details from DB");
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      message: "User data deletion has failed, please try again later",
    });
  }
};
