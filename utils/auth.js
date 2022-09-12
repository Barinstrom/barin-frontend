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

// เพิ่มครู หลายคน
export async function add_teachers(data,token,schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/add-teachers";
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