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

            <input ref={titleRef}/>

            <textarea ref={articleRef} style={{"height":"50vh","margin":"10px 0 10px 0"}}/>

            <input type="file"/>

            <button onClick={fetchPost}>글쓰기</button>

        </div>
    )

    function fetchPost()
    {
        requestPostWithAccess(locate.pathname.includes("Petition") ? "/petitions": "/inquiries",
        {
            title : titleRef.current.value,
            content : articleRef.current.value
        }).then(
            (data)=>
            {
                alert(data.detail)
                nav("/" + locate.pathname.split('/')[1] + "/1")
            }
        ).catch(
            (err)=>alert(err)
        )
    }
}

export default PetitionPostPage;