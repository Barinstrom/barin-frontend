import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import styles from "../../styles/admin.module.css"
import Nowclub from "../../components/student/nowClub"
import Pastclub from "../../components/student/pastClub"
import Searchclub from "../../components/student/searchClub"
import Reload from '../../components/reload'
import Cookies from "universal-cookie"
import { get_data } from "../../utils/auth";
import { get_all_schoolID } from "../../utils/unauth"
import Error from "next/error";
import { useRouter } from "next/router";


export default function Student({ schoolID }) {
	const nav = useRef();
	const time = useRef();
	const optionBtn = useRef([])
	const hamberger = useRef()
	const dropdown = useRef()
	const router = useRouter()
	/* ตัวแปรเก็บค่า timer */
	let timer;
	
	const [data_school,setData_school] = useState()
	const [displayFirst,setDisplayFirst] = useState("loading")
	const [countBtn,SetCountBtn] = useState(0)
	const [readyTime,setReadyTime] = useState(false)
	const [chooseBtnStart,setchooseBtnStart] = useState(false)

	useEffect(() => {
		const cookies = new Cookies();
		const token = cookies.get("token");

		Promise.all([get_data(token)])
			.then(result => {
				// console.log(result[0][0].data)

				if (result[0][1]) {
					const data_tmp = result[0][0].data._doc
					const role = result[0][0].data.role
					if (role !== "student") {
						setDisplayFirst(false)
					}

					else if (data_tmp) {
						setDisplayFirst(true)
						setData_school(data_tmp)
						setchooseBtnStart(true)
						setReadyTime(true)
					} else {
						setDisplayFirst(false)
					}
				}
				else {
					if (result[0][0].response.status === 401) {
						setDisplayFirst(false)
					}
				}
			})
	},[]);


	useEffect(() => {
		if (readyTime){
			controllTime("start");
			return () => {
				controllTime("cancell");
			}
		}

		if (chooseBtnStart){
			optionBtn.current[0].classList.add("nowclick");
		}
	},[readyTime,chooseBtnStart]);

	useEffect(() => {
		if (chooseBtnStart){
			optionBtn.current[0].classList.add("nowclick");
		}
	},[chooseBtnStart]);

	function changeComponent(num) {
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
		console.log(cookies.get("token"))
		cookies.remove("token", { path: `${schoolID}` })
		cookies.remove("token", { path: "/" })

		router.replace("/")
	}

	function forgetPassword() {
		const cookies = new Cookies();
		const token = cookies.get("token")

		// ตรงนี้ติดไว้แบบนี้ก่อนละกัน รอแตมป์มาช่วย
		router.replace(`/forgotPass`)
	}


	let component = null 
	if (countBtn === 0){
		component = <Nowclub schoolID={schoolID}/>
	}else if (countBtn === 1){
		component = <Searchclub schoolID={schoolID}/>
	}else{
		component = <Pastclub schoolID={schoolID}/>
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
  const schoolPathAll = await get_all_schoolID();
  
  const schoolPathGenerate = schoolPathAll.data
  const all_path = schoolPathGenerate.map((e) => {
		return { params: e }
	})
  
  return {
		paths: all_path,
		fallback: false,
	};
}

export async function getStaticProps(context) {
	const schoolID = context.params.schoolID
	return {
		props: {schoolID},
		revalidate: 5
	};
}
