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
	// console.log(data);
	const nav = useRef();
	const time = useRef();
	const optionBtn = useRef([])
	const hamberger = useRef()
	/* ตัวแปรเก็บค่า timer */
	let timer;
	const [component, setComponent] = useState(<SchoolData school_data={school_data} />);

	function changeComponent(num, ev) {
		console.log(ev.target)
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
		for (let i=0;i<=8;i++){
			if (i == num){
				optionBtn.current[i].classList.add("nowclick")
			}else{
				optionBtn.current[i].classList.remove("nowclick")
			}
		}
		nav.current.classList.remove("active");
		hamberger.current.classList.remove("hamactive");
	}

	useEffect(() => {
		optionBtn.current[0].classList.add("nowclick");
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
	},[]);

	

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
		hamberger.current.classList.toggle("hamactive");
		nav.current.classList.toggle("active");
	};

	return (
		<>
			<style jsx>{`
				.nav_header {
					min-height: 100vh;
					position: fixed;
					padding: 3px;
					transform: translate(-5%, 80px);
					transition: transform 0.3s ease;
					z-index: 100;
					background-color: transparent;
				}

				.button_hamberger{
					width: 40px;
					height: 40px;
					border: none;
					opacity: 1;
					border-radius: 15px;
					font-size: 1.4rem;
					margin-right: 10px;
					display: none;
					background-color: transparent;
				}

				@media screen and (max-width: 1300px) {
					.nav_header {
						transform: translate(-100%, 80px);
					}
					.nav_header.active {
						transform: translateY(80px);
						background-color: white;
					}
					.button_hamberger{
						display: block;
					}
					.button_hamberger.hamactive{
						background-color: #e8e8e8;
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

				.nav_left{
					text-align: left;
					border-radius: 10px;
					padding: 6px 30px;
					cursor: pointer;
				}

				.nav_left.nowclick{
					background-color: #FFFFFF;
					box-shadow: rgba(0, 0, 0, 0.40) 2px 4px 10px;
				}
			`}</style>


			<header className={`${styles.head} navbar navbar-dark bg-white`}>
				<div className={`${styles.header_main} text-dark d-flex justify-content-between shadow`}>
					<div className={`${styles.header_item} ms-2 `}>
						<button
							className="button_hamberger"
							onClick={clickHamberger}
							ref={hamberger}
						>
							<i className="fa-solid fa-bars"></i>
						</button>
						<span className="ms-3">Dashboard</span>
					</div>
					<div className={`${styles.header_item}`}>
						<div className={`${styles.time_alert} me-2`}>
							<span ref={time}></span>
						</div>
						<div className={`me-2`}>
							<span className={`${styles.logo_bell}`}>
								<i className="fa-regular fa-bell"></i>
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

			
			<nav className="nav_header" ref={nav}>
 				<div className={styles.box_menu}>
					<ul>
 						<li>
							<div className={`nav_left`} 
								onClick={(ev) => changeComponent(0, ev)}
								ref={(el) => optionBtn.current[0] = el}
							>
								<i className="fa-solid fa-house me-2"></i>
								<span>ข้อมูลโรงเรียน</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={(ev) => changeComponent(1, ev)}
								ref={(el) => optionBtn.current[1] = el}
							>
								<i className="fa-solid fa-calendar-days me-2 ms-1"></i>
								<span >ตั้งเวลาลงทะเบียน	</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={(ev) => changeComponent(2, ev)}
								ref={(el) => optionBtn.current[2] = el}
							>
								<i className="fa-solid fa-chalkboard-user "></i>
								<span className="ms-2">เพิ่มข้อมูลครู</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={(ev) => changeComponent(3, ev)}
								ref={(el) => optionBtn.current[3] = el}
							>
								<i className="fa-solid fa-chalkboard-user "></i>
								<span className="ms-2">เพิ่มข้อมูลนักเรียน</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={(ev) => changeComponent(4, ev)}
								ref={(el) => optionBtn.current[4] = el}
							>
								<i className="fa-solid fa-book me-2 ms-1"></i>
								<span>เพิ่มข้อมูลชุมนุม</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={(ev) => changeComponent(5, ev)}
								ref={(el) => optionBtn.current[5] = el}
							>
								<i className="fa-solid fa-list-check"></i>
								<span className="ms-2">แก้ไขข้อมูลนักเรียน</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={(ev) => changeComponent(6, ev)}
								ref={(el) => optionBtn.current[6] = el}
							>
								<i className="fa-solid fa-list-check"></i>
								<span className="ms-2">แก้ไขข้อมูลครู</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={(ev) => changeComponent(7, ev)}
								ref={(el) => optionBtn.current[7] = el}
							>
								<i className="fa-solid fa-list-check"></i>
								<span className="ms-2">แก้ไขข้อมูลชุมนม</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={(ev) => changeComponent(8, ev)}
								ref={(el) => optionBtn.current[8] = el}
							>
								<i className="fa-solid fa-list-check"></i>
								<span className="ms-2">แก้ไขข้อมูลตัวเอง</span>
							</div>
						</li>
					</ul>
				</div>
			</nav>

			{/* ส่วน component มาแสดงผล */}
			<main className={styles.content}>
				<section className="container border">
					{component}
				</section>
			</main>

		</>
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
		schoolID: "stamp",
		nowSchoolYear: "2021",
		schedule:[
			// {
			// 	// nowSchoolYear:true,
			// 	schoolYear: "2022",
			// 	registerDate: "",
			// 	registerTime: "",
			// 	endOfRegisterDate: "",
			// 	endOfRegisterTime: "",
			// 	endOfSchoolYear: "",
			// },
			{
				// nowSchoolYear:false,
				schoolYear: "2021",
				registerDate: "2021-05-01",
				registerTime: "10:00:00",
				endOfRegisterDate: "2021-05-10",
				endOfRegisterTime: "16:00:00",
				endOfSchoolYear: "2021-10-13",
			},
			{
				// nowSchoolYear:false,
				schoolYear: "2020",
				registerDate: "2020-05-01",
				registerTime: "09:00:00",
				endOfRegisterDate: "2020-05-10",
				endOfRegisterTime: "16:00:00",
				endOfSchoolYear: "2020-10-15",
			},
			{
				// nowSchoolYear:false,
				schoolYear: "2019",
				registerDate: "2019-05-01",
				registerTime: "10:00:00",
				endOfRegisterDate: "2019-05-12",
				endOfRegisterTime: "16:00:00",
				endOfSchoolYear: "2019-10-12",
			}]
	}
	return {
		props: { school_data },
		revalidate: 1,
	};
}
