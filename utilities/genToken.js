import jwt from "jsonwebtoken";

const genToken = (res, user, message) => {
  const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, 
    })
    .json({
      sucess: true,
      message,
      user,
      token,
    });
};

export default genToken;
