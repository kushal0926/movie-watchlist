import { prisma } from "../config/database.config.js";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// for sign ups
const request = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking if user already exist or not
    const userExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userExist) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "user already exit with this email." });
    }

    // hasing password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // creating user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    // generate json webtoken
    const token = generateToken(user.id, res);

    res.status(httpStatus.OK).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          name: name,
          email: email,
          password: password,
        },
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ error: error });
  }
};

// for sign ins
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: "invalid email or password." });
    }

    // verifying password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: "invalid email or password." });
    }

    // generate json webtoken
    const token = generateToken(user.id, res);

    res.status(httpStatus.OK).json({
      data: {
        id: user.id,
        email: email,
      },
      token,
    });
  } catch (error) {
    cosole.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ error: error });
  }
};

const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(httpStatus.OK).json({
    status: "success",
    message: "logout successfully",
  });
};

export { request, login, logout };
