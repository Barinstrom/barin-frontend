import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../../styles/admin.module.css";
import { get_userdata } from "../../utils/auth";
import EditStudent from "../../components/admin_school/editStudent";
import EditTeacher from "../../components/admin_school/editTeacher";
import EditClub from "../../components/admin_school/editClub";
import EditOwnData from "../../components/admin_school/editOwnData";
import InsertClub from "../../components/admin_school/insertClub";
import InsertStudent from "../../components/admin_school/insertStudent";
import InsertTeacher from "../../components/admin_school/insertTeacher";
import SchoolData from "../../components/admin_school/schoolData";
import TimeConfig from "../../components/admin_school/timeConfig";

export default function Admin({ school_data }) {

	const nav = useRef();
	const time = useRef();
	/* ตัวแปรเก็บค่า timer */
	let timer;
	const [component, setComponent] = useState(
		<SchoolData school_data={school_data} />
	);

	useEffect(() => {
		controllTime("start");

		return () => {
			controllTime("cancell");
		};
	});

	function changeComponent(num, ev) {
		if (num == 0) {
			setComponent(<SchoolData school_data={school_data} />);
		} else if (num == 1) {
			setComponent(<TimeConfig />);
		} else if (num == 2) {
			setComponent(<InsertTeacher />);
		} else if (num == 3) {
			setComponent(<InsertStudent />);
		} else if (num == 4) {
			setComponent(<InsertClub />);
		} else if (num == 5) {
			setComponent(<EditStudent />);
		} else if (num == 6) {
			setComponent(<EditTeacher />);
		} else if (num == 7) {
			setComponent(<EditClub />);
		} else {
			setComponent(<EditOwnData />);
		}
	}

	/* ฟังชันก์ set เวลาให้นับแบบ real timer */
	function controllTime(check) {
		if (check == "start") {
			timer = setInterval(() => {
				const h = String(new Date().getHours()).padStart(2, "0");
				const m = String(new Date().getMinutes()).padStart(2, "0");
				const s = String(new Date().getSeconds()).padStart(2, "0");
				time.current.innerText = `${h}:${m}:${s}`;
			}, 1000);
		} else {
			clearInterval(timer);
		}
	}

	const clickHamberger = () => {
		nav.current.classList.toggle("active");
	};

	if (school_data.paymentStatus) {
		return (
			<>
				<header className={`${styles.head} navbar navbar-dark bg-dark`}>
					<div
						className={`${styles.header_main} text-white d-flex justify-content-between`}
					>
						<div className={styles.header_item}>
							<button
								className={styles.button_hamberger}
								onClick={clickHamberger}
							>
								<i className="fa-solid fa-bars"></i>
							</button>
							<span>Dashboard</span>
						</div>
						<div className={`${styles.header_item}`}>
							<div className={`${styles.time_alert} me-2`}>
								<span ref={time}>
									{/* {parseInt(new Date().getHours()) > 9 ?new Date().getHours() : "0" + new Date().getHours()} 
								: {parseInt(new Date().getMinutes()) > 9 ? new Date().getMinutes() : "0" + new Date().getMinutes()} 
								: {parseInt(new Date().getSeconds()) > 9 ? new Date().getSeconds() : "0" + new Date().getSeconds()}  */}
								</span>
							</div>
							<div className={`${styles.logo_title} me-3`}>
								<span className="ms-2">
									<i className="fa-solid fa-bell"></i>
								</span>
								<span className={`${styles.user_name} ms-1`}>
									{/* {data.data.userId} */}
								</span>
								<Link href="/">
									<a className={`${styles.logo} ms-2`}>
										<img src={"../../dora.jpg"} />
									</a>
								</Link>
							</div>
						</div>
					</div>
				</header>

				<style jsx>{`
					.nav_header {
						background-color: #fafafa;
						min-height: 100vh;
						position: fixed;
						padding: 3px;
						transform: translate(-5%, 80px);
						transition: transform 0.3s ease;
						z-index: 100;
					}

					@media screen and (max-width: 1200px) {
						.nav_header {
							transform: translate(-100%, 80px);
						}
						.nav_header.active {
							transform: translateY(80px);
						}
					}

					.h2_alert,
					.h2_alert {
						font-size: 36px;
					}

					@media screen and (max-width: 1000px) {
						.h2_alert {
							font-size: 28px;
						}
					}
					@media screen and (max-width: 800px) {
						.h2_alert {
							font-size: 20px;
						}
					}
				`}</style>

				<nav className="nav_header" ref={nav}>
					<div className={styles.box_menu}>
						<ul>
							<li>
								<button
									className="btn btn-success w-100"
									onClick={(ev) => changeComponent(0, ev)}
								>
									<i className="fa-solid fa-house me-2"></i>
									<span>ข้อมูลโรงเรียน</span>
								</button>
							</li>
							<li>
								<button
									className="btn btn-success  w-100"
									onClick={(ev) => changeComponent(1, ev)}
								>
									<i className="fa-solid fa-user me-2"></i>
									<span className={styles.item}>
										ตั้งเวลาลงทะเบียน
									</span>
								</button>
							</li>
							<li>
								<button
									className="btn btn-success w-100"
									onClick={(ev) => changeComponent(2, ev)}
								>
									<i className="fa-solid fa-house me-2"></i>
									<span>เพิ่มข้อมูลครู</span>
								</button>
							</li>
							<li>
								<button
									className="btn btn-success w-100"
									onClick={(ev) => changeComponent(3, ev)}
								>
									<i className="fa-solid fa-house me-2"></i>
									<span>เพิ่มข้อมูลนักเรียน</span>
								</button>
							</li>
							<li>
								<button
									className="btn btn-success w-100"
									onClick={(ev) => changeComponent(4, ev)}
								>
									<i className="fa-solid fa-house me-2"></i>
									<span>เพิ่มข้อมูลชุมนุม</span>
								</button>
							</li>
							<li>
								<button
									className="btn btn-success  w-100"
									onClick={(ev) => changeComponent(5, ev)}
								>
									<i className="fa-solid fa-address-card me-2"></i>
									<span>แก้ไขข้อมูลนักเรียน</span>
								</button>
							</li>
							<li>
								<button
									className="btn btn-success  w-100"
									onClick={(ev) => changeComponent(6, ev)}
								>
									<i className="fa-solid fa-address-card me-2"></i>
									<span>แก้ไขข้อมูลครู</span>
								</button>
							</li>
							<li>
								<button
									className="btn btn-success  w-100"
									onClick={(ev) => changeComponent(7, ev)}
								>
									<i className="fa-solid fa-list-check me-2"></i>
									<span>แก้ไขข้อมูลชุมนม</span>
								</button>
							</li>
							<li>
								<button
									className="btn btn-success  w-100"
									onClick={(ev) => changeComponent(8, ev)}
								>
									<i className="fa-solid fa-list-check me-2"></i>
									<span>แก้ไขข้อมูลตัวเอง</span>
								</button>
							</li>
						</ul>
					</div>
				</nav>

				<main className={styles.content}>
					<div className="container">
						{component}

						{/* <div className="alert alert-success alert-dismissible fade show">
						<div className='d-flex justify-content-center align-items-center'>
							<h2 className="alert-heading text-center h2_alert">
								โปรดรอการยืนยันจาก system admin 
							</h2>
							<span className="spinner-grow ms-3 h2_alert"></span>
						</div>
						<button className="btn-close" data-bs-dismiss="alert" />
					</div> */}
					</div>
				</main>
			</>
		);
	} else if (!school_data.paymentStatus) {
		return (
			<>
				<header className={`${styles.head} navbar navbar-dark bg-dark`}>
					<div
						className={`${styles.header_main} text-white d-flex justify-content-between`}
					>
						<div className={styles.header_item}>
							<button
								className={styles.button_hamberger}
								onClick={clickHamberger}
							>
								<i className="fa-solid fa-bars"></i>
							</button>
							<span>Dashboard</span>
						</div>
						<div className={`${styles.header_item}`}>
							<div className={`${styles.time_alert} me-2`}>
								<span ref={time}>
									{/* {parseInt(new Date().getHours()) > 9 ?new Date().getHours() : "0" + new Date().getHours()} 
						: {parseInt(new Date().getMinutes()) > 9 ? new Date().getMinutes() : "0" + new Date().getMinutes()} 
						: {parseInt(new Date().getSeconds()) > 9 ? new Date().getSeconds() : "0" + new Date().getSeconds()}  */}
								</span>
							</div>
							<div className={`${styles.logo_title} me-3`}>
								<span className="ms-2">
									<i className="fa-solid fa-bell"></i>
								</span>
								<span className={`${styles.user_name} ms-1`}>
									{/* {data.data.userId} */}
								</span>
								<Link href="/">
									<a className={`${styles.logo} ms-2`}>
										<img src={"../../dora.jpg"} />
									</a>
								</Link>
							</div>
						</div>
					</div>
				</header>

				<style jsx>{`
					.nav_header {
						background-color: #fafafa;
						min-height: 100vh;
						position: fixed;
						padding: 3px;
						transform: translate(-5%, 80px);
						transition: transform 0.3s ease;
						z-index: 100;
					}

					@media screen and (max-width: 1200px) {
						.nav_header {
							transform: translate(-100%, 80px);
						}
						.nav_header.active {
							transform: translateY(80px);
						}
					}

					.h2_alert,
					.h2_alert {
						font-size: 36px;
					}

					@media screen and (max-width: 1000px) {
						.h2_alert {
							font-size: 28px;
						}
					}
					@media screen and (max-width: 800px) {
						.h2_alert {
							font-size: 20px;
						}
					}
				`}</style>

				<nav className="nav_header" ref={nav}>
					<div className={styles.box_menu}>
						<ul>
							<li>
								<button
									className="btn btn-success w-100"
									onClick={(ev) => changeComponent(0, ev)}
								>
									<i className="fa-solid fa-house me-2"></i>
									<span>ข้อมูลโรงเรียน</span>
								</button>
							</li>
						</ul>
					</div>
				</nav>

				<main className={styles.content}>
					<div className="container">
						{component}

						{/* <div className="alert alert-success alert-dismissible fade show">
				<div className='d-flex justify-content-center align-items-center'>
					<h2 className="alert-heading text-center h2_alert">
						โปรดรอการยืนยันจาก system admin 
					</h2>
					<span className="spinner-grow ms-3 h2_alert"></span>
				</div>
				<button className="btn-close" data-bs-dismiss="alert" />
			</div> */}
					</div>
				</main>
			</>
		);
	}
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
	//console.log(context);
	/*  const response = await fetch(`http://127.0.0.1:8000/user/${context.params.id}`)
    const data = await response.json() */
	//console.log("context", context);
	const school_data = {
		schoolName: "Stamp Witnapat School",
		Status: "active",
		paymentStatus: false,
		urlLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Prommanusorn.png",
		urlDocument: "https://image.shutterstock.com/image-vector/vector-logo-school-260nw-427910128.jpg",
		schoolID: "1",
	}
	return {
		props: { school_data },
		revalidate: 1,
	};
}