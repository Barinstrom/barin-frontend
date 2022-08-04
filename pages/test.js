import React from "react";
import styles from "../styles/index.module.css";
import { get_userdata } from "../utils/auth";
import * as cookie from "cookie";


export default function Home({ data }) {
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

export async function getServerSideProps(context) {
    const parsedCookies = await cookie.parse(context.req.headers.cookie);
    console.log(parsedCookies);

    const data = await get_userdata(parsedCookies.token);
    console.log("data =",data);
	return { props: {data} };
}
