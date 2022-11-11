import React from "react";
import { get_userdata } from "../utils/auth";
import { get_school } from "../utils/auth";
import { useState, useEffect } from "react";
/* มีการใช้ package universal-cookie */
import Cookies from "universal-cookie";

export default function Home2() {
	/* ตัวแปร data จะนำไปใช้เก็บข้อมูลที่ fetch มาจาก backend */
	const [data, setData] = useState("");
	const [school, setSchool] = useState("");

	const schoolID = "teststamp"
	
	/* จะทำ useeffect ก็ต่อเมื่อ render แค่ครั้งแรกเท่านั้น  */
	useEffect(() => {
		/* ทำการดึงคุกกี้จากบราวเซอร์มาเก็บใน token */
		const cookies = new Cookies();
		const token = cookies.get("token");
		//console.log("token =", token);
		
		/* มีการสร้างฟังชันก์เพื่อเรียก get_userdata  โดยต้องใช้ async await เพราะว่าต้องมีการรอให้ได้ข้อมูลก่อน เสร็จก่อนถึงจะไปทำอย่างอื่นได้*/
		async function waitGet_userdata(token,schoolID){
			const dataTemp = await get_userdata(token,schoolID);
			setData(dataTemp)
			// console.log("user",dataTemp)
		}

		async function waitGet_schooldata(token,schoolID){
			const dataTemp = await get_school(token,schoolID);
			setSchool(dataTemp)
			// console.log("school",dataTemp)
		}
		
		/* เรียกฟังชันก์ พร้อมส่งค่า token ไป */
		waitGet_userdata(token,schoolID)
		waitGet_schooldata(token,schoolID)
	},[])
	
	/* ถ้าหากไม่มีข้อมูลให้แสดงส่วนนี้ */
	if (!data){
		return (
			<main className="vh-100 border">
				<div className="d-flex justify-content-center h-100 align-items-center">
					<div className="fs-4">loading ...</div>
					<div className="spinner-border ms-3"></div>
				</div>
			</main>
		);
	}

	return (
		<main className="vh-100 border border-4 border-dark">
			<div className="container p-5 mt-5 bg-warning bg-opacity-50 rounded rounded-5">
				<p className="fs-1">Barin Storm doneV2</p>
				<p className="fs-3">{data.data.userId}</p>
				<p className="fs-3">{data.data.role}</p>
				<p className="fs-3">{data.data.email}</p>
			</div>
		</main>
	)
}


