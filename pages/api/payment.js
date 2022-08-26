// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OmiseClient } from "omise-nodejs";

export default async function handler(req, res) {
  const client = new OmiseClient({
		publicKey: "pkey_test_5sxm3dmpgp2amagk9bh",
		secretKey: "skey_test_5sxlti3pxutrdqmhye3",
  });

  try{
    const { email, name, amount, token } = req.body; 
    res.status(200).json({ email, name, amount, token });

  }catch (error) {
    res.status(400).json({ error: "error" });
  }

	
}
