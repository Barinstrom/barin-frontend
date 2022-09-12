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

// register
export async function register(data) {
	const apiUrl = stagingUrl + "/register";
	
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
	let apiUrl = stagingUrl + "/login";

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
			// console.log("result =",result)
			const token = result.token;
			console.log(token)
			cookie.set("token", token, { expires: 1 });
			return {
				status: true,
				result
			}
		}
		else {
			return {
				status: false,
				error: "have error"
			}
		}
	}catch(err){
		console.log(err.message)
		return {
			status: false,
			error: err.message
		}
	}
}


// forgot pass
export async function forget_password(data) {
	const apiUrl = stagingUrl + "/forgotpassword";
	
	const options = {
		method: "POST",
		headers: headers_setting,
		body: JSON.stringify(data),
	}
	
	try {
		const response = await fetch(apiUrl, options);
		const result = await response.json()
		//console.log("status code: ", response.status); // 👉️ 200
		console.log("in result =",result)
		if (response.ok) {
			
			return true
		} else {
			return false
		}
	} catch(err) {
		return false
	}
};

// reset pass
export async function reset_password(data,token) {
	const apiUrl = stagingUrl + "/updatepassword";
	
	console.log(JSON.stringify(data))
	const options = {
		method: "POST",
		headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		body: JSON.stringify(data),
	}
	
	try {
		const response = await fetch(apiUrl, options);
		// const result = await response.json()
		// //console.log("status code: ", response.status); // 👉️ 200
		// console.log("in result =",result)
		if (response.ok) {
			
			return true
		} else {
			return false
		}
	} catch (err) {
		console.log(err)
		return false
	}
};
