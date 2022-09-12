import cookie from "js-cookie";
/* url ของจริง */
//https://barinapi.tawanchai.com
/* url เทส */
//https://barin-backend-staging.herokuapp.com
/* url domain หลักของ backend เก็บใส่ตัวแปรเอาไว้แล้วนำไปใช้ต่อ */
const Url = "https://barinapi.tawanchai.com";
const stagingUrl = "https://barin-backend-staging.herokuapp.com"

/* เป็น option ส่วนหนึ่งที่ต้องใส้ใน fetch */
const headers_setting = {
	"Content-Type": "application/json;charset=UTF-8",
}

// pending school
export async function get_pending(data,token) {
	const apiUrl = stagingUrl + "/schools/pending";
	console.log("url =", apiUrl)
	console.log(JSON.stringify(data))
	console.log(token)
	console.log("==========================================================")
	try {
		const response = await fetch(apiUrl,{
                method:"post",
                headers:{"Content-Type":"application/json",Authorization: `Bearer ${token}`,},
                body:JSON.stringify(data)
            })
			
			
		// 	fetch(apiUrl, {
		// 	headers: {
		// 		Authorization: `Bearer ${token}`,
		// 		"Content-Type": "application/json;charset=UTF-8",
		// 	},
		// 	method: "POST",
		// 	body: JSON.stringify(data),
		// })
		// console.log(response)
		/* ข้อมูลของ user ที่ return กลับมา */
		//const status = await response.json();
		//console.log(user_info)
		
		if (response.ok) {
			return true
			//return status;
		} else {
			console.log(response)
			return false;
		}
	} catch(err) {
		console.log(err.message);
		return false;
	}
};