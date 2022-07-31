import React from 'react'
import { useRef } from 'react'

export default function Register() {
  const form = useRef()
  function submitForm(ev){
    /* ป้องกันกันส่งข้อมูลไป server ต้องเช็คข้อมูลก่อน ในที่นี้ใส่ไว้ก่อน */
    ev.preventDefault()
    const email = ev.target.elements[0]
    const fname = ev.target.elements[1]
    const sname = ev.target.elements[2]
    const school_name = ev.target.elements[3]
    const tel = ev.target.elements[4]
    const school_document = ev.target.elements[5]
    
    /* for loop เช็ค */
    /* for (let e=0 ; e<ev.target.elements.length ; e++){
      console.log(ev.target.elements[e])
    } */

    /* เช็คไฟล์ */
    console.log(school_document.files.length)
    console.log(school_document.files[0].name)
    console.log(school_document.files[0].size)
  }
  
  return (
    <div className='container p-3'>
      {/* หัวข้อ */}
      <h2 className='text-center mt-5'>แบบฟอร์มลงทะเบียน</h2>
      {/* ฟอร์ม */}
      <form className='row g-3' onSubmit={(ev) => submitForm(ev)} ref={form}>
        {/* อีเมลล์  */}
        <div className='col-lg-12'>
          <label className='form-label'>อีเมลล์</label>
          <input type="email" className='form-control'/>
        </div>
        {/* ชื่อ  */}
        <div className='col-lg-6'>
          <label className='form-label'>ชื่อ</label>
          <input type="text" className='form-control'/>
        </div>
        {/* นามสกุล */}
        <div className='col-lg-6'>
          <label className='form-label'>นามสกุล</label>
          <input type="text" className='form-control'/>
        </div>
        {/* ชื่อโรงเรียน  */}
        <div className='col-lg-12'>
          <label className='form-label'>ชื่อโรงเรียน</label>
          <input type="text" className='form-control'/>
        </div>
        {/* โทรศัพท์มือถือ */}
        <div className='col-lg-12'>
          <label className='form-label'>โทรศัพท์มือถือ</label>
          <input type="tel" className='form-control'/>
        </div>
        {/* เอกสารยืนยันโรงเรียน ใส่ multiple กรณีอัปโหลดได้หลายไฟล์*/}
        <div className='col-lg-12'>
          <label className='form-label'>เอกสารยืนยันโรงเรียน</label>
          <input type="file" className='form-control'multiple/>
        </div>
        {/* ปุ่มยืนยัน */}
        <div className='col-lg-12'>
          <button className='btn btn-warning'>ยืนยัน</button>
        </div>
      </form>
    </div>
  )
}
