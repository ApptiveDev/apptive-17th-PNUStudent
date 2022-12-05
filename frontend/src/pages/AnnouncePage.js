import { useLocation, useNavigate } from 'react-router-dom';
import "../css/AnnouncePage.css"
import test from "../img/test.png"
import searchImg from "../img/searchButton.png"
import { useState } from 'react';

function AnnouncePage()
{
    const nav = useNavigate();
    const locate = useLocation();
    const [postList,setPostList] = useState([])
    const [pageList,setPageList] = useState([])

    return (
        <div className='AnnouncePage' onLoad={onLoadPage}>

            <div className='DummyHeader'/>

            <div className='AnnounceHeader'>
                <div className='AnnounceHeaderText' style={locate.pathname === "/Announce" ? {"textDecoration": "underline"}:{}} onClick={()=>nav("/Announce")}>공지사항</div>
                <div className='AnnounceHeaderText' style={locate.pathname === "/Benefit" ? {"textDecoration": "underline"}:{}} onClick={()=>nav("/Benefit")}>제휴혜택</div>
                <input className='AnnounceHeaderInput'/>
                <img className='AnnounceHeaderButton' src={searchImg}/>
            </div>

            <div className='AnnounceBody'>
                {postList}
            </div>

            <div className='AnnounceFooter'>
                <p style={{'marginRight':"auto", 'marginLeft':"5vw"}}>&lt;&nbsp;</p>
                    {pageList}
                <p style={{'marginLeft':"auto", 'marginRight':"5vw"}}>&gt;</p>
            </div>
            
        </div>
    )
    
    function onLoadPage()
    {
        makeBodyPosts(0)
        makeFooterNumbers(0)
    }

    function makeBodyPosts(page)
    {
        var result = []

        for(let i = 0; i<10;i++)
            result[i] = 
            (<div key={i} className='AnnounceBodyPost' onClick={()=>nav("/AnnounceDetail" + locate.pathname + "/" +`${i}`)}>
                <img className='AnnouncePostImg' src={test}/>
                <div className='AnnouncePostFooter'>
                    <div className='AnnouncePostTitle'>제목</div>
                    <div className='AnnouncePostDay'>날짜</div>
                </div>
            </div>) 

        setPostList(result)  
    }

    function makeFooterNumbers(page)
    {
        var result = []
        for(let i = 1; i<=5;i++)
            result[i] = (<p key={i}>&nbsp;&nbsp;&nbsp;{i}&nbsp;&nbsp;&nbsp;</p>) 
        setPageList(result)    
    }
}



export default AnnouncePage;