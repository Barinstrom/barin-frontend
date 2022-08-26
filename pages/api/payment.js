// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OmiseClient } from "omise-nodejs";

export default async function handler(req, res) {
  const omise = new OmiseClient({
		publicKey: "pkey_test_5sxm3dmpgp2amagk9bh",
		secretKey: "skey_test_5sxlti3pxutrdqmhye3",
  });

  try{
    const { email, name, amount, token } = req.body; 
    
    const customer = await omise.customer.create({
      email,
      description: name,
      card: token,
    });

    const charge = await omise.charge.create({
      amount: amount,
      currency: "thb",
      customer: customer.id,
    });

    //console.log(charge.status);
    res.send({
      amount: charge.amount,
      status: charge.status,
    });

    //res.status(200).json({ name: "John Doe" });


  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "error" });
  }

	
}
