const express = require("express");
const router = express.Router();
const PaytmChecksum = require("paytmchecksum");
const https = require("https");

const MID = "YOUR_MERCHANT_ID";
const MKEY = "YOUR_MERCHANT_KEY";
const WEBSITE = "WEBSTAGING"; // Use "DEFAULT" or "YOUR_WEBSITE" in production
const CALLBACK_URL = "http://localhost:5000/api/paytm/callback"; // This must match Paytm Dashboard config

// 1️⃣ INITIATE TRANSACTION
router.post("/initiate", async (req, res) => {
  const { orderId, amount, customerEmail, customerMobile } = req.body;

  const paytmParams = {
    body: {
      requestType: "Payment",
      mid: MID,
      websiteName: WEBSITE,
      orderId: orderId,
      callbackUrl: CALLBACK_URL,
      txnAmount: {
        value: amount,
        currency: "INR",
      },
      userInfo: {
        custId: customerEmail,
        mobile: customerMobile,
      },
    },
  };

  try {
    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      MKEY
    );

    paytmParams.head = {
      signature: checksum,
    };

    const post_data = JSON.stringify(paytmParams);

    const options = {
      hostname: "securegw-stage.paytm.in", // Use securegw.paytm.in for production
      port: 443,
      path: `/theia/api/v1/initiateTransaction?mid=${MID}&orderId=${orderId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": post_data.length,
      },
    };

    let response = "";

    const paytmReq = https.request(options, (paytmRes) => {
      paytmRes.on("data", (chunk) => {
        response += chunk;
      });

      paytmRes.on("end", () => {
        const data = JSON.parse(response);
        res.json({
          mid: MID,
          orderId: orderId,
          txnToken: data.body.txnToken,
          amount,
          callbackUrl: CALLBACK_URL,
        });
      });
    });

    paytmReq.write(post_data);
    paytmReq.end();
  } catch (error) {
    console.error("Paytm Initiation Error:", error);
    res.status(500).json({ message: "Failed to initiate Paytm transaction" });
  }
});

// 2️⃣ HANDLE CALLBACK FROM PAYTM
router.post("/callback", express.urlencoded({ extended: false }), async (req, res) => {
  const paytmParams = req.body;
  const receivedChecksum = paytmParams.CHECKSUMHASH;

  const isValidChecksum = PaytmChecksum.verifySignature(
    paytmParams,
    MKEY,
    receivedChecksum
  );

  if (isValidChecksum) {
    // You can check txn status here using txnId or orderId
    console.log("Payment verified:", paytmParams.ORDERID);

    // Update your DB order status here
    // Eg: Order.findOneAndUpdate({ orderId }, { status: "PAID" })

    res.send("Payment successful");
  } else {
    console.log("Checksum mismatch");
    res.status(400).send("Invalid checksum");
  }
});

module.exports = router;
