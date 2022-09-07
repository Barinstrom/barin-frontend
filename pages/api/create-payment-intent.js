// This is your test secret API key.
const stripe = require("stripe")(
	"sk_test_51Ld8YvDi0FRxBi9CBhklc4OTxxS1SMXpVCTAT69luoJbNJ3bl1f1suX7HCkeZ97qqbUgjidDvZrjStE9SABWXfiL009RpsUTnL"
);

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

export default async function handler(req, res) {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
		amount: 1099,
		currency: "thb",
		payment_method_types: ["promptpay"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};