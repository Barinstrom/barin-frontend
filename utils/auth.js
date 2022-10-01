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
export async function get_data(token) {
	// console.log(token,schoolID)
	const apiUrl = stagingUrl + "school/get-status";
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

// pagination Student
export async function paginationStudent(data,token,schoolID) {
	const apiUrl = stagingUrl + String(schoolID) + "/students";
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
		console.log(err)
		return false
	}
}

// pagination Teacher 
export async function paginationTeacher(data,token,schoolID) {
	const apiUrl = stagingUrl + String(schoolID) + "/teachers";
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
		console.log(err)
		return false
	}
};


// pagination Club
export async function paginationClub(data,token,schoolID) {
	const apiUrl = stagingUrl + String(schoolID) + "/clubs";
	const params = new URLSearchParams()
	
	if (data.page){
		params.append("page",data.page)
	}
	if (data.query){
		params.append("query",data.query)
	}

	const params_success = apiUrl + `?${params}`
	//console.log(params)
	
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
		console.log(err.message)
		return false
	}
};

