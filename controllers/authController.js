const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const SECRET_KEY = process.env.JWT_SECRET

async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username e password são obrigatórios."
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({
        message: "Usuário já existe."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "Usuário criado com sucesso.",
      userId: user._id
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao registrar usuário.",
      error: error.message
    });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Usuário ou senha inválidos."
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Usuário ou senha inválidos."
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login realizado com sucesso.",
      token
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao realizar login.",
      error: error.message
    });
  }
}

module.exports = {
  register,
  login
};