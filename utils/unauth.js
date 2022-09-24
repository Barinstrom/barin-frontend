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
		return [true,result]
	}
	catch(err){
		console.log(err)
		if (err.response) {
			return [false,err.response.data]
		}
		else {
			return [false,false]
		}
			
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
