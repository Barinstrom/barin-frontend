import React from "react";
import { useRef} from "react";
import ErrorPage from 'next/error'

export default function Configtime({ school_data }) {
    const schedule = [
    {
        nowSchoolYear:true,
        schoolYear: "2022",
        registerDate: "",
        registerTime: "",
        endOfRegisterDate: "",
        endOfRegisterTime: "",
        endOfSchoolYear: "",
    },
    {
        nowSchoolYear:false,
        schoolYear: "2021",
        registerDate: "2021-05-01",
        registerTime: "10:00:00",
        endOfRegisterDate: "2021-05-10",
        endOfRegisterTime: "16:00:00",
        endOfSchoolYear: "2021-10-13",
    },
    {
        nowSchoolYear:false,
        schoolYear: "2020",
        registerDate: "2020-05-01",
        registerTime: "09:00:00",
        endOfRegisterDate: "2020-05-10",
        endOfRegisterTime: "16:00:00",
        endOfSchoolYear: "2020-10-15",
    },
    {
        nowSchoolYear:false,
        schoolYear: "2019",
        registerDate: "2019-05-01",
        registerTime: "10:00:00",
        endOfRegisterDate: "2019-05-12",
        endOfRegisterTime: "16:00:00",
        endOfSchoolYear: "2019-10-12",
    }]


    
	// ประวัติวันปิดภาคเรียน
	const HistoryEndOfSchoolYear = useRef();
    // ประวัติวันเปิดลงชุมนุม
    const HistoryRegisterDate = useRef();
	const HistoryRegisterTime = useRef();
	// ประวัติวันปิดลงชุมนุม
	const HistoryEndOfRegisterDate = useRef();
	const HistoryEndOfRegisterTime = useRef();

    // ประวัติวันปิดภาคเรียน
	const CurrentEndOfSchoolYear = useRef();
    // ประวัติวันเปิดลงชุมนุม
    const CurrentRegisterDate = useRef();
	const CurrentRegisterTime = useRef();
	// ประวัติวันปิดลงชุมนุม
	const CurrentEndOfRegisterDate = useRef();
	const CurrentEndOfRegisterTime = useRef();
	
    const selectInModal = useRef()
	const form = useRef()
	const btnEdit = useRef()
	const btnCancel = useRef()
	const btnConfirm = useRef()
	
	/* ไว้แสดงประวัติข้อมูลของแต่ละปีใน modal เมื่อเกิด event onChange ของ select */
    function changeSelectData(ev) {
		ev.preventDefault();
        if (!(ev.target.value === "select")){
            const schedule = JSON.parse(ev.target.value)
            HistoryEndOfSchoolYear.current.value = schedule.endOfSchoolYear
            HistoryRegisterTime.current.value = schedule.registerTime
            HistoryRegisterDate.current.value = schedule.registerDate
            HistoryEndOfRegisterDate.current.value = schedule.endOfRegisterDate
            HistoryEndOfRegisterTime.current.value = schedule.endOfRegisterTime
        }else{
            selectInModal.current.value = "select"
            HistoryEndOfSchoolYear.current.value = ""
            HistoryRegisterTime.current.value = ""
            HistoryRegisterDate.current.value = ""
            HistoryEndOfRegisterDate.current.value = ""
            HistoryEndOfRegisterTime.current.value = ""
        }
    }

    /* เมื่อปิด modal ให้เคลียสถานะต่างๆ */
    function closeModal(){
        selectInModal.current.value = ""
        HistoryEndOfSchoolYear.current.value = ""
        HistoryRegisterTime.current.value = ""
        HistoryRegisterDate.current.value = ""
        HistoryEndOfRegisterDate.current.value = ""
        HistoryEndOfRegisterTime.current.value = ""
    }

    /* ทำการคัดเลือกว่าถ้าเป็นปีปัจจุบัน จะไม่เอาไป gen option */
    function genOption(schedule){
        const result = schedule.filter(e => {
            if (!e.nowSchoolYear){
                return e
            }
        })
        
        return result 
    }
	
    /* เมื่อกด แก้ไข */
    function taskEdit(ev){
		ev.preventDefault()
		
        btnCancel.current.classList.remove("d-none")
		btnEdit.current.classList.add("d-none")
        btnConfirm.current.classList.remove("d-none")
		
        for (let i =0 ;i<form.current.elements.length;i++){
			if (form.current.elements[i].nodeName === "BUTTON"){
				continue
			}
			form.current.elements[i].readOnly = false
		}
	}

	/* เมื่อกด ยกเลิก */
    function taskCancel(ev){
		ev.preventDefault()
		btnCancel.current.classList.add("d-none")
		btnEdit.current.classList.remove("d-none")
        btnConfirm.current.classList.add("d-none")
		
        for (let i =0 ;i<form.current.elements.length;i++){
			if (form.current.elements[i].nodeName === "BUTTON"){
				continue
			}
			form.current.elements[i].readOnly = true
		}
	}
	
	/* เมื่อกด confirm */
    function taskConfirm(ev){
		// ภายในนี้จะมีการส่งข้อมูลด้วย
		ev.preventDefault()

		
		btnCancel.current.classList.add("d-none")
		btnEdit.current.classList.remove("d-none")
        btnConfirm.current.classList.add("d-none")

        /* เตรียมส่งข้อมูล */
        const body = {
			endOfSchoolYear:CurrentEndOfSchoolYear.current.value ,
			endOfRegisterDate:CurrentRegisterDate.current.value,
			endOfRegisterTime:CurrentRegisterTime.current.value,
			registerTime:CurrentEndOfRegisterDate.current.value,
			registerDate:CurrentEndOfRegisterTime.current.value
		}
		
	    for (let i =0 ;i<form.current.elements.length;i++){
			if (form.current.elements[i].nodeName === "BUTTON"){
				continue
			}
			form.current.elements[i].readOnly = true
		}
		
	}

	/* if (!school_data.paymentStatus) {
		return <ErrorPage statusCode={404} />;
	} */

	return (
		<main>
			<div className="container p-5">
				<h2 className="text-center mt-2">ตั้งเวลาลงทะเบียน</h2>
                <button className="btn btn-dark mt-3" data-bs-target="#mymodal" data-bs-toggle="modal">ดูประวัติการตั้งเวลา</button><br/>
				<span className="badge bg-success mt-5">ปีปัจจุบัน 2022</span>
                <form className="row g-3" ref={form}>
					<div>
						<label className="form-label mt-2">วันปิดภาคเรียน</label>
						<input type="date" className="form-control" readOnly ref={CurrentEndOfSchoolYear}></input>
					</div>
					
					<div className="col-md-6 mt-4">
						<label className="form-label">เวลาเปิดลงทะเบียนชุมนุม</label>
						<input type="date" className="form-control" readOnly ref={CurrentRegisterDate}></input>
						<input type="time" className="form-control mt-2" readOnly ref={CurrentRegisterTime}></input>
					</div>
					<div className="col-md-6 mt-4">
						<label className="form-label">เวลาปิดลงทะเบียนชุมนุม</label>
						<input type="date" className="form-control" readOnly ref={CurrentEndOfRegisterDate}></input>
						<input type="time" className="form-control mt-2" readOnly ref={CurrentEndOfRegisterTime}></input>
					</div>
					<div className="d-flex justify-content-end">
						<button className="btn btn-danger d-none me-2" ref={btnCancel} onClick={(ev) => taskCancel(ev)}>ยกเลิก</button>	
						<button className="btn btn-warning me-2" ref={btnEdit} onClick={(ev) => taskEdit(ev)}>แก้ไข</button>	
						<button className="btn btn-success d-none" ref={btnConfirm} onClick={(ev) => taskConfirm(ev)}>ตกลง</button>	
					</div>
				</form>
            </div>
            <div className="modal fade" id="mymodal">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
                            <h3 className="modal-title">ประวัติเวลาที่เคยตั้งไว้</h3>
                            <button className="btn-close" data-bs-dismiss="modal" onClick={()=> closeModal()}></button>
                        </div>
						<div className="modal-body">
                            <form className="row g-4 g-md-3">
                                <div className="col-12">
                                    <div className="input-group">
                                        <label className="input-group-text" >เลือกปีการศึกษา</label>
                                        <select className="form-select" onChange={(ev) => changeSelectData(ev)} ref={selectInModal}>
                                            <option value="select">select</option>
                                            {genOption(schedule).map((e, i) => {
                                                return (
                                                    <option value={JSON.stringify(e)} key={i}>{e.schoolYear}</option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">วันปิดภาคเรียน</label>
                                    <input type="date" className="form-control" readOnly ref={HistoryEndOfSchoolYear}></input>
                                </div>
                                
                                <div className="col-md-6">
                                    <label className="form-label">เวลาเปิดลงทะเบียนชุมนุม</label>
                                    <input type="date" className="form-control" readOnly ref={HistoryRegisterDate}></input>
                                    <input type="time" className="form-control mt-2" readOnly ref={HistoryRegisterTime}></input>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">เวลาปิดลงทะเบียนชุมนุม</label>
                                    <input type="date" className="form-control" readOnly ref={HistoryEndOfRegisterDate} ></input>
                                    <input type="time" className="form-control mt-2" readOnly ref={HistoryEndOfRegisterTime} ></input>
                                </div>
                            </form>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
