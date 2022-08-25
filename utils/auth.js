import { useEffect } from "react";
import Router from "next/router";
import nextCookie from "next-cookies";
import cookie from "js-cookie";
import axios from "axios";

const Url = "https://barinapi.tawanchai.com";
// register
export async function register(data) {
	const apiUrl = Url + "/register";
	try {
		const res = await axios.post(apiUrl, data);
		//console.log(res);
		console.log(res.status);
		if (res.status == 200) {
			return true;
		} else {
			return false;
		}
	} catch {
		console.log("error")
		return false;
	}
};

// login & set token
export async function login(data){
	let apiUrl = Url + "/login";

	try {
		const res = await axios.post(apiUrl, data);
		//console.log(res);
		console.log(res.status);

		if (res.status == 200) {
			const token = res.data.token;
			cookie.set("token", token, { expires: 1 });
			Router.push("/doneV1");
			return true;
		} else {
			return false;
		}
	} catch {
		return false;
	}

	
};

// ดึงข้อมูลคนมา
export async function get_userdata(token) {
	//console.log("test token = ", token);
	const apiUrl = Url + "/auth/profile";
  
	try {
		const response = await fetch(apiUrl, {
			headers: { Authorization: `Bearer ${token}` },
		});
		//console.log("response =", response);
		if (response.ok) {
			const js = await response.json();
			//console.log("js", js);
			return js;
		} else {
			//console.log("error", response);
			return false;
		}
	} catch {
		return false;
	}

	
};