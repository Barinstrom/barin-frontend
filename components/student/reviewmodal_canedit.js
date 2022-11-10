import React, { useState, useRef, useEffect } from "react";
import {useRouter} from "next/router";
import Cookies from "universal-cookie";
import {
  get_review,
  post_review,
  get_own_review,
  update_own_review,
  get_club_teachers,
  get_review_year
} from "../../utils/student/student";
import Swal from 'sweetalert2';

export default function ReviewEdit({ item, schoolID, nowSchoolYear }) {
  const [review, setReview] = useState()
  const [clubYears, setClubYears] = useState()
  const [paginate, setPaginate] = useState(null)
  const [addReview, setAddReview] = useState()
  const [icon, setIcon] = useState();
  const [tempNowChooseYear, setTempNowChooseYear] = useState()
  let nowChooseYear = ''
  let like = true
  const [reloadTable, setReloadTable] = useState(false)
  const [notShowAlert, setNotShowAlert] = useState(0)
  const [teacher, setTeacher] = useState()

  const cookies = new Cookies();
  const token = cookies.get("token");
  const clubName = useRef()
  const textReview = useRef()
  const router = useRouter()
  
  function changeIcon(ev, status) {
    ev.preventDefault()
    like = status
    const tmp = (
      <>
        <p className="form-label w-100 d-flex justify-content-between align-items-center">
          <span>เขียนรีวิว</span>
          <span>
            <button className="btn p-1 m-1" value="พอใจ" onClick={(ev) => changeIcon(ev, true)}
              style={
                like
                  ? { border: "solid 2px green", borderColor: "green" }
                  : { border: "solid 2px gray", borderColor: "gray" }
              }
            >
              <i className="fa-regular fa-thumbs-up fa-sm m-2" style={like ? { color: "green" } : { color: "gray" }} onClick={(ev) => { changeIcon(ev, true) }}>พอใจ</i>
            </button>

            <button className="btn p-1 m-1" value="ไม่พอใจ" onClick={(ev) => changeIcon(ev, false)}
              style={
                !like
                  ? { border: "solid 2px red", borderColor: "red" }
                  : { border: "solid 2px gray", borderColor: "gray" }
              }
            >
              <i className="fa-regular fa-thumbs-down fa-sm m-2" style={!like ? { color: "red" } : { color: "gray" }} onClick={(ev) => { changeIcon(ev, false) }}>ไม่พอใจ</i>
            </button>
          </span>
        </p>
      </>
    )
    setIcon(tmp)
  }

  function teacherName(clubID, nowChooseYear, token, schoolID) {
    const body = {
      clubID: clubID,
      schoolYear: nowChooseYear
    }
    let teacher_name = ""
    setTeacher(teacher_name)
    get_club_teachers(body, token, schoolID).then(result => {
      // console.log("teacher name =",result.data)
      if (result) {
        teacher_name = result.data[0].firstname + " " + result.data[0].lastname
      }
      else {
        teacher_name = "None"
      }
      setTeacher(teacher_name)
    })

  }

  const reload = (
    <main style={{ height: "400px" }}>
      <div className="d-flex justify-content-center h-100 align-items-center">
        <div className="fs-4">loading ...</div>
        <div className="spinner-border ms-3"></div>
      </div>
    </main>
  )
  const alert = (
    <div className="alert alert-dark">
      ยังไม่มีรีวิว
    </div>
  )

  const notGood = (
    <i className="p-1 m-1 rounded rounded-2" value="ไม่พอใจ"
      style={{ border: "solid 2px red", borderColor: "red" }}
    >
      <i className="fa-regular fa-thumbs-down fa-sm m-2" style={{ color: "red" }}>ไม่พอใจ</i>
    </i>
  )

  const isGood = (
    <i className="p-1 m-1 rounded rounded-2" value="พอใจ"
      style={{ border: "solid 2px green", borderColor: "green" }}
    >
      <i className="fa-regular fa-thumbs-up fa-sm m-2" style={{ color: "green" }} >พอใจ</i>
    </i>
  )
  
  async function postReview() {
    const status_satisfied = like ? "พอใจ": "ไม่พอใจ"
    if (textReview.current.value === ""){
        Swal.fire({
            icon: 'warning',
            title: 'โปรดกรอกข้อมูลให้ครบถ้วน!',
            showConfirmButton: true,
            confirmButtonColor: "#f7a518",
            confirmButtonText: 'ok',
        })
        return
    }
    const body = {
        "clubID" : item._id,
        "textReview" : textReview.current.value,
        "satisfiedLevel" : status_satisfied
    }
    //console.log(body)
    // const result = await post_review(body,token,schoolID)
    // console.log(result)
    Swal.fire({
      title: 'คุณต้องการยืนยันการรีวิวหรือไม่',
      showConfirmButton: true,
      confirmButtonColor: "#0047a3",
      confirmButtonText: 'ยืนยัน',

      showCancelButton: true,
      cancelButtonText: "cancel",
      cancelButtonColor: "#d93333",

      showLoaderOnConfirm: true,
      preConfirm: () => {
        return post_review(body, token, schoolID)
      },
      allowOutsideClick: false

    }).then((result) => {
      if (result.isConfirmed) {
        //console.log(result)
        const result_update = result.value === "true" ? true : false
        if (result_update) {
          Swal.fire({
            icon: 'success',
            title: 'ทำการรีวิวสำเร็จ',
            showConfirmButton: true,
            confirmButtonColor: "#0047a3"
          }).then(() => {
            // router.reload()
          })
        }else {
          Swal.fire({
            icon: 'error',
            title: 'ทำการรีวิวไม่สำเร็จ กรุณาลองใหม่',
            showConfirmButton: true,
            confirmButtonColor: "#00a30b"
          }).then(() => {
            // router.reload()
          })
        }

      }
    })
  }

  async function editReview(reviewID) {
    const status_satisfied = like ? "พอใจ" : "ไม่พอใจ"
    if (textReview.current.value === "") {
      Swal.fire({
        icon: 'warning',
        title: 'โปรดกรอกคำรีวิว !',
        showConfirmButton: true,
        confirmButtonColor: "#f7a518",
        confirmButtonText: 'ok',
      })
      return
    }
    const body = {
      "reviewID": reviewID,
      "textReview": textReview.current.value,
      "satisfiedLevel": status_satisfied
    }
    //console.log(body)
    // const result = await update_own_review(body,token,schoolID)
    // console.log(result)

    Swal.fire({
      title: 'คุณต้องการแก้ไขการรีวิวหรือไม่',
      showConfirmButton: true,
      confirmButtonColor: "#0047a3",
      confirmButtonText: 'ยืนยัน',

      showCancelButton: true,
      cancelButtonText: "cancel",
      cancelButtonColor: "#d93333",

      showLoaderOnConfirm: true,
      preConfirm: () => {
        return update_own_review(body, token, schoolID)
      },
      allowOutsideClick: false

    }).then((result) => {
      if (result.isConfirmed) {
        console.log(result)
        const result_update = result.value === "true" ? true : false
        if (result_update) {
          Swal.fire({
            icon: 'success',
            title: 'แก้ไขรีวิวสำเร็จ',
            showConfirmButton: true,
            confirmButtonColor: "#0047a3"
          }).then(() => {
            // router.reload()
          })
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'แก้ไขรีวิวไม่สำเร็จ กรุณาลองใหม่',
            showConfirmButton: true,
            confirmButtonColor: "#00a30b"
          }).then(() => {
            // router.reload()
          })
        }

      }
    })
  }

  function plateAddReview(reviewExist,status) {
    let tmp
    if (status){
        tmp = (
            <div>
                <textarea className="form-control" rows={3} cols={3} ref={textReview} defaultValue={reviewExist.textReview}/>
            <button className="btn mt-2" style={{ backgroundColor: "#004d99", color: "#fff" }} onClick={() => editReview(reviewExist._id)} data-bs-dismiss="modal">แก้ไขรีวิว</button>
            </div>
        )
    }else{
        tmp = (
            <div>
                <textarea className="form-control" rows={3} cols={3} ref={textReview} />
            <button className="btn mt-2" style={{ backgroundColor: "#11620e", color: "#fff" }} onClick={postReview} data-bs-dismiss="modal">เขียนรีวิว</button>
            </div>
        )
    }
    setAddReview(tmp)
    
    
  }
  function clickModal(item, schoolID, nowSchoolYear, ev) {
    ev.preventDefault()
    console.log(item)

    setReloadTable(true)
    clubName.current.innerText = "รีวิว " + item.clubName

    get_review_year(item.groupID, token, schoolID).then((result) => {
      if (result) {
        const body = {
          clubID: item._id,
          schoolYear: result.data[0] // res.data.length - 1 will use
        };

        
        nowChooseYear = result.data[0]  // res.data.length - 1 will use
        dropdownYear(item._id, result.data)
        setTempNowChooseYear(nowChooseYear)
        teacherName(item._id, result.data[0], token, schoolID) 

        get_own_review(item._id, token, schoolID).then((result) => { 
            console.log(result.data)
            
            if (!result){
              changeIcon(ev, true)
              get_review(body, token, schoolID).then((res) => {
                if (res) {
                  setReloadTable(false)
                  plateAddReview(false, false)
                  patternReview(res.data.docs)
                  setNotShowAlert(res.data.totalDocs)
                  const paginate_tmp = generate(res.data)
                  showPaginate(paginate_tmp)
                }
              });
            }else{
              const pojai = result.data.satisfiedLevel == "พอใจ" ? true : false
              changeIcon(ev, pojai)
              get_review(body, token, schoolID).then((res) => {
                if (res) {
                  setReloadTable(false)
                  plateAddReview(result.data,true)
                  patternReview(res.data.docs)
                  setNotShowAlert(res.data.totalDocs)
                  const paginate_tmp = generate(res.data)
                  showPaginate(paginate_tmp)
                }
              });
          }
        })
        }
    });
  }

  function clickDropdown(clubID, year, years, ev) {
    ev.preventDefault()

    nowChooseYear = year
    setTempNowChooseYear(nowChooseYear)
    dropdownYear(clubID, years)
    const body = {
      clubID: clubID,
      schoolYear: year
    };
    setReloadTable(true)
    teacherName(clubID, year, token, schoolID) 
    get_review(body, token, schoolID).then((res) => {
      if (res) {
        setReloadTable(false)
        patternReview(res.data.docs)
        setNotShowAlert(res.data.totalDocs)
        const paginate_tmp = generate(res.data)
        showPaginate(paginate_tmp)
      }
    }
    )
  }

  function patternReview(data) {
    const avatar = ["/avt1.svg", "/avt2.svg", "/avt3.svg", "/avt4.svg", "/avt5.svg"]
    const review = data.map((e, i) => {
      return (
        <div className="p-1" key={i}>
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <img src={`${avatar[i]}`} width={50} className="rounded-circle" />
                    <span className="align-self-center ms-2 me-2">Anonymous</span>
                </div>
                <span className="align-self-center">{e.satisfiedLevel == 'พอใจ' ? isGood : notGood}</span>
            </div>
            <textarea className="form-control mt-1" rows={2} cols={3} value={e.textReview} disabled />
        </div>
      )
    })
    setReview(review)
  }

  function dropdownYear(clubID, arr_years) {
    // console.log("dropdowmYear =", clubID, arr_years, nowChooseYear)
    const tmp = (
      <div className="d-flex  justify-content-center align-items-center">
        <div>ปีการศึกษา</div>
        <span>
          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {nowChooseYear}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {arr_years.map((year, i) => {
                return (
                  <li key={i}>
                    <a className="dropdown-item" href="#" onClick={(e) => { clickDropdown(clubID, year, arr_years, e) }}>
                        {year}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </span>
      </div>
    )
    setClubYears(tmp)
  }

  function generate(result) {
    console.log(result)
    const paginate_tmp = []
    if (result.totalPages <= 6) {
      for (let i = 1; i <= result.totalPages; i++) {
        if (parseInt(result.page) === i) {
          paginate_tmp.push(<button className='page-link disabled bg-primary bg-opacity-75 text-white'>{parseInt(result.page)}</button>)
        } else {
          paginate_tmp.push(<button className='page-link' onClick={() => clickPage((i))}>{i}</button>)
        }
      }
    } else {
      if (result.hasPrevPage) {
        paginate_tmp.push(<button className='page-link' onClick={() => clickPage(1)}><i className="fa-solid fa-angles-left"></i></button>)
        paginate_tmp.push(<button className='page-link' onClick={() => clickPage((parseInt(result.page) - 1))}><i className="fa-solid fa-angle-left"></i></button>)
      } else {
        paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angles-left"></i></button>)
        paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angle-left"></i></button>)
      }

      if (parseInt(result.page) > 3) {
        paginate_tmp.push(<button className='page-link' onClick={() => clickPage((1))}>1</button>)
        paginate_tmp.push(<button className='page-link disabled'>...</button>)
      }

      paginate_tmp.push(<button className='page-link bg-primary bg-opacity-75 text-white disabled'>{parseInt(result.page)}</button>)
      for (let i = 1; i <= 2; i++) {
        if (parseInt(result.page) + i < result.totalPages) {
          paginate_tmp.push(<button className='page-link' onClick={() => clickPage((parseInt(result.page)) + i)}>{parseInt(result.page) + i}</button>)
        }
      }

      if (parseInt(result.page) + 3 <= result.totalPages) {
        paginate_tmp.push(<button className='page-link disabled'>...</button>)
      }

      if (parseInt(result.page) !== result.totalPages) {
        paginate_tmp.push(<button className='page-link' onClick={() => clickPage((result.totalPages))}>{result.totalPages}</button>)
      }

      if (result.hasNextPage) {
        paginate_tmp.push(<button className='page-link' onClick={() => clickPage((parseInt(result.page) + 1))}><i className="fa-solid fa-angle-right"></i></button>)
        paginate_tmp.push(<button className='page-link' onClick={() => clickPage(result.totalPages)}><i className="fa-solid fa-angles-right"></i></button>)
      } else {
        paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angle-right"></i></button>)
        paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angles-right"></i></button>)
      }
    }
    return paginate_tmp
  }

  async function clickPage(page) {
    const body = {
      "page": page,
      "clubID": item._id,
      "schoolYear": nowChooseYear
    }

    setReloadTable(true)
    const result = await get_review(body, token, schoolID)
    setReloadTable(false)

    if (!result) {
      setDisplayError(true)
    } else {
      setReloadTable(false)
      patternReview(res.data.docs)
      setNotShowAlert(res.data.totalDocs)
      const paginate_tmp = generate(res.data)
      showPaginate(paginate_tmp)
    }
  }

  function showPaginate(paginate) {
    const template = (
      <ul className='pagination justify-content-center mt-2'>
        {paginate.map((item, index) => {
          return (
            <li key={index} className="page-item">
              {item}
            </li>
          )
        })}
      </ul>
    )
    setPaginate(template)
  }

  return (
    <>
      <style jsx>{`
            .review_btn{
              border:none;
              background-color:#d80ebd;
              color:white;
              border-radius:4px;
            }
      `}</style>
      <div className="modal" id={item.clubName}>
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className=" modal-header">
              <div className="modal-title w-100">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex justify-content-start flex-column">
                    <p className="text-start" ref={clubName}></p>
                    <p className="text-start">ผู้สอน: {teacher}</p>
                  </div>
                  <div>{clubYears}</div>
                </div>
              </div>
              <div>
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
            </div>

            <div className="modal-body">
              {/* {tempNowChooseYear === item.schoolYear ? alert : console.log(tempNowChooseYear,item.schoolYear) } */}
              {reloadTable ? null :
                tempNowChooseYear === item.schoolYear ? icon : null }
              {reloadTable ? null :
                tempNowChooseYear === item.schoolYear ? addReview : null }
              {reloadTable ? reload : notShowAlert ? review : alert}
              {reloadTable ? null : notShowAlert ? paginate : null}
            </div>
          </div>
        </div>
      </div>

      <button
        className="btn review_btn btn-sm"
        data-bs-toggle="modal"
        data-bs-target={`#${item.clubName}`}
        onClick={(ev) => clickModal(item, schoolID, nowSchoolYear, ev)}
      >รีวิว</button>
    </>
  );
}