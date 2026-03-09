const Order = require("../models/Order");
const mapOrder = require("../utils/mapOrder");

function validateOrderBody(data) {
  if (!data.numeroPedido) {
    return "O campo numeroPedido é obrigatório.";
  }

  if (data.valorTotal === undefined || typeof data.valorTotal !== "number") {
    return "O campo valorTotal é obrigatório e deve ser numérico.";
  }

  if (!data.dataCriacao) {
    return "O campo dataCriacao é obrigatório.";
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    return "O campo items deve ser um array com pelo menos um item.";
  }

  for (const item of data.items) {
    if (!item.idItem) {
      return "Todo item deve possuir idItem.";
    }

    if (item.quantidadeItem === undefined || typeof item.quantidadeItem !== "number") {
      return "Todo item deve possuir quantidadeItem numérico.";
    }

    if (item.valorItem === undefined || typeof item.valorItem !== "number") {
      return "Todo item deve possuir valorItem numérico.";
    }
  }

  return null;
}

async function createOrder(req, res) {
  try {
    const validationError = validateOrderBody(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    // Verifica se já existe um pedido com o mesmo número
    const existingOrder = await Order.findOne({
      orderId: req.body.numeroPedido
    });

    if (existingOrder) {
      return res.status(409).json({
        message: "Já existe um pedido com esse número."
      });
    }
    // Faz o mapeamento do JSON recebido para o formato exigido
    const mappedOrder = mapOrder(req.body);
    const order = await Order.create(mappedOrder);

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno ao criar pedido.",
      error: error.message
    });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await Order.findOne({ orderId: req.params.id });

    if (!order) {
      return res.status(404).json({
        message: "Pedido não encontrado."
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno ao buscar pedido.",
      error: error.message
    });
  }
}

async function listOrders(req, res) {
  try {
    const orders = await Order.find();

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno ao listar pedidos.",
      error: error.message
    });
  }
}

async function updateOrder(req, res) {
  try {
    const validationError = validateOrderBody(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const mappedOrder = mapOrder(req.body);

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      mappedOrder,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Pedido não encontrado."
      });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno ao atualizar pedido.",
      error: error.message
    });
  }
}

async function deleteOrder(req, res) {
  try {
    const deletedOrder = await Order.findOneAndDelete({
      orderId: req.params.id
    });

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Pedido não encontrado."
      });
    }

    return res.status(200).json({
      message: "Pedido deletado com sucesso."
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno ao deletar pedido.",
      error: error.message
    });
  }
}

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder
};