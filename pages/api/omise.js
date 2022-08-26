
export default async function handler(req, res) {
	var omise = require("omise")({
		publicKey: "pkey_test_5sxm3dmpgp2amagk9bh",
		secretKey: "skey_test_5sxlti3pxutrdqmhye3",
	});

  

  try {
    
    // console.log(req.rawHeaders[7]);
    // const { email, name, amount, token } = req.rawHeaders[7].json();
    res.send({ "test":"test" });
    // const { email, name, amount, token } = req.body;
    // res.send({
    //   email,
    //   name,
    //   amount,
    //   token,
    // });

  } catch (error) {
    res.send({error});
  }

  /*if (method == "POST") {
    const { email, name, amount, token } = req.body;
    res.send({
      email,
      name,
      amount,
      token,
    });
  }*/
	//console.log(email, name, amount, token);

	// console.log(omise);
	// try {
	//     const customer = await omise.customers.create({
	//       email,
	//       description: name,
	//       card: token
	//     });

	//     const charge = await omise.charges.create({
	//       amount: amount,
	//       currency: "thb",
	//       customer: customer.id,
	//     });

	//     res.send({
	//       amount: charge.amount,
	//       status: charge.status
	//     })
	// } catch (error) {
	//     console.log(error)
	// }

	
}
