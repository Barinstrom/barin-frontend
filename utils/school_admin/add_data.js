import Cookies from "universal-cookie";
import axios from "axios";

const stagingUrl = process.env.NEXT_PUBLIC_API


// เพิ่มข้อมูลนักเรียน 1 คน
export async function add_student(data,token,schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/add-student";
	console.log(data,token,schoolID)
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
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/add-students";
	
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


// เพิ่ม 1 คลับ
export async function add_club(data,token,schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/add-club";
	console.log()
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



export async function add_clubs(data,token,schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/add-clubs";
	
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
		console.log(result)
		return true
	} catch (err) {
		console.log(err)
		return false
	}
};


// เพิ่ม 1 ครู
export async function add_teacher(data,token,schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/add-teacher";
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
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/add-teachers";
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