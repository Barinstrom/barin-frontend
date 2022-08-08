import React from "react";
import styles from "../styles/index.module.css";
import { get_userdata } from "../utils/auth";
import { useState, useEffect } from "react";
import * as cookie from "cookie";
import Cookies from "universal-cookie";

export default function Home({ }) {

	const [data, setData] = useState(null);
	const [isLoading, setLoading] = useState(false);

	const get_userdata_func = async (token) => {
		const datax = await get_userdata(token);
		setData(datax);
	};

	useEffect(() => {
		
		const cookies = new Cookies();
		const token = cookies.get("token");
		console.log("token =", token);
		get_userdata_func(token);

	})

	if (!data) return <p>No profile data</p>;

	return (
		<main className={styles.register}>
			{/* กำหนด style แบบ nextjs jsx */}
			<style jsx>{``}</style>

			<main className={styles.block}>
				{/* ชื่อเว็บไซต์ใส่ไปก่อนเฉยๆ */}
				<div>
					<p className={styles.logo}>Barin Storm</p>
					<p className={styles.logo}>{data.data.userId}</p>
					<p className={styles.logo}>{data.data.role}</p>
					<p className={styles.logo}>{data.data.email}</p>
				</div>
			</main>
		</main>
	);
}

/*export async function getServerSideProps(context) {
    const parsedCookies = await cookie.parse(context.req.headers.cookie);
    console.log(parsedCookies);

    const data = await get_userdata(parsedCookies.token);
    console.log("data =",data);
	return { props: {data} };
}*/
