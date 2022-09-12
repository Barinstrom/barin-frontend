import cookie from "js-cookie";
import axios from "axios";
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
		const params = new URLSearchParams()
		//params.append("page",data.page)
		if (data.page){
			params.append("page",data.page)
		}
		
		if (data.query){
			params.append("query",data.query)
		}
		
		const paramsSuccess = apiUrl+`?${params}`
		console.log(paramsSuccess)
		
		const response = await axios({
			method:"get",
			url:paramsSuccess,
			headers:{"Content-Type":"application/json","Authorization": `Bearer ${token}`},
			timeout:3000
		})
		console.log(response)
		/* const response = await fetch(apiUrl,{
			method:"get",
			headers:{"Content-Type":"application/json","Authorization": `Bearer ${token}`,},
			body:JSON.stringify(data)
        }) */
		console.log(response)
		if (response.status === 200){
			return response.data
		}else{
			return false
		}
	} catch(err) {
		console.log(err.message);
		return false;
	}
};