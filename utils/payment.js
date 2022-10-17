import Cookies from "universal-cookie";
import axios from "axios";

const stagingUrl = process.env.NEXT_PUBLIC_API

/*ดึงข้อมูลการชำระเงิน */
export async function get_status(token) {
  const apiUrl = stagingUrl + "/payment";
	try{
		const result = await axios({
			method:"get",
			url: apiUrl,
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			timeout: 10000
		})
		return result
	} catch (err) {
		console.log(err)
		return false
	}
}

/*เตรียมการชำระเงิน */
export async function stripe(token) {
  const apiUrl = stagingUrl + "/get-intent";
		try{
		const result = await axios({
			method:"get",
			url: apiUrl,
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			timeout: 10000
		})
		return result
	} catch (err) {
		//console.log(err)
		return false
	}
}
// setClientSecret(data.clientSecret)