import axios from "axios";
import React from "react"
import { useState } from "react";

export default function InsertTeacher() {
	const [csvFile, setCsvFile] = useState();

	function csvJSON(csv){
		let lines=csv.split("\n");
		let result = [];
		let headers=lines[0].split(",");
	  
		for(let i=1;i<lines.length;i++){
			let obj = {};
			let currentline=lines[i].split(",");
	  
			for(let j=0;j<headers.length;j++){
				obj[headers[j].trim()] = currentline[j].trim();
			}
	  
			result.push(obj);
	  	}
		
			//return result; //JavaScript object
			return result; //JSON
	  }

	const submit = () => {
        const file = csvFile;
        const reader = new FileReader();

        reader.onload = function(e) {
          const text = e.target.result;
          console.log("data = ",text);
		  console.log(csvJSON(text))
		  // แล้วนำ csvJSON(text) ไปใช้ต่อ
        }
		
			 reader.readAsText(file);

    }

	/* เมื่อกด click ปุ่มฟอร์มใน modal เพิ่มนักเรียน 1 คน จะทำการส่งข้อมูลไปให้ backend */
	async function SubmitOneStudent(ev){
		ev.preventDefault()

		const form = new FormData(ev.target)
		const formSuccess = Object.fromEntries(form.entries())
		
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


   	return (
		<main>
			<div className="text-center fs-1">InsertStudent</div>
			<div className="card mt-5">
				<div className="card-body">
					<h5 className="card-title">เพิ่มข้อมูลของนักเรียนหลายคน</h5>
					<p className="card-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
				</div>
				<div className="card-footer">
					<form>
						<div className="input-group">
							<input className="form-control" type='file'
								accept='.csv'
								id='csvFile'
								onChange={(e) => {
										setCsvFile(e.target.files[0])
								}}/>
							<button type="submit" className="btn btn-primary" onClick={(e) => {
								e.preventDefault()
								if(csvFile)submit()
							}}>ใส่ข้อมูล</button>
						</div>
					</form>

				</div>
			</div>

			{/* ส่วนเพิ่มนักเรียน 1 คน */}
			<div className="card mt-5">
				<div className="card-body">
					<h5 className="card-title">เพิ่มข้อมูลของนักเรียน 1 คน</h5>
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
								<h3 className="text-center">แบบฟอร์มเพิ่มข้อมูลนักเรียน</h3>
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
								<div className="col-sm-6">
									<label className="form-label">โทรศัพท์มือถือ</label>
									<input type="tel" className="form-control" name="tel"/>
								</div>
								<div className="col-sm-3">
									<label className="form-label">ชั้นปีที่</label>
									<input type="number" className="form-control" min="1" max="6" name="classYear"/>
								</div>
								<div className="col-sm-3">
									<label className="form-label">ปีการศึกษา</label>
									<input type="number" className="form-control" min="2565" name="enteredYear"/>
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