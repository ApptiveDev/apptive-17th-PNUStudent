import "../css/PostSuccessPage.css"

import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useState } from 'react';

function PostSuccessPage()
{
    const {mode} = useParams();
    const nav = useNavigate();
    return (
        <div className='DefaultPage'>
            <div className="DummyHeader"/>
            <div className="PostSuccessPageCenterDiv">
                <div className="PostSuccessPageText">{getText()}</div>
                <button className="PostSuccessPageButton" onClick={()=>nav(getPath())}>목록으로→</button>
            </div>   
        </div>
    )

    function getText()
    {
        if(mode == "Survey")
            return "설문 응답이 제출 완료되었습니다."
        else
            return "작성이 완료되었습니다."
    }

    function getPath()
    {
        if(mode == "Survey" || mode == "SurveyPost")
            return "/Survey/1"
        else if(mode == "Petition")
            return "/Petition/1"
        else
            return "/Inquiry/1"
    }

}




export default PostSuccessPage;