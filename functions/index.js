const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const stripe = require("stripe")("sk_test_51IfOzgSBb4zwnofZsKHu1iOEujZdYsp9QOYWPTbmQPo5IdQMIliQA8Xi8puWoZJLhyku20aTnpZf9DsEsJVBLlGH00akCX2adf");
exports.completePayment = functions.https.onRequest((req, res) => {
  stripe.charges.create({
    amount: req.body.amount,
    currency: req.body.currency,
    source: req.body.token,
  }).then((charge) => {
    res.send(charge);
  })
      .catch((e) => console.log(e));
});

