import React from "react"

export default function Editcongregation(){
    const data = [
        {congre_name:"บอล",count_student:"23",congre_school:"tepsirin"},
        {congre_name:"บาส",count_student:"53",congre_school:"horwang"},
        {congre_name:"ปิงปอง",count_student:"13",congre_school:"horwang"},
        {congre_name:"เทนนิส",count_student:"45",congre_school:"kaset"},
        {congre_name:"แบต",count_student:"13",congre_school:"horwang"},
        {congre_name:"ว่ายน้ำ",count_student:"35",congre_school:"jula"},
    ]
    
    return (
        <main>
            <table className="table table-hover table-bordered table-striped text-center">
                <thead className="table-dark">
                    <tr>
                        <th>ชื่อชุมนุม</th>
                        <th>จำนวนนักเรียน</th>
                        <th>ของโรงเรียน</th>
                        <th>ข้อมูลต่างๆ</th>
                    </tr>
                </thead>
                <tbody>
                    
                        {data.map((e,i) => {
                            return (
                                <tr key={i}>
                                    <td>{e.congre_name}</td>
                                    <td>{e.count_student}</td>
                                    <td>{e.congre_school}</td>
                                    <td><button className="btn btn-danger">รายละเอียด</button></td>
                                </tr>
                            )
                        })}
                    
                </tbody>
            </table>
        </main>
    )
}