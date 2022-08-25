import React,{ useRef } from 'react'
import Link from 'next/link'
import styles from '../styles/admin.module.css'
import { get_userdata } from "../utils/auth";
import * as cookie from "cookie";

export default function Admin({data}) {
    /* template ร่างไว้คร่าวๆนะ เดียวมาอธิบายแล้วสอนพร้อมกันอีกที อันนี้ทำไม่ค่อยสวยมาก แต่
    responsive ละ เดียวตอนทำจริงตอนไปสร้างเป็น layout อีกที */

    const nav = useRef()
    const clickHamberger = () => {
        nav.current.classList.toggle("active")
    }
    
    return (
		<>
			<header
				className={`${styles.head} navbar navbar-dark bg-dark d-flex`}
			>
				<div
					className={`${styles.header_main} text-white d-flex justify-content-between`}
				>
					<div className={styles.header_item1}>
						<button
							className={styles.button_hamberger}
							onClick={clickHamberger}
						>
							<i className="fa-solid fa-bars"></i>
						</button>
						<span>Dashboard</span>
					</div>
					<div className={`${styles.header_item2}`}>
						<div className={styles.time_alert}>
							<span>12:02:50</span>
							<span>
								<i className="fa-solid fa-bell"></i>
							</span>
						</div>

						<div className={styles.logo_title}>
							<Link href="/">
								<a className={styles.logo}>
									<img src={"./dora.jpg"} />
								</a>
							</Link>
							<span className={styles.user_name}>
								{data.data.email}
							</span>
						</div>
					</div>
				</div>
			</header>

			<style jsx>{`
				.nav_header {
					background-color: rgb(218, 217, 217);
					min-height: 100vh;
					position: fixed;
					padding: 10px;
					transform: translateY(80px);
					transition: transform 0.3s ease;
					z-index: 100;
				}

				@media screen and (max-width: 1200px) {
					.nav_header {
						transform: translate(-100%, 80px);
					}
					.nav_header.active {
						transform: translate(0, 80px);
					}
				}
				@media screen and (max-width: 600px) {
					.nav_header {
						transform: translate(-100%, 80px);
					}
					.nav_header.active {
						transform: translate(0, 80px);
					}
				}
			`}</style>

			<nav className="nav_header" ref={nav}>
				<div className={styles.box_menu}>
					<ul>
						<li>
							<Link href="/">
								<a>
									<i className="fa-solid fa-house"></i>
									<span className={styles.item}>Home</span>
								</a>
							</Link>
						</li>
						<li>
							<Link href="/">
								<a>
									<i className="fa-solid fa-user"></i>
									<span className={styles.item}>Profile</span>
								</a>
							</Link>
						</li>
						<li>
							<Link href="/">
								<a>
									<i className="fa-regular fa-address-card"></i>
									<span className={styles.item}>Member</span>
								</a>
							</Link>
						</li>
						<li>
							<Link href="/">
								<a>
									<i className="fa-solid fa-list-check"></i>
									<span className={styles.item}>Task</span>
								</a>
							</Link>
						</li>
						<li>
							<Link href="/">
								<a>
									<i className="fa-solid fa-gear"></i>
									<span className={styles.item}>Setting</span>
								</a>
							</Link>
						</li>
					</ul>
				</div>
			</nav>

			<main className={styles.content}>
				<div className="container">
					<div className="row">
						<div className="col-12">
							<div className="alert alert-success alert-dismissible fade show">
								<h2 className="alert-heading">
									ขออภัยคุณไม่สามารถลงทะเบียนได้
									เนื่องจากไม่อยู่ในช่วงเวลา
								</h2>
								<p>
									Lorem ipsum dolor sit amet consectetur
									adipisicing elit. Tempora vero
								</p>
								<button
									className="btn-close"
									data-bs-dismiss="alert"
								/>
							</div>
						</div>
						<div className="col-12 mt-4">
							<ul className="list-group">
								<li className="list-group-item">hello react</li>
								<li className="list-group-item">hello vue</li>
							</ul>
						</div>
						<div className="col-12 mt-4">
							<div className="table-responsive">
								<table className="table table-bordered text-center">
									<thead className="table-dark">
										<tr>
											<th>ชื่อ</th>
											<th>นามสกุล</th>
											<th>อายุ</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>สมชาย</td>
											<td>ตั้งจิตดี</td>
											<td>32</td>
										</tr>
										<tr>
											<td>สมรักษ์</td>
											<td>คำสิงห์</td>
											<td>25</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div className="col-12">
							<div className="accordion" id="myparent">
								<div className="accordion-item">
									<h2 className="accordion-header">
										<button
											className="accordion-button collapsed"
											data-bs-toggle="collapse"
											data-bs-target="#mycollapse1"
										>
											text 1
										</button>
									</h2>
									<div
										className="accordion-collapse collapse"
										id="mycollapse1"
										data-bs-parent="#myparent"
									>
										<div className="accordion-body">
											<p>
												Lorem ipsum dolor sit amet
												consectetur adipisicing elit.
												Nulla consequatur perferendis
												tempore laudantium debitis
												fugiat at voluptate molestias
												vel sit?
											</p>
										</div>
									</div>
								</div>
								<div className="accordion-item">
									<h2 className="accordion-header">
										<button
											className="accordion-button collapsed"
											data-bs-toggle="collapse"
											data-bs-target="#mycollapse2"
										>
											text 2
										</button>
									</h2>
									<div
										className="accordion-collapse collapse"
										id="mycollapse2"
										data-bs-parent="#myparent"
									>
										<div className="accordion-body">
											<p>
												Lorem ipsum dolor sit amet
												consectetur adipisicing elit.
												Nulla consequatur perferendis
												tempore laudantium debitis
												fugiat at voluptate molestias
												vel sit?
											</p>
										</div>
									</div>
								</div>
								<div className="accordion-item">
									<h2 className="accordion-header">
										<button
											className="accordion-button collapsed"
											data-bs-toggle="collapse"
											data-bs-target="#mycollapse3"
										>
											text 3
										</button>
									</h2>
									<div
										className="accordion-collapse collapse"
										id="mycollapse3"
										data-bs-parent="#myparent"
									>
										<div className="accordion-body">
											<p>
												Lorem ipsum dolor sit amet
												consectetur adipisicing elit.
												Nulla consequatur perferendis
												tempore laudantium debitis
												fugiat at voluptate molestias
												vel sit?
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}

// เอาข้อมูล cookie จากในเว็ป
export async function getServerSideProps(context) {
	try {
		const parsedCookies = await cookie.parse(context.req.headers.cookie);
		console.log(parsedCookies);

		//ส่งให้ get_userdata ดึงข้อมูลคนมาใส่ใน props
		const data = await get_userdata(parsedCookies.token);
		console.log("data =", data);
		if (data == false) {
			return { notFound: true };
		}
		return { props: { data } };
	} catch {
    return { notFound: true };
  }
}
