const sendToken = (user, res) => {
  // Create JWT Token
  const token = user.getJwtToken();

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "Strict"
  };

  res.cookie("token", token, options).json({
    token,
  });
};

export default sendToken;
