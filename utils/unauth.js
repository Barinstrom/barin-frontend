import Cookies from "universal-cookie";
import axios from "axios"

const stagingUrl = process.env.NEXT_PUBLIC_API

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
			timeout: 15000
		})
		return [result, true]
	}
	catch (err) {
		// console.log(err)
		return [err, false]
	}
};

export async function checkLogin(data) {
	const apiUrl = stagingUrl + "/login";
	try {
		const result = await axios({
			url: apiUrl,
			method: "post",
			data: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			timeout: 15000
		})
		return [result, true]
	}
	catch (err) {
		// console.log(err)
		return [err, false]
	}
}


// forgot pass
export async function forget_password(data) {
	const apiUrl = stagingUrl + "/forgotpassword";
	try {
		const result = await axios({
			url: apiUrl,
			method: "post",
			data: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			timeout: 15000
		})
		return "true"
	}
	catch (err) {
		// console.log(err)
		return 'false'
	}
};

// reset pass
export async function reset_password(data) {
	const apiUrl = stagingUrl + "/updatepassword";

	try {
		const result = await axios({
			url: apiUrl,
			method: "post",
			data: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
			},
			timeout: 15000
		})
		return [result, true]
	}
	catch (err) {
		// console.log(err)
		return [err, false]
	}
};


// get_all_schoolID
export async function get_all_schoolID() {
	const apiUrl = stagingUrl + "/getAllSchoolID";

	try {
		const result = await axios({
			url: apiUrl,
			method: "get",
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
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


// activate check
export async function is_activate(data) {
	const apiUrl = stagingUrl + "/activate";

	try {
		const result = await axios({
			url: apiUrl,
			method: "post",
			data: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
			},
			timeout: 15000
		})
		// console.log(result)
		return [result, true]
	}
	catch (err) {
		// console.log(err)
		return [err, false]
	}
};
