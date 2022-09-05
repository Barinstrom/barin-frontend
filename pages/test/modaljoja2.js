import React, { useState } from "react";
import { useRef } from "react";
// import { useRef } from "react";

export default function ModalJoJa({res}) {
//   console.log(res[0].id)
  const clubname = useRef()
  const category = useRef()
  const clubinfo = useRef()
  const scheduler = useRef()
  const picture = useRef()
  const limit = useRef()

  // console.log(typeof res)
  let example = {
    clubname: "football",
    category: "2",
    clubinfo: "very good",
    scheduler: "11/11/1111",
    picture: "sdsd.jjj",
    limit: "50",
  };

  function clickModal(ev) {
    ev.preventDefault();
    const data = JSON.parse(ev.target.getAttribute("data-bs-info"));
    console.log(data);

    clubname.current.defaultValue = example.clubname
    category.current.defaultValue = example.category
    clubinfo.current.defaultValue = example.clubinfo
    scheduler.current.defaultValue = example.scheduler
    picture.current.defaultValue = example.picture
    limit.current.defaultValue = example.limit
  }
  const submitForm = (event) => {
    console.log("test data 11 =",clubname.current.value,category.current.value)
    // console.log("sssss")
    event.preventDefault();
    // console.log("test")
    fetch("sdsd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        clubname: "football",
        // category: ["1","2","3"] ,
        clubinfo: "very good",
        scheduler: "11/11/1111",
        picture: "sdsd.jjj",
        limit: "50",
      },
    });
  };


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
                <form className="row g-2" onSubmit={submitForm}>
                  <div className="col-12">
                    <label className="form-label">clubname = {clubname.current}</label>
                    <input
                      type="text"
                      className="form-control"
                      ref={clubname}
                    />
                  </div>
                  <div className="col-12 d-flex">
                    <label className="form-label">category</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      ref={category}
                    >
                      <option value="defalut">defalut</option>
                      <option value="1">action1</option>
                      <option value="2">action2</option>
                      <option value="3">action3</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">clubinfo</label>
                    <input
                      type="text"
                      className="form-control"
                      ref={clubinfo}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">scheduler</label>
                    <input
                      type="text"
                      className="form-control"
                      ref={scheduler}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">picture</label>
                    <input
                      type="text"
                      className="form-control"
                      ref={picture}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">limit</label>
                    <input type="text" className="form-control" 
                      ref={limit}
                    />
                  </div>
                  {/* ปุ่ม ตกลง/ยกเลิก */}
                  <span className="text-end">
                    <button className="btn btn-success" type="submit">
                      ตกลง
                    </button>
                    <button className="btn btn-danger" data-bs-dismiss="modal">
                      ยกเลิก
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
        >modal
        </button>
      </main>
    </>
  );
}
export async function getServerSideProps(){
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
     .then((res) => res.json())
	console.log("res =",res)
	return{
		props: {
			res
		}
	}
}