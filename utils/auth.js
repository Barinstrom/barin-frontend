import cookie from "js-cookie";
/* url ของจริง */
//https://barinapi.tawanchai.com
/* url เทส */
//https://barin-backend-staging.herokuapp.com
/* url domain หลักของ backend เก็บใส่ตัวแปรเอาไว้แล้วนำไปใช้ต่อ */
const Url = "https://barinapi.tawanchai.com";

/* เป็น option ส่วนหนึ่งที่ต้องใส้ใน fetch */
const headers_setting = {
	"Content-Type": "application/json;charset=UTF-8",
}

// register
export async function register(data) {
	const apiUrl = Url + "/register";
	
	const options = {
		method: "POST",
		headers: headers_setting,
		body: JSON.stringify(data),
	}
	
	try {
		const response = await fetch(apiUrl, options);
		const result = await response.json()
		//console.log("status code: ", response.status); // 👉️ 200
		//console.log(result)
		if (response.ok) {
			
			return true
		} else {
			return false
		}
	} catch(err) {
		return false
	}
};

// login & set token
export async function checkLogin(data){
	let apiUrl = Url + "/login";

	const options = {
		method: "POST",
		headers: headers_setting,
		body: JSON.stringify(data),
	}
	
	try{
		const response = await fetch(apiUrl,options);
		/* ดู response ที่ได้มา */
		//console.log(response)
		
		if (response.ok) {
			const result = await response.json();
			/* เช็คข้อมูลดูค่า token */
			console.log(result)
			const token = result.token;
			cookie.set("token", token, { expires: 1 });
			console.log("result");
			return true
		}
		else {
			return false
		}
	}catch(err){
		console.log(err.message)
		return false
	}
}

// ดึงข้อมูลคนมา
export async function get_userdata(token) {
	const apiUrl = Url + "/auth/profile";
	try {
		const response = await fetch(apiUrl, {
			headers: { Authorization: `Bearer ${token}` },
		})
		
		/* ข้อมูลของ user ที่ return กลับมา */
		const user_info = await response.json();
		//console.log(user_info)
		
		if (response.ok) {
			return user_info;
		} else {
			return false;
		}
	} catch(err) {
		console.log(err.message);
		return false;
	}
};