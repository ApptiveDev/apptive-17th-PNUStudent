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

    //testMode vars
    const testMode = true;
    //testMode vars

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
                    <div className="PetitionBodyPostDiv">
                        <div className="PetitionBodyPostText" style={{"flex":"0.75"}}>
                            번호
                        </div>
                        <div className="PetitionBodyPostText" style={{"flex":"3"}}>
                            제목
                        </div>
                        <div className="PetitionBodyPostText" style={locate.pathname.includes("/Inquiry")?{"flex":"0"}:{"flex":"2"}}>
                            {locate.pathname.includes("/Survey") ? "참여" : (locate.pathname.includes("/Petition") ? "동의" : "")}
                        </div>
                    </div>
                {postList}
            </div>

            <div className="PetitionFooterTopDiv">
                <button onClick={onClickPost}>글쓰기</button>
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

    function onClickPost()
    {
        if(localStorage.getItem("AccessKey"))
            nav('/'+locate.pathname.split('/')[1] + "/Post")
        else
            alert("로그인이 필요한 기능입니다.")
    }

    function getPostsInPage()
    {
        //testMode
        if(testMode && locate.pathname.includes("/Survey"))
        {
            var data = page == 1  ?[
                        {pk:1,title:"테스트 게시글 1", participates : 10,total_agrees:5,hits : 100},
                        {pk:2,title:"테스트 게시글 2", participates : 10,total_agrees:5,hits : 100},
                        {pk:3,title:"테스트 게시글 3", participates : 10,total_agrees:5,hits : 100}
                        ]:[]

            var result = []
                for(let i = 0; i<data.length;i++)
                {
                    result[i] = (
                        <div key={i} className="PetitionBodyPostDiv" onClick={()=>nav((locate.pathname.includes("/Survey") ? "/SurveyDetail": ("/PetitionDetail" + '/'+locate.pathname.split('/')[1])) + "/" +data[i].pk)}>
                            <div className="PetitionBodyPostText" style={{"flex":"0.75"}}>
                                {(page-1)*10 + i + 1}
                            </div>
                            <div className="PetitionBodyPostText" style={locate.pathname.includes("/Inquiry")?{"flex":"2"}:{"flex":"3"}}>
                                {data[i].title}
                            </div>
                            <div className="PetitionBodyPostText" style={locate.pathname.includes("/Inquiry")?{"flex":"0"}:{"flex":"2"}}>
                                {locate.pathname.includes("/Survey") ? data[i].participates : (locate.pathname.includes("/Petition") ? data[i].total_agrees: data[i].hits)}
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
                return;
        }
        //testMode


        requestGet((locate.pathname.includes("/Survey") ? "/surveys" : (locate.pathname.includes("/Petition") ? "/petitions" : "/inquiries/main") ),{'page':page}).then(
            (data)=>
            {
                var result = []
                for(let i = 0; i<data.length;i++)
                {
                    result[i] = (
                        <div key={i} className="PetitionBodyPostDiv" onClick={()=>nav((locate.pathname.includes("/Survey") ? "/SurveyDetail": ("/PetitionDetail" + '/'+locate.pathname.split('/')[1])) + "/" +data[i].pk)}>
                            <div className="PetitionBodyPostText" style={{"flex":"0.75"}}>
                                {(page-1)*10 + i + 1}
                            </div>
                            <div className="PetitionBodyPostText" style={{"flex":"3"}}>
                                {data[i].title}
                            </div>
                            <div className="PetitionBodyPostText" style={locate.pathname.includes("/Inquiry")?{"flex":"0"}:{"flex":"2"}}>
                                {locate.pathname.includes("/Survey") ? data[i].participates : (locate.pathname.includes("/Petition") ? data[i].total_agrees: "")}
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