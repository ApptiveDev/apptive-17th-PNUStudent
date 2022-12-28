import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../css/SurveyDetailPage.css"
import MenuDownImg from "../img/header/navMenuDown.png"

function SurveyDetailPage()
{
    const {index} = useParams();
    const nav = useNavigate();
    const locate = useLocation();

    const [headerStringList,setHeaderStringList] = useState(['제목','yyyy-mm-dd','작성자','0','0']);
    const [bodyElementList,setBodyElementList] = useState({type : 'end', questions : []})

    useEffect(onLoadPage,[locate.pathname])

    return (
        <div className="DefaultPage">
            <div className="DummyHeader"/>
                
            <HeaderJSX stringList={headerStringList}/>

            <BodyJSX elementList={bodyElementList}/>

            {
            bodyElementList.type != 'submit' ?    
            (
            <div className='PostNavDiv'>

                <div className='PostNavList' onClick={()=>movePage(-1)}>
                    <img src={MenuDownImg} style={{"transform":"rotate(180deg)"}} className='PostNavImg'/>
                    <div className='PostNavText1'>이전 글</div>
                    <div className='PostNavText2'>내용적는 칸</div>
                </div>

                <div className='PostNavList' onClick={()=>movePage(1)}>
                    <img src={MenuDownImg} className='PostNavImg'/>
                    <div className='PostNavText1'>다음 글</div>
                    <div className='PostNavText2'>내용적는 칸</div>
                </div>

            </div>
            ):''
            }
            

        </div>
    )

    function onLoadPage()
    {
        setBodyElementList({type : 'proceed', isSubmitted:false,article:"설문조사테스트입니다."})
    }

    function movePage(i)
    {
        if(i === -1 && index === '1')
            return
        nav("/SurveyDetail/" + `${parseInt(index) + i}`)
        
    }

    function HeaderJSX({stringList})
    {
        return(
            <div className="SurveyHeader">
                <div className="SurveyHeaderElement">{stringList[0]}</div>
                <div className="SurveyHeaderElement">{stringList[1]}</div>
                <div className="SurveyHeaderElement">작성자 : {stringList[2]} 조회수 : {stringList[3]} 참여자 : {stringList[4]}</div>
            </div>
        )
    }

    function BodyJSX({elementList})
    {
        if(elementList.type == 'proceed')
            return(
                <div className="SurveyBody">
                    <div className="SurveyArticle">{elementList.article}</div>
                    <button className="SurveyToSubmitButton" onClick={elementList.isSubmitted?()=>'':toSubmit}>{elementList.isSubmitted ? '참여완료':'참여하기'}</button>
                </div>
            )
        else if(elementList.type == 'end')    
            return(
                <div className="SurveyBody">
                    {elementList.type}
                </div>
            )
        else if(elementList.type == 'submit')    
            return(
                <div className="SurveyBody">
                    {elementList.type}
                </div>
            )    
    }

    function toSubmit()
    {
        var tmpList = {...bodyElementList}
        tmpList.type = 'submit'
        setBodyElementList(tmpList)
    }
}

export default SurveyDetailPage;
