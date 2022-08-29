// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OmiseClient } from "omise-nodejs";

export default async function handler(req, res) {
  /* เชื่อมต่อ omise */
  const omise = new OmiseClient({
		publicKey: "pkey_test_5sxm3dmpgp2amagk9bh",
		secretKey: "skey_test_5sxlti3pxutrdqmhye3",
  });

  try {
		/* ดึงข้อมูลจาก body ที่ส่งมาจาก omise.js */
		const { email, name, amount, token } = req.body;

		/* สร้างข้อมูลของ customer ในเว็ป omise ตามที่เรากำหนด */
		const customer = await omise.customer.create({
			email,
			description: name,
			card: token,
		});

		/* สร้างข้อมูลของ เงินที่จ่ายไป(charge) ในเว็ป omise ตามที่เรากำหนด */
		const charge = await omise.charge.create({
			amount: amount,
			currency: "thb",
			customer: customer.id,
		});

		/* ส่งราคาเงินที่จ่าย กับ status ของการสร้างว่าสำเร็จไหม กลับไป */
		res.send({
			amount: charge.amount,
			status: charge.status,
		});

  } catch (error) {
    /* กรณีเกิด error */
    console.log(error);
    res.status(400).json({ error: "error" });
  }

	
}
