import React from "react";
import { get_userdata } from "../utils/auth";

export default function Home1({data}){
	return (
		<main className="vh-100 border border-4 border-dark">
			<div className="container p-5 mt-5 bg-info bg-opacity-50 rounded rounded-5">
				<p className="fs-1">Barin Storm doneV1</p>
				<p className="fs-3">{data.data.userId}</p>
				<p className="fs-3">{data.data.role}</p>
				<p className="fs-3">{data.data.email}</p>
			</div>
		</main>
	)
}

// ส่วนนี้จะทำใน server แต่คุกกี้ที่เก็บในบราวเซอร์ เราต้องทำการดึงคุกกี้ที่เก็บในบราวเซอร์มาให้ได้
export async function getServerSideProps(context) {
	try {
		/* ได้ token มาแบบ token=xxxxxxx ทำการ split ด้วย "=" แล้วเอาเฉพาะส่วนที่เป็น token จริงๆ */
		const cookieTmp = String(context.req.headers.cookie).split("=")[1]
		
		//ดึงข้อมูลคน โดยส่ง token ไปใน get_userdata แล้วส่งต่อไปยังคอมโพเนนต์เพื่อแสดงผล
		const data = await get_userdata(cookieTmp);
		//console.log(data)
		
		/* ถ้าสิ่งที่ return มาเป็น false */
		if (!data) {
			return { notFound: true };
		}
		
		return { props: { data } };
	}catch(err) {
    	/* ถ้ามี err console ออกมาดู */
		console.log(err.message)
		return { notFound: true };
  }
}
