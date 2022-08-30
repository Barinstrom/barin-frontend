import React from "react";
import styles from "../../styles/index.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import { checkLogin } from "../../utils/auth";
import Swal from "sweetalert2";

export default function Login() {
	/* กำหนดตัวแปร route ขึ้นมาเพื่อไปโยงไปอีกลิงค์*/
	const router = useRouter();

	/* ใช้ useRef ผูกค่าไว้กับ tag html ตัวนั้น */
	const email = useRef();
	const password = useRef();

	/* function ในการเช็คว่าใส่ข้อมูลครบไหม */
	async function clickLogin(ev) {
		/* ป้องกันกันส่งข้อมูลไป server */
		ev.preventDefault();

		/* นำค่าที่ได้มาเก็บในตัวแปร สองตัวดังนี้ */
		const email_check = email.current.value;
		const password_check = password.current.value;

		/* เช็คข้อมูลปกติ */
		if (email_check === "" && password_check === "") {
			alert("โปรดกรอกข้อมูลให้ครบถ้วน");
			/* เรียกฟังชันก์ checkLogin แล้วส่ง body เป็น parameter ไป  */
			const body = {
				userId: data.email,
				password: "12345",
				confirmPassword: "12345",
				email: data.email,
				role: "admin",
				certificate_doc: data.school_document,
			};
			return;
		} else {
			/*ถ้าหากใส่ข้อมูลครบถ้วน ให้นำค่ามากำหนดเป็น object */
			const body = {
				userId: email_check,
				password: password_check,
			};

			/* เรียกฟังชัน checkLogin แล้วส่ง body ไป  */
			let status_login = await checkLogin(body);

			/* ถ้าหากว่า status_login == false  */
			if (!status_login) {
				alert("ข้อมูลไม่ถูกต้อง");
				return;
				/* ถ้าหากว่า status_login == true  */
			} else {
				router.push("/getData");
			}
		}
	}

	return (
		<main className={styles.register}>
			{/* กำหนด style แบบ nextjs jsx */}
			<style jsx>{``}</style>

			<main className={styles.block}>
				{/* ชื่อเว็บไซต์ใส่ไปก่อนเฉยๆ */}
				<div>
					<p className={styles.logo}>Barin Storm</p>
				</div>

				{/* อีเมลล์ */}
				<div className="form-floating">
					<input
						type="text"
						className={`${styles.email} form-control`}
						placeholder="อีเมลล์"
						id="email"
						ref={email}
					/>
					<label className="form-label">อีเมลล์</label>
				</div>

				{/* รหัสผ่าน */}
				<div className="form-floating">
					<input
						type="password"
						className={`${styles.password} form-control`}
						placeholder="รหัสผ่าน"
						id="password"
						ref={password}
					/>
					<label className="form-label">รหัสผ่าน</label>
				</div>

				<div className="mt-5 d-flex justify-content-center">
					{/* เมื่อกดปุ่มจะเกิด event */}
					<button
						className="btn btn-success"
						onClick={(ev) => clickLogin(ev)}
					>
						เข้าสู่ระบบ
					</button>
					{/* ไปหน้า register */}
					<Link href="/register">
						<button className="btn btn-danger ms-2">
							ลงทะเบียน
						</button>
					</Link>
				</div>
			</main>
		</main>
	);
}


export async function getStaticPaths() {
	// เอาไว้ดึง api กำหนด path
	/* const response = await fetch("http://127.0.0.1:8000/user")
    const data = await response.json()
    
    const b = data.map((e) => {
        return {params: {id : `${e.id}` }}
    }) */

	let a = [
		{ params: { schoolID: "1" } },
		{ params: { schoolID: "2" } },
		{ params: { schoolID: "3" } },
		{ params: { schoolID: "4" } },
		{ params: { schoolID: "5" } },
	];

	return {
		paths: a,
		fallback: false,
	};
}

export async function getStaticProps(context) {
	console.log(context);
	/*  const response = await fetch(`http://127.0.0.1:8000/user/${context.params.id}`)
    const data = await response.json() */
	console.log("context", context);
	return {
		props: {
			data: {
				userId: "12345",
			},
		},
		revalidate: 5,
	};
}