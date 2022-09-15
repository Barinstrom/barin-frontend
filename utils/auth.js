import Cookies from "universal-cookie";
import axios from "axios";

/* url ของจริง */
//https://barinapi.tawanchai.com
/* url เทส */
//https://barin-backend-staging.herokuapp.com
/* url domain หลักของ backend เก็บใส่ตัวแปรเอาไว้แล้วนำไปใช้ต่อ */
const Url = "https://barinapi.tawanchai.com";
const stagingUrl = "https://barin-backend-staging.herokuapp.com/"


// ดึงข้อมูลที่เกี่ยวข้องกะคนนั้น
export async function get_data(token, schoolID) {
	// console.log(token,schoolID)
	const apiUrl = stagingUrl + String(schoolID) + "/data";
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
	
};

// ดึงข้อมูลของทุกคน
export async function get_userdata(token, schoolID) {
	// console.log(token,schoolID)
	const apiUrl = stagingUrl + String(schoolID) + "/user";
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
	
};

// ดึงข้อมูลโรงเรียน
export async function get_school(token,schoolID) {
	const apiUrl = stagingUrl + String(schoolID) + "/get-school";
	try{
		const result = await axios({
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
	
};

// ตั้งเวลาลงทะเบียน role addmin_school
export async function set_schedule(data, token, schoolID) {
	const apiUrl = stagingUrl + String(schoolID) + "/set-schedule";
	try {
		const result = await axios({
			url: apiUrl,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			method: "patch",
			data:JSON.stringify(data),
			timeout: 10000
		})
		return result
	} catch (err) {
		console.log(err)
		return false
	}
}

// เพิ่มข้อมูลนักเรียน role addmin_school
export async function add_student(data,token,schoolID) {
	const apiUrl = stagingUrl + String(schoolID) + "/add-student";
	// console.log("url =", apiUrl)
	// console.log(JSON.stringify(data))
	
	try {
		const result = await axios({
			url: apiUrl,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
			timeout: 10000
		})
		return result
	} catch (err) {
		console.log(err)
		return false
	}

};


// เพิ่ม 1 คลับ
export async function add_club(data,token,schoolID) {
	const apiUrl = stagingUrl + String(schoolID) + "/add-club";
	
		try {
		const result = await axios({
			url: apiUrl,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			method: "post",
			data:JSON.stringify(data),
			timeout: 10000
		})
		return result
	} catch (err) {
		console.log(err)
		return false
	}
};


// เพิ่ม 1 ครู
export async function add_teacher(data,token,schoolID) {
	const apiUrl = stagingUrl + String(schoolID) + "/add-teacher";

	try {
		const result = await axios({
			url: apiUrl,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			method: "post",
			data:JSON.stringify(data),
			timeout: 10000
		})
		return result
	} catch (err) {
		console.log(err)
		return false
	}

};

// เพิ่มครู หลายคน
export async function add_teachers(data,token,schoolID) {
	const apiUrl = stagingUrl + String(schoolID) + "/add-teachers";
	console.log("data = ",data)
	try {
		const result = await axios({
			url: apiUrl,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			method: "post",
			data:JSON.stringify(data),
			timeout: 10000
		})
		return result
	} catch (err) {
		console.log(err)
		return false
	}
};