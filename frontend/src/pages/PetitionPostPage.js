import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/PetitionPostPage.css"
import { requestPostWithAccess } from "../requests/requests";

function PetitionPostPage()
{
    const nav = useNavigate();
    const locate = useLocation();

    const titleRef = useRef();
    const articleRef = useRef();


    return (
        <div className="DefaultPage">
            <div className="DummyHeader"/>
            <div className="PetitionPostHeader">{locate.pathname.includes("/Petition")? "청원게시판":"문의게시판"}</div>
            
            <div className="PetitionPostTitleDiv">
                <p>제목</p>
                <input className="PetitionPostTitleInp" ref={titleRef}/>
            </div>

            <div className="PetitionPostContentDiv">
                <p>내용</p>
                <textarea ref={articleRef} className="PetitionPostContent"/>
            </div>

            <button className="PetitionPostButton" onClick={fetchPost}>등록하기</button>

        </div>
    )

    function fetchPost()
    {
        requestPostWithAccess(locate.pathname.includes("Petition") ? "/petitions/": "/inquiries/main/",
        {
            title : titleRef.current.value,
            is_important : false,
            content : articleRef.current.value
        }).then(
            (data)=>
            {
                if(data.detail)
                {
                    alert(data.detail)
                    return
                }
                nav("/PostSuccess/" + (locate.pathname.includes("/Petition") ? "Petition" : "Inquiry"))
            }
        ).catch(
            (err)=>alert(err)
        )
    }
}

export default PetitionPostPage;