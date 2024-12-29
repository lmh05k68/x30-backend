import paypal from "../const/paypal.const.js";
import nodemailer from "nodemailer";
// API Tạo thanh toán PayPal
const sendPaymentEmail = async (userEmail, paymentDetails) => {
  try {
    // Cấu hình SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "hle@gmail.com", // Email gửi
        pass: "Toilalmh123!", // Mật khẩu ứng dụng của email gửi
      },
    });

    // Nội dung email
    const mailOptions = {
      from: "hle290105@gmail.com", // Email gửi
      to: userEmail, // Email người nhận
      subject: "Thanh toán PayPal thành công",
      html: `
        <h1>Chúc mừng bạn đã thanh toán thành công!</h1>
        <p>Chi tiết thanh toán:</p>
        <ul>
          <li>Số tiền: ${paymentDetails.transactions[0].amount.total} ${paymentDetails.transactions[0].amount.currency}</li>
          <li>Mô tả: ${paymentDetails.transactions[0].description}</li>
          <li>ID giao dịch: ${paymentDetails.id}</li>
        </ul>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      `,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
    console.log("Email thông báo thanh toán đã được gửi.");
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
  }
};
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

  paypal.payment.execute(paymentId, executeData, async (error, payment) => {
    if (error) {
      console.error("Error executing payment:", error);
      return res.status(500).json({ error: "Failed to execute payment" });
    }

    // Gửi email thông báo
    const userEmail = "user-email@example.com"; // Lấy email từ req.body hoặc cơ sở dữ liệu
    await sendPaymentEmail(userEmail, payment);

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