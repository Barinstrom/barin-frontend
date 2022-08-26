// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {

  var omise = require("omise")({
		publicKey: "pkey_test_5sxm3dmpgp2amagk9bh",
		secretKey: "skey_test_5sxlti3pxutrdqmhye3",
	});

  res.status(200).json({ name: 'John Doe' })
}
