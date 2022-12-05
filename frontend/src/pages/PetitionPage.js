import "../css/PetitionPage.css"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import searchImg from "../img/searchButton.png"
import { useEffect, useState } from "react";
import { requestGet } from "../requests/requests";

function PetitionPage()
{
    const {page} = useParams();
    const nav = useNavigate();
    const locate = useLocation();
    const [postList,setPostList] = useState([]);
    const [pageList,setPageList] = useState([]);

    useEffect(onLoadPage,[locate.pathname])

    return(
        <div className="DefaultPage">

            <div className="DummyHeader"/>

            <div className="PetitionHeaderDiv">
                <div className="PetitionHeaderText" style={locate.pathname.includes("/Survey") ? {"textDecoration": "underline"}:{}} onClick={()=>nav("/Survey/1")}>설문조사</div>
                <div className="PetitionHeaderText" style={locate.pathname.includes("/Petition") ? {"textDecoration": "underline"}:{}} onClick={()=>nav("/Petition/1")}>청원 게시판</div>
                <div className="PetitionHeaderText" style={locate.pathname.includes("/Inquiry") ? {"textDecoration": "underline"}:{}} onClick={()=>nav("/Inquiry/1")}>문의 게시판</div>
            </div>

            <div className="PetitionUnderHeaderDiv">
                <img className="PetitionUnderHeaderImg" src={searchImg}/>
                <input className="PetitionUnderHeaderInput"/>
            </div>

            <div className="PetitionBody">
                {postList}
            </div>

            <div className="PetitionFooterTopDiv">
                <button className="PetitionFooterTopButton" onClick={()=>nav('/'+locate.pathname.split('/')[1] + "/Post")}>글쓰기</button>
            </div>

            <div className="PetitionFooter">
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
        getPostsInPage()
    }

    function getPostsInPage()
    {
        requestGet((locate.pathname.includes("/Survey") ? "/surveys" : (locate.pathname.includes("/Petition") ? "/petitions" : "/inquiries") ),{'page':page}).then(
            (data)=>
            {
                var result = []
                for(let i = 0; i<data.length;i++)
                {
                    result[i] = (
                        <div key={i} className="PetitionBodyPostDiv" onClick={()=>nav("/PetitionDetail" + '/'+locate.pathname.split('/')[1] + "/" +data[i].pk)}>
                            <div className="PetitionBodyPostText">
                                {data[i].title}
                            </div>
                            <div className="PetitionBodyPostText">
                                {data[i].writer}
                            </div>
                        </div>
                    )
                }

                setPostList(result)

                var result2 = []
                let startI = parseInt((page-1)/5) * 5 + 1

                for(let i = startI; i<startI+5;i++)
                    result2[i] = (<p key={i} style={i==page ? {"fontWeight":"500",'color':'black'}:{}} onClick={()=>nav('/'+locate.pathname.split('/')[1]+'/'+String(i))}>&nbsp;&nbsp;&nbsp;{i}&nbsp;&nbsp;&nbsp;</p>) 

                setPageList(result2)    
            }
        ).catch(
            (err)=>console.log(err)
        )


        
    }

    function movePage(i)
    {
        if(i === -1 && page === '1')
            return
        nav('/'+locate.pathname.split('/')[1]+'/'+String(parseInt(page) + i))           
    }
}

export default PetitionPage;