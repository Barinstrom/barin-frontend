import { useEffect } from "react";
import Router from "next/router";
import cookie from "js-cookie";

const Url = "https://barinapi.tawanchai.com";
const headers_setting = {
	Accept: "application/json",
	"Content-Type": "application/json;charset=UTF-8",
}
		
// register
export async function register(data) {
	const apiUrl = Url + "/register";
	const options = {
		method: "POST",
		headers: headers_setting,
		body: JSON.stringify(data),
	};
	try {
		const response = await fetch(apiUrl, options);
		console.log("status code: ", response.status); // 👉️ 200

		if (response.ok) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		return false;
	}
};

// login & set token
export async function login(data){
	let apiUrl = Url + "/login";

	const options = {
		method: "POST",
		headers: headers_setting,
		body: JSON.stringify(data),
	};
	try {
		const response = await fetch(apiUrl,options);
		console.log("status code: ", response.status); // 👉️ 200

		if (response.ok) {
			const result = await response.json();
			const token = result.token;
			cookie.set("token", token, { expires: 1 });
			Router.push("/doneV1");
			return true;
		}
		else {
			return false;
		}
	} catch (err) {
		return false;
	}
};

// ดึงข้อมูลคนมา
export async function get_userdata(token) {
	const apiUrl = Url + "/auth/profile";
	try {
		const response = await fetch(apiUrl, {
			headers: { Authorization: `Bearer ${token}` },
		});
		console.log(response);
		if (response.ok) {
			const js = await response.json();
			return js;
		} else {
			return false;
		}
	} catch {
		return false;
	}

	
};