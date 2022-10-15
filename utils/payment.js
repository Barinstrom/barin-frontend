import Cookies from "universal-cookie";
import axios from "axios";

/* url ของจริง */
//https://barinapi.tawanchai.com
/* url เทส */
//https://barin-backend-staging.herokuapp.com
/* url domain หลักของ backend เก็บใส่ตัวแปรเอาไว้แล้วนำไปใช้ต่อ */
const Url = "https://barinapi.tawanchai.com/";
const stagingUrl = "https://barin-backend-staging.herokuapp.com/"

/*ดึงข้อมูลการชำระเงิน */
export async function get_status(token) {
  const apiUrl = stagingUrl + "payment";
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
  const apiUrl = stagingUrl + "get-intent";
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