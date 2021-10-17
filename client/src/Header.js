import React, { useEffect, useState } from 'react'
import './Header.css'


function Header() {
    const [url,setUrl]=useState('')
    useEffect(() => {
        setUrl(window.location.href.split('/')[window.location.href.split('/').length-1])

    }, [])
    const redirect=(redirectTo)=>{
        console.log(redirectTo)
        window.location.assign("/"+redirectTo);
    }
    return (
        <div className="main">
            {/* <div className="header"> */}
                <h1>Your Voter Booth</h1>
                <div className="buttons">
                    <p className={url=="register"?'active':'unactive'} onClick={()=>redirect('register')} >Register</p>
                    <p className={url=="candidate"?'active':'unactive'} onClick={()=>redirect('candidate')}>Candidate</p>
                    <p className={url=="vote" || url==""?'active':'unactive'} onClick={()=>redirect('vote')}>VOTE</p>
                </div>
            {/* </div> */}
        </div>
    )
}

export default Header
