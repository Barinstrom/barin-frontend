import Cookies from "universal-cookie";
import axios from "axios"
/* url ของจริง */
//https://barinapi.tawanchai.com
/* url เทส */
//https://barin-backend-staging.herokuapp.com
/* url domain หลักของ backend เก็บใส่ตัวแปรเอาไว้แล้วนำไปใช้ต่อ */
const Url = "https://barinapi.tawanchai.com";
const stagingUrl = "https://barin-backend-staging.herokuapp.com"


// register
export async function register(data) {
	const apiUrl = stagingUrl + "/register";
	
	try {
		const result = await axios({
			url: apiUrl,
			method: "post",
			data: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
			},
			timeout: 3000
		})
		return result
	}
	catch(err){
		console.log(err.message)
		return false
	}
};

// login & set token
export async function checkLogin(data){
	// url success
	const apiUrl = stagingUrl + "/login";
	try {
		const result = await axios({
			url: apiUrl,
			method: "post",
			data: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			timeout: 10000
		})
		const cookie = new Cookies()
		cookie.set("token",result.data.token)
		return result
	}
	catch(err){
		console.log(err.message)
		return false
	}
}


// forgot pass
export async function forget_password(data) {
	// url success
	const apiUrl = stagingUrl + "/forgotpassword";
	
	try {
		const result = await axios({
			url: apiUrl,
			method: "post",
			data: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			timeout: 3000
		})
		return result
	}
	catch(err){
		console.log(err.message)
		return false
	}
};

// reset pass
export async function reset_password(data,token) {
	const apiUrl = stagingUrl + "/updatepassword";
	
	try {
		const result = await axios({
			url: apiUrl,
			method: "post",
			data: JSON.stringify(data),
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			timeout: 3000
		})
		return result
	}
	catch(err){
		console.log(err.message)
		return false
	}
};


// pagination editStudent
export async function paginationStudentEdit(data) {
	//const apiUrl = stagingUrl + "/updatepassword";
	
	try {
		const result = await axios({
			method:"post",
			url:"http://localhost:8000/paginate/db",
			headers:{'Content-Type':'application/json'},
			data:JSON.stringify(data),
			timeout:10000
		})
		return result
	}
	catch(err){
		console.log(err.message)
		return false
	}
};

