import React from "react";
import { useRef,useState,useEffect } from "react";
import ErrorPage from 'next/error'

export default function TimeConfig({ school_data }) {

	// ปีการศึกษา
	const schoolYear = useRef();
	// ปิดภาคเรียน
	const endOfSchoolYear = useRef();
	// ปิดลงชุมนุม
	const endOfRegisterDate = useRef();
	const endOfRegisterTime = useRef();
	// เปิดลงชุมนุม
	const registerTime = useRef();
	const registerDate = useRef();

	const alert_now = useRef();
	const alert_pass = useRef();
	const form = useRef()
	const btnEdit = useRef()
	const btnCancel = useRef()
	const btnConfirm = useRef()

	let showendOfSchoolYear = "";
	let showendOfRegisterDate = "";
	let showendOfRegisterTime = "";
	let showregisterTime = "";
	let showregisterDate = "";
	let savevalue = "";

	function startSetData(ev) {
		savevalue = JSON.stringify(ev);
		showendOfSchoolYear = ev.endOfSchoolYear;
		showendOfRegisterDate = ev.endOfRegisterDate;
		showendOfRegisterTime = ev.endOfRegisterTime;
		showregisterTime = ev.registerTime;
		showregisterDate = ev.registerDate;
	}

	function resetData() {
		// reset data
		schoolYear.current.value = savevalue;
		endOfSchoolYear.current.value = showendOfSchoolYear;
		endOfRegisterDate.current.value = showendOfRegisterDate;
		endOfRegisterTime.current.value = showendOfRegisterTime;
		registerTime.current.value = showregisterTime;
		registerDate.current.value = showregisterDate;
	}

	function setData(ev) {
		ev.preventDefault();

		const schedule = JSON.parse(ev.target.value);

		if (schedule.schoolYear == school_data.nowSchoolYear) {
			alert_now.current.classList.remove("d-none")
			alert_pass.current.classList.add("d-none")
			btnEdit.current.classList.remove("d-none")
		}
		else {
			alert_now.current.classList.add("d-none")
			alert_pass.current.classList.remove("d-none")
			btnEdit.current.classList.add("d-none")

		}

		//console.log(schedule)
		endOfSchoolYear.current.value = schedule.endOfSchoolYear;
		endOfRegisterDate.current.value = schedule.endOfRegisterDate;
		endOfRegisterTime.current.value = schedule.endOfRegisterTime;
		registerTime.current.value = schedule.registerTime;
		registerDate.current.value = schedule.registerDate;
	}

	function taskEdit(ev){
		ev.preventDefault()
		btnCancel.current.classList.remove("d-none")
		btnConfirm.current.classList.remove("d-none")
		btnEdit.current.classList.add("d-none")
		//schoolYear.current.disabled = true
	
		for (let i =0 ;i<form.current.elements.length;i++){
			if (form.current.elements[i].nodeName === "BUTTON"){
				continue
			}
			else if (form.current.elements[i].nodeName === "SELECT") {
				form.current.elements[i].disabled = true
				continue
			}
			form.current.elements[i].disabled = false
		}
	}

	function taskCancel(ev){
		ev.preventDefault()
		btnCancel.current.classList.add("d-none")
		btnConfirm.current.classList.add("d-none")
		btnEdit.current.classList.remove("d-none")
	
		resetData();

		for (let i =0 ;i<form.current.elements.length;i++){
			if (form.current.elements[i].nodeName === "BUTTON" ) {
				continue
			}
			else if (form.current.elements[i].nodeName === "SELECT") {
				form.current.elements[i].disabled = false
				continue
			}
			form.current.elements[i].disabled = true
		}
	}
	
	function taskConfirm(ev){
		// ภายในนี้จะมีการส่งข้อมูลด้วย
		ev.preventDefault()
		btnCancel.current.classList.add("d-none")
		btnConfirm.current.classList.add("d-none")
		btnEdit.current.classList.remove("d-none")

		const body = {
			schoolYear:schoolYear.current.value,
			endOfSchoolYear:endOfSchoolYear.current.value ,
			endOfRegisterDate:endOfRegisterDate.current.value,
			endOfRegisterTime:endOfRegisterTime.current.value,
			registerTime:registerTime.current.value,
			registerDate:registerDate.current.value
		}
		console.log(body)

		resetData()
	
		for (let i =0 ;i<form.current.elements.length;i++){
			if (form.current.elements[i].nodeName === "BUTTON" ) {
				continue
			}
			else if (form.current.elements[i].nodeName === "SELECT") {
				form.current.elements[i].disabled = false
				continue
			}
			form.current.elements[i].disabled = true
		}
		
	}

	
	if (!school_data.paymentStatus) {
		return <ErrorPage statusCode={404} />;
	}

	
	return (
		<main>
			<div className="container">
				<h2 className="text-center mt-2">ตั้งเวลาลงทะเบียน</h2>
				<form className="row g-4 p-2" ref={form}>
					<div className="">
						<div className="alert alert-success" role="alert" ref={alert_now}>
							ปีการศึกษาปัจจุบัน - สามารถแก้ไขระยะเวลาต่างๆได้
						</div>
						<div className="alert alert-danger d-none" role="alert" ref={alert_pass}>
							ปีการศึกษาที่ผ่านมา - ไม่สามารถแก้ไขระยะเวลาต่างๆได้
						</div>
						<label className="form-label">ปีการศึกษา</label>
						<div className="input-group">
							<label className="input-group-text" >เลือกปีการศึกษา</label>
							<select className="form-select" onChange={(ev) => setData(ev)} ref={schoolYear} >
								{school_data.schedule.map((e, i) => {
									if (e.schoolYear == school_data.nowSchoolYear) {
										startSetData(e);
										return (
											<option value={JSON.stringify(e)} key={i} selected>{e.schoolYear}</option>
										);
									}
									else {
										return (
											<option value={JSON.stringify(e)} key={i} >{e.schoolYear}</option>
										);
									}
								})}
							</select>
						</div>
					</div>
					<div className="">
						<label className="form-label">ปิดภาคเรียน</label>
						<input type="date" className="form-control" disabled defaultValue={showendOfSchoolYear} ref={endOfSchoolYear}></input>
					</div>
					
					<div className="col-md-6 mt-4">
						<label className="form-label">เวลาเปิดลงทะเบียนชุมนุม</label>
						<input type="date" className="form-control" disabled defaultValue={showregisterDate} ref={registerDate}></input>
						<input type="time" className="form-control mt-3" disabled defaultValue={showregisterTime} ref={registerTime}></input>
					</div>
					<div className="col-md-6 mt-4">
						<label className="form-label">เวลาปิดลงทะเบียนชุมนุม</label>
						<input type="date" className="form-control" disabled defaultValue={showendOfRegisterDate} ref={endOfRegisterDate} ></input>
						<input type="time" className="form-control mt-3" disabled defaultValue={showendOfRegisterTime} ref={endOfRegisterTime} ></input>
					</div>
					<div className="d-flex justify-content-end">
						<button className="btn btn-danger d-none me-2" ref={btnCancel} onClick={(ev) => taskCancel(ev)}>ยกเลิก</button>	
						<button className="btn btn-warning me-2" ref={btnEdit} onClick={(ev) => taskEdit(ev)}>แก้ไข</button>	
						<button className="btn btn-success d-none" ref={btnConfirm} onClick={(ev) => taskConfirm(ev)}>ตกลง</button>	
					</div>
				</form>
			</div>
		</main>
	);
}



