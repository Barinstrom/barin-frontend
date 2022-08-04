import { useEffect } from "react";
import Router from "next/router";
import nextCookie from "next-cookies";
import cookie from "js-cookie";


// login & set token
export const login = ({ token }) => {
	cookie.set("token", token, { expires: 1 });
	Router.push("/done");
};

// ดึงข้อมูลคนมา
export async function get_userdata(token) {
	console.log("test token = ", token);
	const apiUrl = "https://barin-backend-staging.herokuapp.com/auth/profile";
    
	const response = await fetch(apiUrl, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (response.ok) {
		const js = await response.json();
		console.log("js", js);
		return js;
	} else {
		console.log("error", response);
		return { status: "error" };
	}
};