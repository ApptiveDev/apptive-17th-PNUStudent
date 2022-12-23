import { useLocation, useNavigate, useParams } from 'react-router-dom';
import "../css/AnnouncePage.css"
import test from "../img/test.png"
import searchImg from "../img/searchButton.png"
import { useEffect, useState } from 'react';
import { requestGet } from '../requests/requests';

function AnnouncePage()
{
    const {page} = useParams();
    const nav = useNavigate();
    const locate = useLocation();
    const [postList,setPostList] = useState([])
    const [pageList,setPageList] = useState([])

    useEffect(onLoadPage,[locate.pathname])

    return (
        <div className='AnnouncePage'>

            <div className='DummyHeader'/>

            <div className='AnnounceHeader'>
                <div className='AnnounceHeaderText' style={locate.pathname.includes("/Announce") ? {"textDecoration": "underline"}:{}} onClick={()=>nav("/Announce")}>공지사항</div>
                <div className='AnnounceHeaderText' style={locate.pathname.includes("/Benefit") ? {"textDecoration": "underline"}:{}} onClick={()=>nav("/Benefit")}>제휴혜택</div>
                <input className='AnnounceHeaderInput'/>
                <img className='AnnounceHeaderButton' src={searchImg}/>
            </div>

            <div className='AnnounceBody'>
                {postList}
            </div>

            <div className='AnnounceFooter'>
                <p style={{'marginRight':"auto", 'marginLeft':"5vw"}} onClick={()=>movePage(-1)}>&lt;&nbsp;</p>
                    {pageList}
                <p style={{'marginLeft':"auto", 'marginRight':"5vw"}} onClick={()=>movePage(1)}>&gt;</p>
            </div>
            
        </div>
    )
    
    function onLoadPage()
    {
        setPostList([])
        setPageList([])
        makeBodyPosts()
        makeFooterNumbers()
    }

    function makeBodyPosts()
    {
        requestGet("/announces",{"page":page}).then(
            (data)=>{
                let result = []

                for(let i = 0; i<data.length;i++)
                    result[i] = 
                    (<div key={i} className='AnnounceBodyPost' onClick={()=>nav("/AnnounceDetail/" + locate.pathname.split('/')[1] + "/" +`${data[i].pk}`)}>
                        <img className='AnnouncePostImg' src={data[i].photos.length === 0 ? test:data[i].photos[0]}/>
                        <div className='AnnouncePostFooter'>
                            <div className='AnnouncePostTitle'>{data[i].is_important ? "[중요]":""}{data[i].title}</div>
                            <div className='AnnouncePostDay'>{data[i].writer}</div>
                        </div>
                    </div>) 

                setPostList(result)  

                let result2 = []
                let startI = parseInt((page-1)/5) * 5 + 1

                for(let i = startI; i<startI+5;i++)
                    result2[i] = (<p key={i} style={i==page ? {"fontWeight":"500",'color':'black'}:{}} onClick={()=>nav('/'+locate.pathname.split('/')[1]+'/'+String(i))}>&nbsp;&nbsp;&nbsp;{i}&nbsp;&nbsp;&nbsp;</p>) 

                setPageList(result2)   
            }
        ).catch((err)=>console.log(err))
    }

    function makeFooterNumbers()
    {
        var result = []
        for(let i = 1; i<=5;i++)
            result[i] = (<p key={i}>&nbsp;&nbsp;&nbsp;{i}&nbsp;&nbsp;&nbsp;</p>) 
        setPageList(result)    
    }

    function movePage(i)
    {
        if(i === -1 && page === '1')
            return
        nav('/'+locate.pathname.split('/')[1]+'/'+String(parseInt(page) + i))           
    }
}



export default AnnouncePage;