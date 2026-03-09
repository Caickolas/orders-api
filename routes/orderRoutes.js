const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/authMiddleware");

const {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder
} = require("../controllers/orderController");

// todas as rotas de pedidos exigem token

router.post("/order", authenticateToken, createOrder);

router.get("/order/list", authenticateToken, listOrders);

router.get("/order/:id", authenticateToken, getOrderById);

router.put("/order/:id", authenticateToken, updateOrder);

router.delete("/order/:id", authenticateToken, deleteOrder);

module.exports = router;