// import React from "react";
// import { useRef} from "react";
// import ErrorPage from 'next/error'

// export default function Configtime({ school_data }) {
//     // ประวัติวันปิดภาคเรียน
// 	const HistoryEndOfSchoolYear = useRef();
//     // ประวัติวันเปิดลงชุมนุม
//     const HistoryRegisterDate = useRef();
// 	const HistoryRegisterTime = useRef();
// 	// ประวัติวันปิดลงชุมนุม
// 	const HistoryEndOfRegisterDate = useRef();
// 	const HistoryEndOfRegisterTime = useRef();

//     // ประวัติวันปิดภาคเรียน
// 	const CurrentEndOfSchoolYear = useRef();
//     // ประวัติวันเปิดลงชุมนุม
//     const CurrentRegisterDate = useRef();
// 	const CurrentRegisterTime = useRef();
// 	// ประวัติวันปิดลงชุมนุม
// 	const CurrentEndOfRegisterDate = useRef();
// 	const CurrentEndOfRegisterTime = useRef();
	
//     const selectInModal = useRef()
// 	const form = useRef()
// 	const btnEdit = useRef()
// 	const btnCancel = useRef()
// 	const btnConfirm = useRef()
	
// 	/* ไว้แสดงประวัติข้อมูลของแต่ละปีใน modal เมื่อเกิด event onChange ของ select */
//     function changeSelectData(ev) {
// 		ev.preventDefault();
//         if (!(ev.target.value === "select")){
//             const schedule = JSON.parse(ev.target.value)
//             HistoryEndOfSchoolYear.current.value = schedule.endOfSchoolYear
//             HistoryRegisterTime.current.value = schedule.registerTime
//             HistoryRegisterDate.current.value = schedule.registerDate
//             HistoryEndOfRegisterDate.current.value = schedule.endOfRegisterDate
//             HistoryEndOfRegisterTime.current.value = schedule.endOfRegisterTime
//         }else{
//             selectInModal.current.value = "select"
//             HistoryEndOfSchoolYear.current.value = ""
//             HistoryRegisterTime.current.value = ""
//             HistoryRegisterDate.current.value = ""
//             HistoryEndOfRegisterDate.current.value = ""
//             HistoryEndOfRegisterTime.current.value = ""
//         }
//     }

