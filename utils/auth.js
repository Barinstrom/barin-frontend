import Cookies from "universal-cookie";
import axios from "axios";

const stagingUrl = process.env.NEXT_PUBLIC_API

// ดึงข้อมูลที่เกี่ยวข้องกะคนนั้น
export async function get_data(token) {
	// console.log(token,schoolID)
	const apiUrl = stagingUrl + "/school/get-status";
	try{
		const result = await axios({
			method:"get",
			url: apiUrl,
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			timeout: 15000
		})
		return [result,true]
	} catch (err) {
		return [err,false]
	}
	
};

// ดึงข้อมูลของทุกคน
export async function get_userdata(token, schoolID) {
	// console.log(token,schoolID)
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/user";
	try{
		const result = await axios({
			method:"get",
			url: apiUrl,
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			timeout: 15000
		})
		return result
	} catch (err) {
		// console.log(err)
		return false
	}
	
};

// ดึงข้อมูลโรงเรียน
export async function get_school(token,schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/get-school";
	try{
		const result = await axios({
			url: apiUrl,
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			timeout: 15000
		})
		// console.log(result)
		return result
	} catch (err) {
		// console.log(err)
		return false
	}
	
};


// /club/teachers
export async function get_teachers_inclub(data,token, schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/club/teachers";
	const params = new URLSearchParams()

	if (data._id) {
		params.append("clubID", data._id)
	}
	if (data.schoolYear) {
		params.append("schoolYear", data.schoolYear)
	}

	const params_success = apiUrl + `?${params}`
	// console.log(params_success)
	try {
		const result = await axios({
			url: params_success,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			method: "get",
			timeout: 15000
		})
		return result
	} catch (err) {
		// console.log(err)
		return false
	}
};

// /club/students
export async function get_students_inclub(data, token, schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/club/students";
	const params = new URLSearchParams()
	
	if (data.clubID) {
		params.append("clubID", data.clubID)
	}
	if (data.page) {
		params.append("page", data.page)
	}
	
	const params_success = apiUrl + `?${params}`
	// console.log("testing")
	try {
		const result = await axios({
			url: params_success,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			timeout: 15000
		})
		// console.log(result)
		return result
	} catch (err) {
		// console.log(err)
		return false
	}
};

// pagination Student
export async function paginationStudent(data,token,schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/students";
	const params = new URLSearchParams()
	
	if (data.page){
		params.append("page",data.page)
	}
	if (data.query){
		params.append("query",data.query)
	}

	const params_success = apiUrl + `?${params}`
	// console.log(params_success)
	try {
		const result = await axios({
			method:"get",
			url:params_success,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			timeout:20000
		})
		return result
	}
	catch(err){
		// console.log(err)
		return false
	}
}

// pagination Teacher 
export async function paginationTeacher(data,token,schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/teachers";
	const params = new URLSearchParams()
	
	if (data.page){
		params.append("page",data.page)
	}
	if (data.query){
		params.append("query",data.query)
	}

	const params_success = apiUrl + `?${params}`
	
	try {
		const result = await axios({
			method:"get",
			url:params_success,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			timeout:10000
		})
		return result
	}
	catch(err){
		// console.log(err)
		return false
	}
};


// pagination Club
export async function paginationClub(data,token,schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/clubs";
	const params = new URLSearchParams()
	
	if (data.page){
		params.append("page",data.page)
	}
	if (data.query){
		params.append("query",data.query)
	}

	const params_success = apiUrl + `?${params}`
	try {
		const result = await axios({
			method:"get",
			url:params_success,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			timeout:10000
		})
		return result
	}
	catch(err){
		// console.log(err)
		return false
	}
};


// getTeacherName
export async function getTeacherName(data, token, schoolID) {
	const apiUrl = stagingUrl + "/" + String(schoolID) + "/getTeacherName";
	const params = new URLSearchParams()

	if (data.teacherEmail) {
		params.append("email", data.teacherEmail)
	}

	const params_success = apiUrl + `?${params}`
	
	try {
		const result = await axios({
			method: "get",
			url: params_success,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			timeout: 15000
		})
		return result
	}
	catch (err) {
		// console.log(err)
		return false
	}
};