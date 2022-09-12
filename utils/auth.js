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

// ดึงข้อมูลคนมา
export async function get_userdata(token,data) {
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


// เพิ่ม 1 นร
export async function add_student(data,token,schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/add-student";
	console.log("url =", apiUrl)
	console.log(JSON.stringify(data))
	try {
		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			method: "POST",
			body: JSON.stringify(data),
		})
		console.log(response)
		/* ข้อมูลของ user ที่ return กลับมา */
		const status = await response.json();
		//console.log(user_info)
		
		if (response.ok) {
			return status;
		} else {
			return false;
		}
	} catch(err) {
		console.log(err.message);
		return false;
	}
};


// เพิ่ม 1 คลับ
export async function add_club(data,token,schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/add-club";
	console.log("url =", apiUrl)
	console.log(JSON.stringify(data))
	try {
		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			method: "POST",
			body: JSON.stringify(data),
		})
		console.log(response)
		/* ข้อมูลของ user ที่ return กลับมา */
		const status = await response.json();
		//console.log(user_info)
		
		if (response.ok) {
			return status;
		} else {
			return false;
		}
	} catch(err) {
		console.log(err.message);
		return false;
	}
};


// เพิ่ม 1 ครู
export async function add_teacher(data,token,schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/add-teacher";
	console.log("url =", apiUrl)
	console.log(JSON.stringify(data))
	try {
		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			method: "POST",
			body: JSON.stringify(data),
		})
		console.log(response)
		/* ข้อมูลของ user ที่ return กลับมา */
		const status = await response.json();
		//console.log(user_info)
		
		if (response.ok) {
			return status;
		} else {
			return false;
		}
	} catch(err) {
		console.log(err.message);
		return false;
	}
};