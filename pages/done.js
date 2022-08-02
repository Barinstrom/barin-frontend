import React from "react";
import styles from "../styles/index.module.css";
import Link from "next/link";
import { useRef } from "react";
import nextCookie from "next-cookies";
import { withAuthSync } from "../utils/auth";

import axios from "axios";
import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";

const Profile = (props) => {
	console.log(props.data);

	return (
		<div>
			<h1>{props.data.email}</h1>
			<h1>{props.data.role}</h1>
			<h1>{props.data.userId}</h1>
		</div>
	);
};

Profile.getInitialProps = async (ctx) => {
	const { token } = nextCookie(ctx);
	const apiUrl = "https://barin-backend-staging.herokuapp.com/auth/profile";

	const redirectOnError = () =>
		typeof window !== "undefined"
			? Router.push("/")
			: ctx.res.writeHead(302, { Location: "/" }).end();

	try {
		const response = await fetch(apiUrl, {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (response.ok) {
			const js = await response.json();
			console.log("js", js);
			return js;
		} else {
			// https://github.com/developit/unfetch#caveats
			return await redirectOnError();
		}
	} catch (error) {
		// Implementation or Network error
		return redirectOnError();
	}
};

export default withAuthSync(Profile);


/*const Home = ({ token }) => {
	//console.log(token);
	
	return <div>page content {token}</div>;
};

export const getServerSideProps =  ({ req, res }) => {
	const token = getCookie("token", { req, res });

	let url = "https://barin-backend-staging.herokuapp.com/auth/profile";
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	console.log(config);

	return { props: { token } };
};

export default Home;*/