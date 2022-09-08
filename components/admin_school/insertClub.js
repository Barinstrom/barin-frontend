import React from "react"
import { useState } from "react";
import ErrorPage from "next/error";

export default function InsertTeacher({ school_data }) {



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

			<div className="card mt-5">
				<div className="card-body">
					<h5 className="card-title">เพิ่มข้อมูลของคลับ 1 คลับ</h5>
					<p className="card-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
				</div>
				<div className="card-footer">
					<div className="d-flex justify-content-end">
						<button  className="btn btn-success">ใส่ข้อมูล</button>
					</div>
				</div>
			</div>
		</main>
	);
}