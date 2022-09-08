/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import ErrorPage from "next/error";

export default function Paginate({ school_data }) {

    const [data,setData] = useState([])
    const [paginate,setPaginate] = useState([])
    const search = useRef()

    function detailTest(item){
		console.log(item)
	}
	
	async function clickReset(ev){
        ev.preventDefault()
        window.localStorage.removeItem("search")
        search.current.value = ""
        
        try{
            const response = await fetch(`http://localhost:8000/paginate/db`,{
                method:"post",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"page":1})

            })
            const result = await response.json()
            //console.log(result)
            const paginate_tmp = generate(result)
            showData(result.docs)
            showPaginate(paginate_tmp)
        }catch(err){
            console.log(err.message)
        }
    }
    
    /* กรณี search ข้อมูลต่างๆ */
    async function clickAccept(ev){
        ev.preventDefault()
        window.localStorage.setItem("search",parseInt(search.current.value))
        
        const body = {
            "page":1,
            "info":window.localStorage.getItem("search")
        }
        
        try{
            const response = await fetch(`http://localhost:8000/paginate/db`,{
                method:"post",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(body)

            })
            const result = await response.json()
            //console.log(result)
            const paginate_tmp = generate(result)
            showData(result.docs)
            showPaginate(paginate_tmp)
        }catch(err){
            console.log(err.message)
        }
    }
    
    function changeDate(k){
        const t = new Date(Date.parse(k))
        const d = t.getDate() > 10 ? t.getDate(): '0'+t.getDate()
        const m = t.getMonth()+1 > 10 ? t.getMonth()+1: '0'+(t.getMonth()+1)
        return (
            <>
                {d}-{m}-{t.getFullYear()}
            </>
        )
    }

    function generate(result){
        const paginate_tmp = []
        
        if (result.prevPage){
            paginate_tmp.push(<button className='page-link' onClick={()=> clickPage((result.page-1))}>&laquo;</button>)    
        }else{
            paginate_tmp.push(<button className='page-link disabled'>&laquo;</button>)
        }
        
        paginate_tmp.push(<button className='page-link disabled'>{result.page}</button>)
        
        if (result.nextPage){
            paginate_tmp.push(<button className='page-link' onClick={()=> clickPage((result.page+1))}>&raquo;</button>)    
        }else{
            paginate_tmp.push(<button className='page-link disabled'>&raquo;</button>)
        }

        return paginate_tmp
    }

    
    async function clickPage(page){
        //console.log(window.localStorage.getItem("search"))
        const body = {
            "page":page,
            "info":window.localStorage.getItem("search")
        }
        
        try{
            const response = await fetch(`http://localhost:8000/paginate/db`,{
                method:"post",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(body)
            })
            
            const result = await response.json()
            const paginate_tmp = generate(result)
            //console.log(result)
            showData(result.docs)
            showPaginate(paginate_tmp)
        }catch(err){
            console.log(err.message)
        }
        
    }

    async function fetchData(){
        try{
            const response = await fetch(`http://localhost:8000/paginate/db`,{
                method:"post",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"page":1})
            })
            const result = await response.json()
            const paginate_tmp = generate(result)
            //console.log(result)
            showData(result.docs)
            showPaginate(paginate_tmp)
        }catch(err){
            console.log(err.message)
        }
    }
    
    function showData(result){
        const template = (
            <tbody>
                {result.map((item,index) => {
                    return (
                        <tr key={index}>
                            <td>{item.user}</td>
                            <td>{item.age}</td>
                            <td>{changeDate(item.birthday)}</td>
                            <td>{item.detail}</td>
                            <td><button className='btn btn-info' onClick={()=> detailTest(item)}>รายละเอียด</button></td>
                        </tr>
                    )
                })}
            </tbody>
        )
        setData(template)
    }

    function showPaginate(paginate){
        const template = (
            <ul className='pagination'>
                {paginate.map((item,index)=>{
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

    
    useEffect(()=>{
        window.localStorage.removeItem("search")
        fetchData()
    },[])

    
        if (!school_data.paymentStatus) {
			return <ErrorPage statusCode={404} />;
		}

    return (
        <section className='mt-3'>
            <div className='container p-3' style={{maxWidth:"1200px"}}>
                <div className='row'>
                    <div className='col-12'>
                        <form className='mb-3'>
                            <div className='input-group'>
                                <span className="input-group-text">ค้นหา</span>
                                <input type="text" className='form-control' ref={search}></input>
                                <button className='btn btn-success' onClick={(ev) => clickAccept(ev)}>ยืนยัน</button>
                                <button className='btn btn-danger' onClick={(ev) => clickReset(ev)}>รีเซต</button>
                            </div>
                        </form>
                        <table className='table table-bordered text-center'>
                            <thead className='table-dark'>
                                <tr>
                                    <th>user</th>
                                    <th>age</th>
                                    <th>birthday</th>
                                    <th>detail</th>
                                    <th>extra</th>
                                </tr>
                            </thead>
                            {data}
                        </table> 
                    </div>
                </div>
                {paginate}
            </div>
        </section>   
    )
}