//     /* เมื่อปิด modal ให้เคลียสถานะต่างๆ */
//     function closeModal(){
//         selectInModal.current.value = ""
//         HistoryEndOfSchoolYear.current.value = ""
//         HistoryRegisterTime.current.value = ""
//         HistoryRegisterDate.current.value = ""
//         HistoryEndOfRegisterDate.current.value = ""
//         HistoryEndOfRegisterTime.current.value = ""
//     }

//     /* ทำการคัดเลือกว่าถ้าเป็นปีปัจจุบัน จะไม่เอาไป gen option */
//     function genOption(schedule){
//         const result = schedule.filter(e => {
//             if (!e.nowSchoolYear){
//                 return e
//             }
//         })
        
//         return result 
//     }
	
//     /* เมื่อกด แก้ไข */
//     function taskEdit(ev){
// 		ev.preventDefault()
		
//         btnCancel.current.classList.remove("d-none")
// 		btnEdit.current.classList.add("d-none")
//         btnConfirm.current.classList.remove("d-none")
		
//         for (let i =0 ;i<form.current.elements.length;i++){
// 			if (form.current.elements[i].nodeName === "BUTTON"){
// 				continue
// 			}
// 			form.current.elements[i].readOnly = false
// 		}
// 	}

// 	/* เมื่อกด ยกเลิก */
//     function taskCancel(ev){
// 		ev.preventDefault()
// 		btnCancel.current.classList.add("d-none")
// 		btnEdit.current.classList.remove("d-none")
//         btnConfirm.current.classList.add("d-none")
		
//         for (let i =0 ;i<form.current.elements.length;i++){
// 			if (form.current.elements[i].nodeName === "BUTTON"){
// 				continue
// 			}
// 			form.current.elements[i].readOnly = true
// 		}
// 	}
	
// 	/* เมื่อกด confirm */
//     function taskConfirm(ev){
// 		// ภายในนี้จะมีการส่งข้อมูลด้วย
// 		ev.preventDefault()

		
// 		btnCancel.current.classList.add("d-none")
// 		btnEdit.current.classList.remove("d-none")
//         btnConfirm.current.classList.add("d-none")

//         /* เตรียมส่งข้อมูล */
//         const body = {
// 			endOfSchoolYear:CurrentEndOfSchoolYear.current.value ,
// 			endOfRegisterDate:CurrentRegisterDate.current.value,
// 			endOfRegisterTime:CurrentRegisterTime.current.value,
// 			registerTime:CurrentEndOfRegisterDate.current.value,
// 			registerDate:CurrentEndOfRegisterTime.current.value
// 		}
		
