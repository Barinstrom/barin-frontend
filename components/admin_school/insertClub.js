import React from "react"
import { useState,useEffect,useRef } from "react";
import ErrorPage from "next/error";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import { add_club,add_clubs } from "../../utils/school_admin/add_data";
import {paginationTeacher} from '../../utils/auth'
import AllowAddClub from "./allowAddClub";

export default function InsertClub({ school_data, schoolID }) {
	/* hook state */
	const [clubImg, setClubImg] = useState("");
	const [csvFile, setCsvFile] = useState("");
	const [allowRegisterClubTeacher,setAllowRegisterClubTeacher] = useState(true)
	const [loading,setLoading] = useState(true)

	/* hook ref */
	const clubName = useRef()
	const clubInfo = useRef()
	const groupID = useRef()
	const firstname = useRef()
	const lastname = useRef()
	const limit = useRef()
	const category = useRef()
	const schoolYear = useRef()
	const startTime = useRef()
	const endTime = useRef()
	const urlPicture = useRef()
	
	const cookie = new Cookies()
	const token = cookie.get("token")

	const reload = (
        <main style={{height:"500px"}}>
            <div className="d-flex justify-content-center h-100 align-items-center">
                <div className="fs-4">loading ...</div>
                <div className="spinner-border ms-3"></div>
            </div>
        </main>
    )
	
	useEffect(() => {
		paginationTeacher({"page":1},token,schoolID).then(result => {
			console.log(result)
			if (!result) {
				setLoading(false)
				setAllowRegisterClubTeacher(true)
			}else {
				if (result.data.docs.length < 1){
					setLoading(false)
					setAllowRegisterClubTeacher(true)
				}else{
					setLoading(false)
					setAllowRegisterClubTeacher(false)
				}
			}
		})
	},[])
	
	
	function encodeImageFileAsURL(ev) {
		let file = ev.target.files[0];
		let reader = new FileReader();
		
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			setClubImg(reader.result);
		}
	}
	
	/* ส่วนของการแปลง string เป็น object */
    const stringtoObject = (text) => {
        const result = []
        const tmp = text.split("\n")
		const heads = tmp[0].split(",")
        
        for (let i=1;i<tmp.length;i++){
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
		console.log(result)
        return result
    }
    
    
    /* เมื่อกดปุ่มทำการอ่านข้อมูลจากไฟล์ csv */
    const submit = (ev) => {
        ev.preventDefault();
			if (!csvFile){
				Swal.fire({
					icon: 'warning',
					title: 'โปรดใส่ไฟล์ csv ด้วย',
					showConfirmButton: true,
					confirmButtonColor: "#f7a518",
					confirmButtonText: 'ok',
				})
				return
			}
			
			const fileSuccess = csvFile
			const reader = new FileReader()
			
			reader.readAsText(fileSuccess)
			reader.onloaded = () => {
					const text = reader.result;
					const body = stringtoObject(text)
					// if (data === "data is undefined"){
					// 		alert("ใส่ข้อมูลในไฟล์ csv ไม่ครบ")
					// 		return
					// }else{
					// 	console.log(data)
					// 	add_clubs(data,token,schoolID).then(result => {
					// 		console.log(result)
					// 	})
					// }
			}
		}
	
	async function SubmitOneClub(ev){
		ev.preventDefault()

		const tmp = {
			clubName:clubName.current.value,
			clubInfo:clubInfo.current.value,
			groupID:groupID.current.value,
			schoolYear:schoolYear.current.value,
			category:category.current.value,
			firstname:firstname.current.value,
			lastname:lastname.current.value,
			limit:limit.current.value,
			startTime:startTime.current.value,
			endTime:endTime.current.value
		}
		
		for (let e in tmp){
			if (!tmp[e] || !clubImg){
				Swal.fire({
					icon: 'warning',
					title: 'โปรดกรอกข้อมูลให้ครบถ้วน',
					showConfirmButton:true,
					confirmButtonColor:"#f7a518"
				})
				return
			}
		}

		const currentDate = new Date()
		const successCurrentDate = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`
		
		const startTimeCheck = Date.parse(`${successCurrentDate} ${startTime.current.value}`)
		const endTimeCheck = Date.parse(`${successCurrentDate} ${endTime.current.value}`)
		
		if (endTimeCheck < startTimeCheck) {
			Swal.fire({
				icon: 'warning',
				title: 'ข้อมูล schedule ไม่ถูกต้อง',
				showConfirmButton: true,
				confirmButtonColor: "#f7a518",
				confirmButtonText: 'ok',
			})
			return
		}else {
			const body = {
				...tmp,
				"schedule":[startTime.current.value + "-" + endTime.current.value],
				"urlPicture":clubImg
			}
			
			const result = await add_club(body,token,schoolID);
			if (!result){
				Swal.fire({
					icon: 'error',
					title: 'เพิ่มข้อมูลไม่สำเร็จ',
					showConfirmButton:true,
					confirmButtonColor:"#ce0303"
				})
			}else{
				Swal.fire({
					icon: 'success',
					title: 'เพิ่มข้อมูลเสร็จสิ้น',
					showConfirmButton:true,
					confirmButtonColor:"#009431"
				})
			}
		}
	}

	function clearInfo(){
		clubName.current.value = ""
		clubInfo.current.value = ""
		groupID.current.value = ""
		schoolYear.current.value = ""
		category.current.value = ""
		firstname.current.value = ""
		lastname.current.value = ""
		limit.current.value = ""
		startTime.current.value = ""
		endTime.current.value = ""
		urlPicture.current.value = ""
	}
		
	if (!school_data.paymentStatus) {
		return <ErrorPage statusCode={404} />;
	}else if (loading){
		return reload
	}else if (allowRegisterClubTeacher){
		return <AllowAddClub/>
	}else{
		return (
			<>
				<div className="text-center fs-1">InsertClub</div>
				<div className="card mt-5">
					<div className="card-body">
						<h5 className="card-title">เพิ่มข้อมูลของชุมนุมหลายชุมนุม</h5>
						<p className="card-text">ถ้าหากต้องการเพิ่มข้อมูลชุมนุมหลายชุมนุม สามารถนำรายชื่อที่มีจากไฟล์ csv และทำการใส่ไฟล์ในนี้ได้เลย</p>
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
						<h5 className="card-title">เพิ่มข้อมูลของชุมนุม 1 ชุมนุม</h5>
						<p className="card-text">ถ้าหากต้องการเพิ่มข้อมูลชุมนุมแค่ 1 ชุมนุม คุณไม่จำเป็นต้องสร้างไฟล์ csv สามารถกรอกแบบฟอร์มได้เลย</p>
					</div>
					<div className="card-footer">
						<div className="d-flex justify-content-end">
							<button  className="btn btn-primary" data-bs-target="#insertModalClub" data-bs-toggle="modal">ใส่ข้อมูล</button>
						</div>
					</div>
				</div>
				
				{/* modal กดแสดงตอนเพิ่มข้อมูล 1 คน */}
				<div className="modal fade" id="insertModalClub">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h3 className="text-center">แบบฟอร์มเพิ่มข้อมูลชุมนุม</h3>
								<button className="btn-close" data-bs-dismiss="modal" onClick={clearInfo}></button>
							</div>
							<div className="modal-body">
								<form className="row gy-2 gx-3" onSubmit={(ev) => SubmitOneClub(ev)}>
									<div className="col-12">
										<label className="form-label">ชื่อชุมนุม</label>
										<input type="text" className="form-control" ref={clubName}/>
									</div>
									<div className="col-12">
										<label className="form-label">รหัสวิชา</label>
										<input type="text" className="form-control" ref={groupID}/>
									</div>
									<div className="col-6">
										<label className="form-label">ชื่อ ครูผู้สอน</label>
										<input type="text" className="form-control" ref={firstname} />
									</div>
									<div className="col-6">
										<label className="form-label">นามสกุล ครูผู้สอน</label>
										<input type="text" className="form-control" ref={lastname} />
									</div>
									<div className="col-12">
										<label className="form-label">category</label>
										<input type="text" className="form-control" ref={category}/>
									</div>
									<div className="col-12">
										<label className="form-label">รายละเอียดชุมนุม</label>
										<textarea className="form-control" rows="3" ref={clubInfo}></textarea>
									</div>
									<div className="col-sm-6">
										<label className="form-label">จำนวนนักเรียนสูงสุด</label>
										<input type="number" className="form-control" ref={limit}/>
									</div>
									<div className="col-sm-6">
										<label className="form-label">ปีการศึกษา</label>
										<input type="number" className="form-control" min={school_data.nowSchoolYear} ref={schoolYear}/>
									</div>
									<div className="col-sm-6">
										<label className="form-label">เวลาเริ่ม</label>
										<input type="time" className="form-control mt-3" ref={startTime} />
									</div>
									<div className="col-sm-6">
										<label className="form-label">เวลาจบ</label>
										<input type="time" className="form-control mt-3" ref={endTime} />
									</div>
									<div className="col-12">
										<label className="form-label">รูปโปรโมทชุมนุม</label>
										<br />
										<input
											className="form-control"
											type="file"
											onChange={(ev) => encodeImageFileAsURL(ev)}
											ref={urlPicture}
										/>
									</div>
									<div className="col-12 mt-4 text-center">
										<input type="submit" className="btn btn-success w-100" value="ตกลง"/>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}