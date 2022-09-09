import React from "react"
import { useState } from "react";
import ErrorPage from "next/error";

export default function InsertTeacher({ school_data }) {
	const [csvFile, setCsvFile] = useState("");

	/* ส่วนของการแปลง string เป็น object */
    const stringtoObject = (text) => {
        const result = []
        const tmp = text.split("\n")
        const heads = tmp[0].split(",")
        
        for (let i=1;i<tmp.length-1;i++){
            const line = tmp[i].split(",")
            const object = {}
            for (let j=0;j<heads.length;j++){
                if (line[j] === ""){
                    return "data is undefined"
                }else{
                    object[heads[j].trim()] = line[j].trim()
                }
            }
            result.push(object)
        }
        return result
    }
    
    
    /* เมื่อกดปุ่มทำการอ่านข้อมูลจากไฟล์ csv */
    const submit = (ev) => {
        ev.preventDefault();
		if (csvFile === ""){
			alert("โปรดเลือกไฟล์ที่ต้องการส่งด้วย")
			return
		}
		
		const fileSuccess = csvFile
        //console.log(fileSuccess)
        
        // ใช้ FileReader ในการอ่านไฟล์
        const reader = new FileReader()
        reader.readAsText(fileSuccess)

        // เมื่อทำการอ่านข้อมูลสำเร็จให้จะเกิด event นี้และได้ค่าที่อ่านมาเป็น string
        reader.onload = (ev) => {
            const text = ev.target.result;
            //console.log(text)
            const result = stringtoObject(text)
            if (result === "data is undefined"){
                alert("ใส่ข้อมูลในไฟล์ csv ไม่ครบ")
                return
            }else{
                console.log(result)
            }
        }
    }
	
		if (!school_data.paymentStatus) {
			return <ErrorPage statusCode={404} />;
		}

   	return (
		<main>
			<div className="text-center fs-1">InsertClub</div>
			<div className="card mt-5">
				<div className="card-body">
					<h5 className="card-title">เพิ่มข้อมูลของคลับหลายคลับ</h5>
					<p className="card-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
				</div>
				<div className="card-footer">
					<form>
						<div className="input-group">
							<input className="form-control" 
								type='file'
								accept='.csv'
								onChange={(ev) => {setCsvFile(ev.target.files[0])
							}}/>
							<button type="submit" className="btn btn-success" onClick={(ev) => submit(ev)}>ยืนยัน</button>
						</div>
					</form>
				</div>
			</div>

			<div className="card mt-5">
				<div className="card-body">
					<h5 className="card-title">เพิ่มข้อมูลของคลับ 1 คลับ</h5>
					<p className="card-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
				</div>
				<div className="card-footer">
					<div className="d-flex justify-content-end">
						<button  className="btn btn-primary">ใส่ข้อมูล</button>
					</div>
				</div>
			</div>
		</main>
	);
}