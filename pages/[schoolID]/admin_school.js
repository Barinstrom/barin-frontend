import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../../styles/admin.module.css";
//import { get_userdata } from "../../utils/auth";
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
	let timer;
	const optionBtn = useRef([])

	const [component, setComponent] = useState(<SchoolData school_data={school_data} />)

	useEffect(() => {
		controllTime("start");

		if (!school_data.paymentStatus) {
			for (let i = 0; i < 9; i++) {
				if (i == 0) {
					continue
				}
				optionBtn.current[i].hidden = true
			}
		}

		return () => {
			controllTime("cancell");
		};
	});

	function changeComponent(num, ev) {
		if (num == 0) {
			setComponent(<SchoolData school_data={school_data} />);
		} else if (num == 1) {
			setComponent(<TimeConfig school_data={school_data} />);
		} else if (num == 2) {
			setComponent(<InsertTeacher school_data={school_data} />);
		} else if (num == 3) {
			setComponent(<InsertStudent school_data={school_data} />);
		} else if (num == 4) {
			setComponent(<InsertClub school_data={school_data} />);
		} else if (num == 5) {
			setComponent(<EditStudent school_data={school_data} />);
		} else if (num == 6) {
			setComponent(<EditTeacher school_data={school_data} />);
		} else if (num == 7) {
			setComponent(<EditClub school_data={school_data} />);
		} else {
			setComponent(<EditOwnData school_data={school_data} />);
		}
		nav.current.classList.remove("active");
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

	return (
		<>
			<header className={`${styles.head} navbar navbar-dark bg-dark`}>
				<div className={`${styles.header_main} text-white d-flex justify-content-between`} >
					<div className={styles.header_item}>
						<button className={styles.button_hamberger} onClick={clickHamberger}>
							<i className="fa-solid fa-bars"></i>
						</button>
						<span>Dashboard</span>
					</div>
					<div className={`${styles.header_item}`}>
						<div className={`${styles.time_alert} me-2`}>
							<span ref={time}></span>
						</div>
						<div className={`${styles.logo_title} me-3`}>
							<span className="ms-2">
								<i className="fa-solid fa-bell"></i>
							</span>
							<span className={`${styles.user_name} ms-1`}>
								doreamon
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
					transform: translate(0,80px);
					transition: transform 0.3s ease;
					z-index: 100;
				}
				
				@media screen and (max-width: 1300px) {
					.nav_header {
						transform: translate(-100%, 80px);
					}
					.nav_header.active {
						transform: translate(0,80px);
					}
				}

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
							<button className="btn btn-success w-100"
								onClick={(ev) => changeComponent(0, ev)}
								ref={(el) => optionBtn.current[0] = el}
							>
								<i className="fa-solid fa-house me-2"></i>
								<span>ข้อมูลโรงเรียน</span>
							</button>
						</li>
						<li>
							<button className="btn btn-success  w-100"
								onClick={(ev) => changeComponent(1, ev)}
								ref={(el) => optionBtn.current[1] = el}
							>
								<i className="fa-solid fa-user me-2"></i>
								<span className={styles.item}>
									ตั้งเวลาลงทะเบียน
								</span>
							</button>
						</li>
						<li>
							<button className="btn btn-success w-100"
								onClick={(ev) => changeComponent(2, ev)}
								ref={(el) => optionBtn.current[2] = el}
							>
								<i className="fa-solid fa-house me-2"></i>
								<span>เพิ่มข้อมูลครู</span>
							</button>
						</li>
						<li>
							<button className="btn btn-success w-100"
								onClick={(ev) => changeComponent(3, ev)}
								ref={(el) => optionBtn.current[3] = el}
							>
								<i className="fa-solid fa-house me-2"></i>
								<span>เพิ่มข้อมูลนักเรียน</span>
							</button>
						</li>
						<li>
							<button className="btn btn-success w-100"
								onClick={(ev) => changeComponent(4, ev)}
								ref={(el) => optionBtn.current[4] = el}
							>
								<i className="fa-solid fa-house me-2"></i>
								<span>เพิ่มข้อมูลชุมนุม</span>
							</button>
						</li>
						<li>
							<button className="btn btn-success  w-100"
								onClick={(ev) => changeComponent(5, ev)}
								ref={(el) => optionBtn.current[5] = el}
							>
								<i className="fa-solid fa-address-card me-2"></i>
								<span>แก้ไขข้อมูลนักเรียน</span>
							</button>
						</li>
						<li>
							<button className="btn btn-success  w-100"
								onClick={(ev) => changeComponent(6, ev)}
								ref={(el) => optionBtn.current[6] = el}
							>
								<i className="fa-solid fa-address-card me-2"></i>
								<span>แก้ไขข้อมูลครู</span>
							</button>
						</li>
						<li>
							<button className="btn btn-success  w-100"
								onClick={(ev) => changeComponent(7, ev)}
								ref={(el) => optionBtn.current[7] = el}
							>
								<i className="fa-solid fa-list-check me-2"></i>
								<span>แก้ไขข้อมูลชุมนม</span>
							</button>
						</li>
						<li>
							<button className="btn btn-success  w-100"
								onClick={(ev) => changeComponent(8, ev)}
								ref={(el) => optionBtn.current[8] = el}
							>
								<i className="fa-solid fa-list-check me-2"></i>
								<span>แก้ไขข้อมูลตัวเอง</span>
							</button>
						</li>
					</ul>
				</div>
			</nav>

			{/* ส่วน component มาแสดงผล */}
			<main className={styles.content}>
				<div className="container">
					{component}
				</div>
			</main>
		</>
	)

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

	// "2020-09-02" = yyyy-mm-dd
	const school_data = {
		schoolName: "Stamp Witnapat School",
		Status: "active",
		paymentStatus: true, // จ่ายเงินหรือยัง
		urlLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Prommanusorn.png",
		urlDocument: "https://image.shutterstock.com/image-vector/vector-logo-school-260nw-427910128.jpg",
		schoolID: "1",
		schedule: [{
			schoolYear: "2020",
			registerDate: "2020-09-02",
			registerTime: "09:00:00",
			endOfRegisterDate: "2020-09-30",
			endOfRegisterTime: "16:00:00",
			endOfSchoolYear: "2021-02-03",
		},
		{
			schoolYear: "2021",
			registerDate: "2021-09-15",
			registerTime: "08:00:00",
			endOfRegisterDate: "2020-09-30",
			endOfRegisterTime: "17:00:00",
			endOfSchoolYear: "2022-02-03",
		},
		{
			schoolYear: "2022",
			registerDate: "2022-09-01",
			registerTime: "11:00:00",
			endOfRegisterDate: "2022-09-12",
			endOfRegisterTime: "15:00:00",
			endOfSchoolYear: "2023-02-03",
		}]
	}
	return {
		props: { school_data },
		revalidate: 1,
	};
}