// 	    for (let i =0 ;i<form.current.elements.length;i++){
// 			if (form.current.elements[i].nodeName === "BUTTON"){
// 				continue
// 			}
// 			form.current.elements[i].readOnly = true
// 		}
		
// 	}

// 	if (!school_data.paymentStatus) {
// 		return <ErrorPage statusCode={404} />;
// 	}

// 	return (
// 		<main>
// 			<div className="container p-3">
// 				<h2 className="text-center mt-2">ตั้งเวลาลงทะเบียน</h2>
//                 <button className="btn btn-dark mt-3" data-bs-target="#mymodal" data-bs-toggle="modal">ดูประวัติการตั้งเวลา</button><br/>
// 				<span className="badge bg-success mt-4">ปีปัจจุบัน 2022</span>
//                 <form className="row g-3" ref={form}>
// 					<div>
// 						<label className="form-label mt-2">วันปิดภาคเรียน</label>
// 						<input type="date" className="form-control" readOnly ref={CurrentEndOfSchoolYear}></input>
// 					</div>
					
// 					<div className="col-md-6 mt-4">
// 						<label className="form-label">เวลาเปิดลงทะเบียนชุมนุม</label>
// 						<input type="date" className="form-control" readOnly ref={CurrentRegisterDate}></input>
// 						<input type="time" className="form-control mt-2" readOnly ref={CurrentRegisterTime}></input>
// 					</div>
// 					<div className="col-md-6 mt-4">
// 						<label className="form-label">เวลาปิดลงทะเบียนชุมนุม</label>
// 						<input type="date" className="form-control" readOnly ref={CurrentEndOfRegisterDate}></input>
// 						<input type="time" className="form-control mt-2" readOnly ref={CurrentEndOfRegisterTime}></input>
// 					</div>
// 					<div className="d-flex justify-content-end">
// 						<button className="btn btn-danger d-none me-2" ref={btnCancel} onClick={(ev) => taskCancel(ev)}>ยกเลิก</button>	
// 						<button className="btn btn-warning me-2" ref={btnEdit} onClick={(ev) => taskEdit(ev)}>แก้ไข</button>	
// 						<button className="btn btn-success d-none" ref={btnConfirm} onClick={(ev) => taskConfirm(ev)}>ตกลง</button>	
// 					</div>
// 				</form>
//             </div>
//             <div className="modal fade" id="mymodal">
// 				<div className="modal-dialog">
// 					<div className="modal-content">
// 						<div className="modal-header">
//                             <h3 className="modal-title">ประวัติเวลาที่เคยตั้งไว้</h3>
//                             <button className="btn-close" data-bs-dismiss="modal" onClick={()=> closeModal()}></button>
//                         </div>
// 						<div className="modal-body">
//                             <form className="row g-4 g-md-3">
//                                 <div className="col-12">
//                                     <div className="input-group">
//                                         <label className="input-group-text" >เลือกปีการศึกษา</label>
//                                         <select className="form-select" onChange={(ev) => changeSelectData(ev)} ref={selectInModal}>
//                                             <option value="select">select</option>
//                                             {genOption(school_data.schedule).map((e, i) => {
//                                                 return (
//                                                     <option value={JSON.stringify(e)} key={i}>{e.schoolYear}</option>
//                                                 );
//                                             })}
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="col-12">
//                                     <label className="form-label">วันปิดภาคเรียน</label>
//                                     <input type="date" className="form-control" readOnly ref={HistoryEndOfSchoolYear}></input>
//                                 </div>
                                
//                                 <div className="col-md-6">
//                                     <label className="form-label">เวลาเปิดลงทะเบียนชุมนุม</label>
//                                     <input type="date" className="form-control" readOnly ref={HistoryRegisterDate}></input>
//                                     <input type="time" className="form-control mt-2" readOnly ref={HistoryRegisterTime}></input>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <label className="form-label">เวลาปิดลงทะเบียนชุมนุม</label>
//                                     <input type="date" className="form-control" readOnly ref={HistoryEndOfRegisterDate} ></input>
//                                     <input type="time" className="form-control mt-2" readOnly ref={HistoryEndOfRegisterTime} ></input>
//                                 </div>
//                             </form>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</main>
// 	);
// }
