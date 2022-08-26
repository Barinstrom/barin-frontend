// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OmiseClient } from "omise-nodejs";

export default async function handler(req, res) {
  const client = new OmiseClient({
		publicKey: "pkey_test_5sxm3dmpgp2amagk9bh",
		secretKey: "skey_test_5sxlti3pxutrdqmhye3",
  });

	res.status(200).json({ name: "Payment Doe" });
}
