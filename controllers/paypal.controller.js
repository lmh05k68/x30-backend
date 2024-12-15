import paypal from "../const/paypal.const.js";

// API Tạo thanh toán PayPal
const createPayment = async (req, res) => {
  const { total, currency, description } = req.body;

  const paymentData = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:8000/api/v1/paypal/success",
      cancel_url: "http://localhost:8000/api/v1/paypal/cancel",
    },
    transactions: [
      {
        amount: {
          total: total, // Tổng số tiền thanh toán
          currency: currency || "USD", // Loại tiền tệ (mặc định: USD)
        },
        description: description || "Payment using PayPal", // Mô tả thanh toán
      },
    ],
  };

  try {
    paypal.payment.create(paymentData, (error, payment) => {
      if (error) {
        console.error("Error creating PayPal payment:", error);
        return res.status(500).json({ error: "Failed to create payment" });
      }

      // Lấy link redirect đến PayPal
      const approvalUrl = payment.links.find(
        (link) => link.rel === "approval_url"
      );

      res.status(200).json({
        message: "Redirect to PayPal to complete payment",
        approval_url: approvalUrl.href,
      });
    });
  } catch (error) {
    console.error("Error processing PayPal payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// API Xử lý thanh toán thành công
const executePayment = async (req, res) => {
  const { paymentId, PayerID } = req.query;

  const executeData = {
    payer_id: PayerID,
  };

  paypal.payment.execute(paymentId, executeData, (error, payment) => {
    if (error) {
      console.error("Error executing payment:", error);
      return res.status(500).json({ error: "Failed to execute payment" });
    }

    res.status(200).json({
      message: "Payment successful",
      payment: payment,
    });
  });
};

// API Hủy thanh toán
const cancelPayment = (req, res) => {
  res.status(200).json({ message: "Payment canceled by user" });
};

export { createPayment, executePayment, cancelPayment };