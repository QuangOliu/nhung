const express = require("express");
const mqtt = require("mqtt");
const bodyParser = require("body-parser");
const emailRouter = require("./emailRouter");
require("dotenv").config();

const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", emailRouter); // Add this line to use the email router

// Kết nối đến MQTT broker
const mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_BROKER}`);

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "trantran30102002@gmail.com",
    pass: "djlbsguykpsnhmna",
  },
});

mqttClient.on("connect", () => {
  console.log("Kết nối MQTT broker thành công");
  mqttClient.subscribe("fall/toppic");
});

mqttClient.on("message", async (topic, message) => {
  if (topic === "fall/toppic") {
    const data = message.toString();
    console.log("Received message:", data);

    if (data === "1") {
      try {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Alert System" <trantran30102002@gmail.com>', // sender address
          to: "trantran30102002@gmail.com", // list of receivers
          subject: "Fall Detected!", // Subject line
          text: "A fall has been detected. Please check immediately.", // plain text body
          html: "<b>A fall has been detected. Please check immediately.</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }
  }
});

app.listen(port, () => {
  console.log(`Máy chủ Node.js đang lắng nghe trên cổng ${port}`);
});
