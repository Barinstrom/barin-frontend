import React from "react"
import { useState } from "react";
import ErrorPage from "next/error";

export default function InsertTeacher({ school_data }) {
	const [csvFile, setCsvFile] = useState();

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

	/* เมื่อกด click ปุ่มฟอร์มใน modal เพิ่มนักเรียน 1 คน จะทำการส่งข้อมูลไปให้ backend */
	async function SubmitOneStudent(ev){
		ev.preventDefault()

		const form = new FormData(ev.target)
		const formSuccess = Object.fromEntries(form.entries())
		console.log(formSuccess)
		
		/* ส่วนนี้รอไปก่อน */
		/* try{
			const response = await axios({
				url:"",
				method:"post",
				headers:{"Content-Type":"application/json"},
				data:JSON.stringify(formSuccess),
				timeout:3000
			})
		}catch(err){
			console.log(err.message)
		} */
	}

	
	if (!school_data.paymentStatus) {
		return <ErrorPage statusCode={404} />;
	}

   	return (
		<main>
			<div className="text-center fs-1">InsertTeacher</div>
			<div className="card mt-5">
				<div className="card-body">
					<h5 className="card-title">เพิ่มข้อมูลของคุณครูหลายคน</h5>
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
					<h5 className="card-title">เพิ่มข้อมูลของคุณครู 1 คน</h5>
					<p className="card-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
				</div>
				<div className="card-footer">
					<div className="d-flex justify-content-end">
						<button  className="btn btn-primary" data-bs-target="#mymodal" data-bs-toggle="modal">ใส่ข้อมูล</button>
					</div>
				</div>
			</div>

			{/* modal กดแสดงตอนเพิ่มข้อมูล 1 คน */}
			<div className="modal fade" id="mymodal">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<div className="w-100 mt-1">
								<h3 className="text-center">แบบฟอร์มเพิ่มข้อมูลคุณครู</h3>
							</div>
						</div>
						<div className="modal-body">
							<form className="row gy-2 gx-3" onSubmit={(ev) => SubmitOneStudent(ev)}>
								<div className="col-12">
									<label className="form-label">ชื่อ</label>
									<input type="text" className="form-control" name="firstname"/>
								</div>
								<div className="col-12">
									<label className="form-label">นามสกุล</label>
									<input type="text" className="form-control" name="lastname"/>
								</div>
								<div className="col-12">
									<label className="form-label">email</label>
									<input type="email" className="form-control" name="email"/>
								</div>
								<div className="col-12">
									<label className="form-label">โทรศัพท์มือถือ</label>
									<input type="tel" className="form-control" name="tel"/>
								</div>
								<div className="col-12 mt-4 text-center">
									<input type="submit" className="btn btn-success w-100" value="ตกลง"/>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}