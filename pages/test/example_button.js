import React from "react";
import { useRef } from "react";

export default function Approved() {
	const fname = useRef()
	const sname = useRef()
	
	let example = {
		"fname":"sukachathum",
		"sname":"seawsiritaworn"
	}

	function clickModal(ev) {
		ev.preventDefault();
		const data = JSON.parse(ev.target.getAttribute("data-bs-info"))
		//console.log(data)
		
		fname.current.defaultValue = data.fname
		sname.current.defaultValue = data.sname
	}

	return (
	<>
		<main className="container vh-100 d-flex justify-content-center align-items-center">
			<div className="modal" id="modal">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className=" modal-header">
							<div className="modal-title">แบบฟอร์มรับสมัคร</div>
							<button className="btn-close" data-bs-dismiss="modal"></button>
						</div>
						<div className=" modal-body">
							<form className="row g-2">
								<div className="col-12">
									<label className="form-label">ชื่อ</label>
									<input type="text" className="form-control" ref={fname} />
								</div>
								<div className="col-12">
									<label className="form-label">นามสกุล</label>
									<input type="text" className="form-control" ref={sname}/>
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button className="btn btn-success">ตกลง</button>
							<button className="btn btn-danger" data-bs-dismiss="modal">ยกเลิก</button>
						</div>
					</div>
				</div>
			</div>
			<button className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modal" data-bs-info={JSON.stringify(example)} onClick={(ev) => clickModal(ev)}>modal</button>
		</main>	
	</>
	)
}
		
	

