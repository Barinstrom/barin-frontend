import Cookies from "universal-cookie";
import axios from "axios";

/* url ของจริง */
//https://barinapi.tawanchai.com
/* url เทส */
//https://barin-backend-staging.herokuapp.com
/* url domain หลักของ backend เก็บใส่ตัวแปรเอาไว้แล้วนำไปใช้ต่อ */
const Url = "https://barinapi.tawanchai.com";
const stagingUrl = "https://barin-backend-staging.herokuapp.com/"


// เพิ่มข้อมูลนักเรียน 1 คน
export async function add_student(data,token,schoolID) {
	const apiUrl = stagingUrl + String(schoolID) + "/add-student";
	try {
		const result = await axios({
			url: apiUrl,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			data: JSON.stringify(data),
			timeout: 10000
		})
		return true
	} catch (err) {
		console.log(err)
		return false
	}
};


// เพิ่มข้อมูลนักเรียนหลายคน admin_school
export async function add_students(data,token,schoolID) {
	const apiUrl = stagingUrl + String(schoolID) + "/add-students";
	
	try {
		const result = await axios({
			url: apiUrl,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			data: JSON.stringify(data),
			timeout: 10000
		})
		// ตรงนี้สำเร็จ status 200 แต่ รีเทินค่า [] กลับมา ไม่มีข้อมูลใน database
		//console.log(result)
		return true
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
		return true
	} catch (err) {
		console.log(err)
		return false
	}
};


// เพิ่มคลับ หลายคลับ 
export async function add_clubs(data,token,schoolID) {
	const apiUrl = stagingUrl + String(schoolID) + "/add-clubs";
	
		try {
		const result = await axios({
			url: apiUrl,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			method: "post",
			data:JSON.stringify(data),
			timeout: 100000
		})
		// ยังไม่ได้เทส
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
		return true
	} catch (err) {
		console.log(err)
		return false
	}
};

// เพิ่มครูหลายคน
export async function add_teachers(data,token,schoolID) {
	const apiUrl = stagingUrl + String(schoolID) + "/add-teachers";
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
		return true
	} catch (err) {
		console.log(err)
		return false
	}
};