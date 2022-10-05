import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/admin.module.css";
import { get_data } from "../../../utils/auth";
import { get_all_schoolID } from "../../../utils/unauth";

import EditStudent from "../../../components/admin_school/editStudent";
import EditTeacher from "../../../components/admin_school/editTeacher";
import EditClub from "../../../components/admin_school/editClub";
import EditOwnData from "../../../components/admin_school/editOwnData";
import InsertClub from "../../../components/admin_school/insertClub";
import InsertStudent from "../../../components/admin_school/insertStudent";
import InsertTeacher from "../../../components/admin_school/insertTeacher";
import SchoolData from "../../../components/admin_school/schoolData";
import TimeConfig from "../../../components/admin_school/timeConfig";
import Reload from "../../../components/reload";
import Cookies from "universal-cookie";
import Error from "next/error";
import { useRouter } from "next/router";

export default function Admin({ schoolID }) {
	console.log(schoolID)
	const nav = useRef();
	const time = useRef();
	const optionBtn = useRef([])
	const hamberger = useRef()
	const dropdown = useRef()
	const router = useRouter()
	let timer;

	const [displayFirst,setDisplayFirst] = useState("loading")
	const [data_school,setData_school] = useState(false)
	const [readyTime,setReadyTime] = useState(false)
	const [countBtn,SetCountBtn] = useState(0)
	const [chooseBtnStart, setchooseBtnStart] = useState(false)
	const [ispaid, setIspaid] = useState("")

	useEffect(() => {
		if (chooseBtnStart){
			optionBtn.current[0].classList.add("nowclick");
		}
	},[chooseBtnStart])

	useEffect(() => {
		if (readyTime){
			controllTime("start");
			
			window.addEventListener("click",stopClickWindow)

			return () => {
				controllTime("cancell");
				window.removeEventListener("click",stopClickWindow)
			}
		}
	},[readyTime])

	useEffect(() => {
		const cookies = new Cookies();
		const token = cookies.get("token");

		Promise.all([get_data(token)])
			.then(result => {
				console.log(result[0][0])
				//console.log(result[0][1])

				if (result[0][1]){
					const data_tmp = result[0][0].data._doc
					const role = result[0][0].data.role
					
					if (role !== "admin") {
						setDisplayFirst(false)
					}
					else {
						if (data_tmp) {
							if (data_tmp.schoolID != schoolID) {
								setDisplayFirst(false)
							}
							else {
								setIspaid(data_tmp.paymentStatus)
								setDisplayFirst(true)
								setData_school(data_tmp)
								setchooseBtnStart(true)
								setReadyTime(true)
							}
							
						} else {
							setDisplayFirst(false)
						}
					}
				}else{
					if (result[0][0].response.status === 401){
						setDisplayFirst(false)
					}
				}
			})
	},[])

	/* เมื่อกดตรงไหนบนหน้าจอนอกจาก doraemon ให้ปิด dropdown */
	function stopClickWindow(){
		if (!dropdown.current.classList.contains("d-none")){
			dropdown.current.classList.add("d-none")
		}
	}

	/* แสดง dropdown */
	const displayDropdown = (ev) => {
		ev.stopPropagation()
		dropdown.current.classList.toggle("d-none")
	}
	
	function changeComponent(num) {
		if (num == 0) {
			SetCountBtn(0)
		} else if (num == 1) {
			SetCountBtn(1)
		} else if (num == 2) {
			SetCountBtn(2)
		} else if (num == 3) {
			SetCountBtn(3)
		} else if (num == 4) {
			SetCountBtn(4)
		} else if (num == 5) {
			SetCountBtn(5)
		} else if (num == 6) {
			SetCountBtn(6)
		} else if (num == 7) {
			SetCountBtn(7)
		} else {
			SetCountBtn(8)
		}
		
		if (ispaid === "success") {
			for (let i = 0; i <= 8; i++) {
				if (i === num) {
					optionBtn.current[i].classList.add("nowclick")
				} else {
					optionBtn.current[i].classList.remove("nowclick")
				}
			}
		}
		nav.current.classList.remove("active");
		hamberger.current.classList.remove("hamactive");
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

	let component = null
	if (countBtn === 0) {
		component = <SchoolData school_data={data_school} schoolID={schoolID} />
	}else if (!data_school.paymentStatus) {
		component = <Error statusCode={404} />
	}else if (countBtn === 1) {
		component = <TimeConfig school_data={data_school} schoolID={schoolID} />
	}else if (countBtn === 2){
		component = <InsertTeacher school_data={data_school} schoolID={schoolID} />
	}else if (countBtn === 3){
		component = <InsertStudent school_data={data_school} schoolID={schoolID}/>
	}else if (countBtn === 4){
		component = <InsertClub school_data={data_school} schoolID={schoolID}/>
	}else if (countBtn === 5){
		component = <EditStudent school_data={data_school} schoolID={schoolID}/>
	}else if (countBtn === 6){
		component = <EditTeacher school_data={data_school} schoolID={schoolID}/>
	}else if (countBtn === 7){
		component = <EditClub school_data={data_school} schoolID={schoolID}/>
	}else{
		component = <EditOwnData school_data={data_school} schoolID={schoolID}/>
	}
	
	const clickHamberger = () => {
		hamberger.current.classList.toggle("hamactive");
		nav.current.classList.toggle("active");
	};


	function logOut(){
		const cookies = new Cookies();
		console.log(cookies.get("token"))
		cookies.remove("token",{path:`${schoolID}`})
		cookies.remove("token",{path:"/"})

		router.replace("/")
	}

	function forgetPassword(){
		const cookies = new Cookies();
		const token = cookies.get("token")
		
		router.replace(`/forgotPass`)
	}

	const admin_page_unpaid = (
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
						<div className={`me-3 d-flex flex-row h-100`}>
							<span className={`${styles.logo_bell}`}>
								<i className="fa-regular fa-bell"></i>
							</span>
							<span className={`${styles.user_name} ms-1`}>
								{/* {data.data.userId} */}
							</span>

							<div className={`${styles.logo}`}>
								<div className={`${styles.img_background}`} onClick={(ev) => displayDropdown(ev)}></div>
								<ul className={`${styles.menu_dropdown} d-none`} ref={dropdown}>
									<li style={{ cursor: "pointer" }} onClick={logOut}><span className="dropdown-item">logout</span></li>
									<li style={{ cursor: "pointer" }} onClick={forgetPassword}><span className="dropdown-item">reset password</span></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</header>

			<nav className="nav_header" ref={nav}>
 				<div className={styles.box_menu}>
					<ul>
 						<li>
							<div className={`nav_left`} 
								onClick={() => changeComponent(0)}
								ref={(el) => optionBtn.current[0] = el}
							>
								<i className="fa-solid fa-house me-2"></i>
								<span>ข้อมูลโรงเรียน</span>
							</div>
						</li>
					</ul>
				</div>
			</nav>

			<main className={styles.content}>
				<section className="container">
					{component}
				</section>
			</main>
		</>
	)

	const admin_page = (
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
						<div className={`me-3 d-flex flex-row h-100`}>
							<span className={`${styles.logo_bell}`}>
								<i className="fa-regular fa-bell"></i>
							</span>
							<span className={`${styles.user_name} ms-1`}>
								{/* {data.data.userId} */}
							</span>

							<div className={`${styles.logo}`}>
								<div className={`${styles.img_background}`} onClick={(ev) => displayDropdown(ev)}></div>
								<ul className={`${styles.menu_dropdown} d-none`} ref={dropdown}>
									<li style={{ cursor: "pointer" }} onClick={logOut}><span className="dropdown-item">logout</span></li>
									<li style={{ cursor: "pointer" }} onClick={forgetPassword}><span className="dropdown-item">reset password</span></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</header>

			<nav className="nav_header" ref={nav}>
 				<div className={styles.box_menu}>
					<ul>
 						<li>
							<div className={`nav_left`} 
								onClick={() => changeComponent(0)}
								ref={(el) => optionBtn.current[0] = el}
							>
								<i className="fa-solid fa-house me-2"></i>
								<span>ข้อมูลโรงเรียน</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={() => changeComponent(1)}
								ref={(el) => optionBtn.current[1] = el}
							>
								<i className="fa-solid fa-calendar-days me-2 ms-1"></i>
								<span >ตั้งเวลาลงทะเบียน	</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={() => changeComponent(2)}
								ref={(el) => optionBtn.current[2] = el}
							>
								<i className="fa-solid fa-chalkboard-user "></i>
								<span className="ms-2">เพิ่มข้อมูลครู</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={() => changeComponent(3)}
								ref={(el) => optionBtn.current[3] = el}
							>
								<i className="fa-solid fa-chalkboard-user "></i>
								<span className="ms-2">เพิ่มข้อมูลนักเรียน</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={() => changeComponent(4)}
								ref={(el) => optionBtn.current[4] = el}
							>
								<i className="fa-solid fa-book me-2 ms-1"></i>
								<span>เพิ่มข้อมูลชุมนุม</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={() => changeComponent(5)}
								ref={(el) => optionBtn.current[5] = el}
							>
								<i className="fa-solid fa-list-check"></i>
								<span className="ms-2">แก้ไขข้อมูลนักเรียน</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={() => changeComponent(6)}
								ref={(el) => optionBtn.current[6] = el}
							>
								<i className="fa-solid fa-list-check"></i>
								<span className="ms-2">แก้ไขข้อมูลครู</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={() => changeComponent(7)}
								ref={(el) => optionBtn.current[7] = el}
							>
								<i className="fa-solid fa-list-check"></i>
								<span className="ms-2">แก้ไขข้อมูลชุมนม</span>
							</div>
						</li>
						<li>
							<div className={`nav_left`} 
								onClick={() => changeComponent(8)}
								ref={(el) => optionBtn.current[8] = el}
							>
								<i className="fa-solid fa-list-check"></i>
								<span className="ms-2">แก้ไขข้อมูลตัวเอง</span>
							</div>
						</li>
					</ul>
				</div>
			</nav>

			<main className={styles.content}>
				<section className="container">
					{component}
				</section>
			</main>
		</>
	)

	if (displayFirst === "loading") { 
		return <Reload />
	}
	else if (displayFirst) {
		if (ispaid === "success") {
			return admin_page
		}
		else {
			return admin_page_unpaid
		}
	}
	else {
		return <Error statusCode={404}/>
	}
}

export async function getStaticPaths() {

	// const path_a = await get_all_schoolID();
  // // console.log("path_a = ", path_a.data)
  // const aa = path_a.data
  // const all_path = aa.map((e) => {
	// 	return { params: e }
	// })
  // // console.log(all_path)
	// return {
	// 	paths: all_path,
	// 	fallback: false,
	// };
	return {
		// paths: all_path,
		paths: [],
		fallback: true,
	};
}

export async function getStaticProps(context) {
	// const schoolID = context.params.schoolID
	// return {
	// 	props: { schoolID },
	// 	revalidate: 1,
	// };
	const schoolID_param = context.params.schoolID
	const schoolPathAll = await get_all_schoolID();
	// console.log(schoolID_param)
	const school_path_data = schoolPathAll.data.find(e => e.schoolID === schoolID_param)
	if (school_path_data) {
		let schoolID = school_path_data.schoolID
		return {
			props: { schoolID },
			revalidate: 1,
		}
	}
	else {
		return {
			notFound: true,
			revalidate: 1,
		}
	}
}
