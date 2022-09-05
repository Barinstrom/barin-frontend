import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FileBase64 from 'react-file-base64';

export default function ModalJoJa({ res }) {
  const [clubname, setClubname] = useState("");
  const [category, setCategory] = useState("");
  const [clubinfo, setClubinfo] = useState("");
  const [scheduler, setScheduler] = useState("");
  const [picture, setPicture] = useState("");
  const [limit, setLimt] = useState("");


  //เลือกไฟล์รูปภาพ
  const [file,setfile] = useState()
	const [nameFile,setNameFile] = useState()
  function getFiles(ev){
		const base64file = ev.base64
		const namefile = ev.name
		/* set ค่า state */
		setfile(base64file);
		setNameFile(namefile);
    //ทำให้เปลี่ยนเป็นตามที่เลือก
		setPicture(base64file);
	}
  //ตัวอย่างข้อมูลเริ่มต้น
  let example = {
    clubname: "football",
    category: "default",
    clubinfo: "very good",
    //ปป/ดด/วัน (4 June, 2000)ก็ได้
    scheduler: "2022/05/03",
    picture: "https://dummyimage.com/300x300",
    limit: "50",
  };
  //คลิกแล้วset ค่าข้อมูล
  //ต้องแก้เป็น กดแล้ว fetch จาก database (อยู่ข้างล่างสุด)
  function clickModal(ev) {
    ev.preventDefault();
    const data = JSON.parse(ev.target.getAttribute("data-bs-info"));
    // console.log("ข้อมูลหลังจากกดปุ่ม modal ",data);
    setClubname(data.clubname);
    setCategory(data.category);
    setClubinfo(data.clubinfo);
    setScheduler(new Date(data.scheduler));
    setPicture(data.picture);
    setLimt(data.limit);
  }
  // post แต่ยังไม่ได้ลองว่าได้มั้ย
  const submitForm = (event) => {
    // submitแล้ว ควรจะ reload แต่ไม่รู้ทำไมไม่ได้
    event.preventDefault();
    const body = {
      clubname,
      category,
      clubinfo,
      scheduler,
      picture,
      limit,
    };
    console.log("ข้อมูลหลังจากกดปุ่ม submit",body)
    // fetch("https://jsonplaceholder.typicode.com/posts", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(body)

    // })
    // .then(res => res.json())
    // .then(result => console.log(result))
  };

  return (
    <>
      <main className="container vh-100 d-flex justify-content-center align-items-center">
        <div className="modal" id="modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className=" modal-header">
                <div className="modal-title h2">Club Infomation</div>
                <button className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className=" modal-body">
                <form className="row g-2 " onSubmit={submitForm}>
                  {/* รายละเอียด clubname */}
                  <div className="col-12">
                    <label className="form-label h5">Clubname</label>
                    <input
                      type="text"
                      className="form-control"
                      value={clubname}
                      onChange={(e) => setClubname(e.target.value)}
                      required
                    />
                  </div>
                  {/* category*/}
                  <div className="h6">category
                  <div className="btn-group ps-2">
                    <button
                      type="button"
                      className="btn btn-primary dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      
                      // onChange={e => setCategory(e.target.value)}
                    >
                      {category}
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button className="dropdown-item"  onClick={() => setCategory("default")}>
                          default
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item"  onClick={() => setCategory("action1")}>
                          action1
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item"  onClick={() => setCategory("action2")}>
                          action2
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => setCategory("action3")}>
                          action3
                        </button>
                      </li>
                    </ul>
                  </div>
                  </div>
          {/* //////// */}
                    {/* รายละเอีนด Clubinfo */}
                  <div className="col-12">
                    <label className="form-label h6">Clubinfo</label>
                    <input
                      type="text"
                      className="form-control"
                      value={clubinfo}
                      onChange={(e) => setClubinfo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12 row g-2">
                    {/* รายละเอีนด Scheduler */}
                    <label className="form-label h6">Scheduler</label>
                    <DatePicker
                      selected={scheduler}
                      onChange={(date) => setScheduler(date)}
                      className="form-label ms-1 border rounded-1 ps-3 p-1"
                      dateFormat="d MMMM, yyyy"
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                  {/* รายละเอีนด Picture */}
                  <div className="col-12">
                    <label className="form-label h6">Picture</label>
                    <div className="text-center">
                      <img
                        src={picture}
                        className="rounded img-fluid"
                        // alt="Responsive image"
                        // width="200px"
                        // height="200px"
                      />
                    </div>
                    {/* ก็อบมาจากresgister */}
                    <div className="col-lg-12">
							<br/>
							<FileBase64 className="form-control" onDone={(ev)=> getFiles(ev)} required/>
						</div>
              {/*  */}
                  </div>
                  {/* รายละเอีนด Limit */}
                  <div className="col-5">
                    <label className="form-label h6">Limit</label>
                    <input
                      type="text"
                      className="form-control"
                      value={limit}
                      onChange={(e) => setLimt(e.target.value)}
                      required
                    />
                  </div>
                  {/* ปุ่ม ตกลง/ยกเลิก */}
                  <span className="text-end">
                    <button className="btn btn-light" data-bs-dismiss="modal">
                      ยกเลิก
                    </button>
                    <button className="btn btn-primary ms-2" type="submit">
                      ตกลง
                    </button>
                  </span>
                </form>
              </div>
            </div>
          </div>
        </div>

        <button
          className="btn btn-dark"
          data-bs-toggle="modal"
          data-bs-target="#modal"
          data-bs-info={JSON.stringify(example)}
          onClick={(ev) => clickModal(ev)}
        >
          modal
        </button>
      </main>
    </>
  );
}

//ใช้ดึงข้อมูล
export async function getServerSideProps() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts").then(
    (res) => res.json()
  );
  // console.log(res)
  return {
    props: {
      res: res,
    },
  };
}
