import React from 'react'

export default function Star({TotalRating}) {
  return (
    <>
      <style jsx>{`
        .stargray {
          color: #e4e5e9;
        }
        .staryellow {
          color: #ffc107;
        }
      `}</style>
      {/* ทำดาวเหลือง */}
    {[...Array(TotalRating)].map((start, i) => {
        return (
            <i
            className="fa-solid fa-star fa-lg staryellow" key={i}></i>
            )
        }
        )
    }
    {/* ทำดาวเทาให้ครบ 5 */}
    {[...Array(5-TotalRating)].map((start, i) => {
        return (
            <i
            className="fa-solid fa-star fa-lg stargray" key={i}></i>
            )
        }
        )
    }
    </> 
  )
}
