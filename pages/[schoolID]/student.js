import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import styles from "../../styles/admin.module.css"
import Nowclub from "../../components/student/nowClub"
import Pastclub from "../../components/student/pastClub"
import Searchclub from "../../components/student/searchClub"
import Reload from '../../components/reload'
import Cookies from "universal-cookie"
import { get_data } from "../../utils/auth";
import {forget_password } from "../../utils/unauth"
import Error from "next/error";
import { useRouter } from "next/router";
import Swal from "sweetalert2"

export default function Student({ schoolID }) {
	const nav = useRef();
	const time = useRef();
	const optionBtn = useRef([])
	const hamberger = useRef()
	const dropdown = useRef()
	const router = useRouter()
	let timer;

	const cookies = new Cookies();
	const token = cookies.get("token")
	
	const [displayFirst,setDisplayFirst] = useState("loading")
	const [countBtn,SetCountBtn] = useState(0)
	const [readyTime,setReadyTime] = useState(false)
	const [chooseBtnStart,setchooseBtnStart] = useState(false)
	const [saveEmail,setSaveEmail] = useState("")
	// ใช้ในหน้า pastClub
	const [schedule, setSchedule] = useState("")
	// check schedule
	const [inschedule, setInschedule] = useState(true)
	const [nowSchoolYear, setNowSchoolYear] = useState(0)
	const [userEmail, setUserEmail] = useState('')
	
	useEffect(() => {
		if (schoolID) {
			get_data(token).then(result => {
				if (result[1]) {
					// console.log(result)
					const data_tmp = result[0].data._doc
					const role = result[0].data.role
					const email = result[0].data.email
					if (role !== "student") {
						router.push("/" + String(schoolID))
					} else if (data_tmp) {
						data_tmp.schedule.forEach((data) => {
							// console.log("data = ",data)
							if (data.schoolYear === data_tmp.nowSchoolYear) {
								// console.log(data.schoolYear)
								const registerDate = new Date(data.registerDate)
								const endOfRegisterDate = new Date(data.endOfRegisterDate)
								const thisDate = new Date()
								//console.log(thisDate, registerDate, endOfRegisterDate)
								if (thisDate < registerDate || thisDate > endOfRegisterDate) {
									setInschedule(false)
								}
							}
						})
						if (data_tmp.schoolID != schoolID) {
							router.push("/" + String(data_tmp.schoolID))
						}
						else {
							setUserEmail(result[0].data.email)
							setNowSchoolYear(data_tmp.nowSchoolYear)
							setDisplayFirst(true)
							setSaveEmail(email)
							setchooseBtnStart(true)
							setReadyTime(true)
							// ใช้ในหน้า pastClub
							setSchedule(data_tmp.schedule)
						}
					} else {
						router.push("/" + String(schoolID))
					}
				}
				else {
					if (result[0].response.status !== 200) {
						router.push("/" + String(schoolID))
					}
				}
			})
		}
	},[schoolID]);

	useEffect(() => {
		if (readyTime){
			controllTime("start");
			window.addEventListener("click",stopClickWindow)

			return () => {
				controllTime("cancell");
				window.removeEventListener("click",stopClickWindow)
			}
		}
	},[readyTime]);

	useEffect(() => {
		if (chooseBtnStart){
			const component_now = localStorage.getItem('component');
			// console.log(component_now)
			if (component_now) {
				changeComponent(component_now)
				optionBtn.current[component_now].classList.add("nowclick");
			}
			else {
				optionBtn.current[0].classList.add("nowclick");
			}
		}
	},[chooseBtnStart]);

	function changeComponent(num) {
		localStorage.setItem('component', num);
		if (num == 0) {
			SetCountBtn(0)
		}else if (num == 1) {
			SetCountBtn(1)
		}else{
			SetCountBtn(2)
		}
		
		for (let i=0;i<=2;i++){
			if (i == num){
				optionBtn.current[i].classList.add("nowclick")
			}else{
				optionBtn.current[i].classList.remove("nowclick")
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

	/* เมื่อกดตรงไหนบนหน้าจอนอกจาก doraemon ให้ปิด dropdown */
	function stopClickWindow(){
		if (!dropdown.current.classList.contains("d-none")){
			dropdown.current.classList.add("d-none")
		}
	}

	const clickHamberger = () => {
		hamberger.current.classList.toggle("hamactive");
		nav.current.classList.toggle("active");
	};

	/* แสดง dropdown */
	const displayDropdown = (ev) => {
		ev.stopPropagation()
		dropdown.current.classList.toggle("d-none")
	}

	function logOut() {
		const cookies = new Cookies();
		//console.log(cookies.get("token"))
		cookies.remove("token", { path: `${schoolID}` })
		cookies.remove("token", { path: "/" })

		localStorage.removeItem('component');
		router.replace(`/${schoolID}`)
	}

	async function forgetPassword() {
		if (!saveEmail) {
			Swal.fire(
				'ไม่พบอีเมลของท่าน',
				'กรุณาลอง login ใหม่อีกครั้ง',
				'warning'
			)
			return
		}
		const body = { "email": saveEmail }

		Swal.fire({
			title: 'คุณต้องการเปลี่ยนรหัสผ่านใช่หรือไม่',
			showConfirmButton: true,
			confirmButtonColor: "#0208bb",
			confirmButtonText: 'ยืนยัน',

			showCancelButton: true,
			cancelButtonText: "ยกเลิก",
			cancelButtonColor: "#d93333",

			showLoaderOnConfirm: true,
			preConfirm: () => {
				return forget_password(body)
			},
			allowOutsideClick: false
		}).then((result) => {
			if (result.isConfirmed) {
				const result_update = result.value === "true" ? true : false
				if (!result_update) {
					Swal.fire({
						icon: 'error',
						title: 'เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง',
						showConfirmButton: true,
						confirmButtonColor: "#d1000a",
						confirmButtonText: 'ok',
					})
				} else {
					Swal.fire({
						icon: 'success',
						title: 'ส่งช่องทางการเปลี่ยนรหัสเรียบร้อย' + '\n' + 'กรุณาตรวจสอบ email',
						showConfirmButton: true,
						confirmButtonColor: "#009431",
						confirmButtonText: 'ok',
					})
				}

			}
		})
	}


	let component = null 
	if (countBtn === 0){
		component = <Nowclub schoolID={schoolID} inschedule={inschedule} nowSchoolYear={nowSchoolYear} />
	}else if (countBtn === 1){
		component = <Searchclub schoolID={schoolID} scheduled={schedule} inschedule={inschedule} nowSchoolYear={nowSchoolYear} />
	}else{
		// console.log(schedule)
		component = <Pastclub schoolID={schoolID} schedule={schedule} nowSchoolYear={nowSchoolYear} />
	}
	
	if (displayFirst === "loading"){
		return <Reload/>
	}else if (displayFirst){
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

				.help_text {
					display: none;
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

					.help_text_lg {
						display: none;
					}
					.help_text {
						display: inline;
					}
				}

				.nav_left{
					border-radius: 10px;
					padding: 6px 30px;
					cursor: pointer;
					text-align:left;
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
							<span className="ms-2">Dashboard</span>
							<span className="help_text_lg ms-2">{" - "}{userEmail}</span>
					</div>
					<div className={`${styles.header_item}`}>
						<div className={`${styles.time_alert} me-2`}>
							<span ref={time}></span>
							</div>
							<a className="help_text_lg" target="_blank"
								href="https://drive.google.com/file/d/1X1EOWeeZZWctY9S9zhVUIHT3tFpuYMtb/view?usp=share_link"
								rel="noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
								<div className=" d-flex justify-content-center align-items-center ms-3 me-2 p-1 border border-dark border-2 rounded-pill">
									<div className="me-1">คู่มือ</div>
									<div className=" fa-solid fa-circle-info"></div>
								</div>
							</a>
							<a className="help_text" target="_blank"
								href="https://drive.google.com/file/d/1X1EOWeeZZWctY9S9zhVUIHT3tFpuYMtb/view?usp=share_link"
								rel="noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
								<div className="help_text d-flex justify-content-center align-items-center ms-3 me-2">
									<div className=" fa-solid fa-circle-info"></div>
								</div>
							</a>
							<div className={`me-3 d-flex flex-row h-100`}>
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
								onClick={(ev) => changeComponent(0)}
								ref={el => optionBtn.current[0] = el}
							>

								<i className="fa-solid fa-book me-2"></i>
								<span>ชุมนุมปัจจุบัน</span>
							</div>
						</li>

						<li>
							<div className={`nav_left`} 
								onClick={(ev) => changeComponent(1)}
								ref={el => optionBtn.current[1] = el}
							>
								<i className="fa-solid fa-magnifying-glass me-2"></i>
								<span>ค้นหาชุมนุม</span>
							</div>
						</li>

						<li>
							<div className={`nav_left`} 
								onClick={(ev) => changeComponent(2)}
								ref={el => optionBtn.current[2] = el}
							>
								<i className="fa-solid fa-clock-rotate-left me-2"></i>
								<span>ชุมนุมที่เคยเรียน</span>
							</div>
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
	}else { 
		return <Error statusCode={404}/>
	}
}

export async function getStaticPaths() {
  	return {
		paths: [],
		fallback: true,
	};
}

export async function getStaticProps(context) {
	const schoolID = context.params.schoolID
	return {
		props: {schoolID},
		revalidate: 5
	};
}
