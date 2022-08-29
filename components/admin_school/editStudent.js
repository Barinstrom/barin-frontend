import React from "react"

export default function EditStudent(){
    const data = [
        {student_name:"toto",role:"1",school_name:"horwang"},
        {student_name:"tata",role:"2",school_name:"kaset"},
        {student_name:"tete",role:"2",school_name:"jula"},
        {student_name:"bundit",role:"2",school_name:"tepsirin"},
        {student_name:"jitat",role:"3",school_name:"prachanivet"},
        {student_name:"kana",role:"3",school_name:"sangsom"},
    ]
    
    return (
        <main>
            <table className="table table-hover table-bordered table-striped text-center">
                <thead className="table-dark">
                    <tr>
                        <th>ชื่อนักเรียน</th>
                        <th>ชั้น</th>
                        <th>โรงเรียน</th>
                        <th>ข้อมูลต่างๆ</th>
                    </tr>
                </thead>
                <tbody>
                    
                        {data.map((e,i) => {
                            return (
                                <tr key={i}>
                                    <td>{e.student_name}</td>
                                    <td>{e.role}</td>
                                    <td>{e.school_name}</td>
                                    <td><button className="btn btn-info">รายละเอียด</button></td>
                                </tr>
                            )
                        })}
                    
                </tbody>
            </table>
        </main>
    )
}