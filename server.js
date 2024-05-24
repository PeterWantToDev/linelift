const express = require("express");
const axios = require("axios");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = 8888;

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
};

const sendMessage = async (userUid, message) => {
  const body = {
    to: userUid,
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  };

  try {
    const response = await axios.post(LINE_API_URL, body, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

app.post("/send-message", async (req, res) => {
  const { userUid, message } = req.body;

  try {
    const response = await sendMessage(userUid, message);
    console.log("=== LINE log", response);
    res.json({ message: "Message OK", response });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({ error });
  }
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
