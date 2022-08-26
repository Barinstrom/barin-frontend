import cookie from "js-cookie";

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
		//console.log("status code: ", response.status); // 👉️ 200

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
		//console.log("status code: ", response); // 👉️ 200

		if (response.ok) {
			const result = await response.json();
			const token = result.token;
			cookie.set("token", token, { expires: 1 });
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
		//console.log(response);
		
		if (response.ok) {
			const js = await response.json();
			return js;
		} else {
			return false;
		}
	} catch(err) {
		console.log(err.message);
		return false;
	}
};