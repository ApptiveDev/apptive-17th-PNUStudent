import { useState } from "react";
import { useRef } from "react";
import { CheckBox } from "react-native-web";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/SurveyPostPage.css"
import { requestPostWithAccess } from "../requests/requests";

function SurveyPostPage()
{
    const nav = useNavigate();
    const locate = useLocation();
    const [questions,setQuestions] = useState([]);

    const [isPopUp, setIsPopUp] = useState(false);
    const [isSelect , setIsSelect] = useState(true);
    const [isModified, setIsModified] = useState(-1);

    const [title,setTitle] = useState("")
    const [necessary,setNecessary] = useState(false)
    const [duplicate,setDuplicate] = useState(false)
    const [numSelect,setNumSelect] = useState("0");

    const [questionCode,setQuestionCode] = useState(0);

    let mx,my = [0,0]

    return (
        <div className="DefaultPage" onMouseMove={e=>{mx=e.clientX;my=e.clientY}}>

            {isPopUp ? (<PopUp/>) : null}

            <div className="DummyHeader"/>
            <div className="SurveyPostHeader">설문조사</div>

            <div className="SurveyPostTopDiv">
                <div className="SurveyPostTopText">제목</div>
                <input className="SurveyPostTopTitle"/>
                <div className="SurveyPostTopText">머리글</div>
                <textarea className="SurveyPostTopContent"/>
            </div>
            
            <div className="SurveyPostBodyDiv">
                {getJSXQuestions(questions)}
                <div className="SurveyPostBodyBottomDiv">
                    <button className="SurveyPostBodyBottomButton" onClick={()=>OpenPopUp(true)}>+선다형</button>
                    <button className="SurveyPostBodyBottomButton" onClick={()=>OpenPopUp(false)}>+서술형</button>
                </div>
            </div>

            <button className="SurveyPostButton">등록하기</button>

        </div>
    )

    function PopUp()
    {
        return (
            <div className="SurveyPostPopUpBack" onClick={()=>setIsPopUp(false)}>
                <div className="SurveyPostPopup" onClick={(e)=>e.stopPropagation()}>
                    <div className="SurveyPostElement">
                        <div>질문</div>
                        <input defaultValue={title} onBlur={(e)=>setTitle(e.target.value)} onChange={()=>false}/>
                    </div>
                    <div className="SurveyPostElement">
                        <div>필수 항목</div>
                        <input checked={necessary} onChange={(e)=>setNecessary(e.target.checked)} type="checkbox"/>
                    </div>
                    {
                        isSelect?
                    [
                    (
                    <div key={0} className="SurveyPostElement">
                        <div>중복 허용</div>
                        <input checked={duplicate} onChange={(e)=>setDuplicate(e.target.checked)} type="checkbox"/>
                    </div>
                    ),
                    (
                    <div key={1} className="SurveyPostElement" >
                        <div>선지수</div>
                        <input defaultValue={numSelect} onBlur={(e)=>setNumSelect(e.target.value)} onChange={()=>false} type="number" style={{width:"50px",flex:"none"}}/>
                    </div>
                    )
                    ]:null
                    }
                    <div style={{display:"flex",marginTop:"auto"}}>
                        <button className="SurveyPostPopUpButton" onClick={addQuestions}>등록</button>
                    </div>
                </div>
            </div>
            )
    }

    function OpenPopUp(isS)
    {
        setTitle("")
        setNecessary(false)
        setDuplicate(false)
        setNumSelect("0")
        setIsModified(-1)
        setIsSelect(isS)
        setIsPopUp(true)
    }

    function getJSXQuestions(questions)
    {
        var result = []
        for(let i = 0; i<questions.length;i++)
        {
            if(questions[i].type != "essay")
            {
                var selectDivs = []

                for(let j = 0; j < questions[i].selects.length;j++)
                    selectDivs[j] = 
                    (
                        <div className="SurveyPostQuestionSelect" key={j}>
                            <div>({j+1})</div>
                            <input value={questions[i].selects[j]} onChange={(e)=>updateQuestions(e.target.value,i,false,j)}/>
                            {
                                j == questions[i].selects.length - 1 ?
                                [(<button className="SurveyPostQuestionModifiedButton" key={0} onClick={()=>openModifiedPopUp(true,questions[i].code)}>수정</button>),(<button className="SurveyPostQuestionDeleteButton"  key={1} onClick={()=>deleteQuestion(questions[i].code)}>삭제</button>)]
                                : null
                            }
                        </div>
                    )

                result[i] = (
                <div className="SurveyPostQuestionDiv" key={i}>
                    <div  className="SurveyPostQuestionTitle">
                        <div>{i+1}.</div>
                        <input value={questions[i].question} onChange={(e)=>updateQuestions(e.target.value,i,true)}/>
                    </div>
                    {selectDivs}
                </div>)
            }
            else
            {
                result[i] = (
                    <div className="SurveyPostQuestionDiv" key={i}>
                        <div  className="SurveyPostQuestionTitle">
                            <div>{i+1}.</div>
                            <input value={questions[i].question} onChange={(e)=>updateQuestions(e.target.value,i,true)}/>
                        </div>

                        <div className="SurveyPostQuestionSelect">
                            <button className="SurveyPostQuestionModifiedButton" onClick={()=>openModifiedPopUp(false,questions[i].code)}>수정</button>
                            <button className="SurveyPostQuestionDeleteButton" onClick={()=>deleteQuestion(questions[i].code)}>삭제</button>
                        </div>             
                    </div>)
            }
        }

        return result
    }

    function addQuestions()
    {
        if(title == "" || (isSelect && parseInt(numSelect) <= 0))
            return

        var newQuestions = [...questions]

        if(isModified == -1)
        {

            if(isSelect)
            {
                newQuestions.push
                (
                    {
                        type: duplicate ? "duplicate" : "single",
                        necessary : necessary,
                        question : title,
                        selects : Array(parseInt(numSelect)).fill(""),
                        code : questionCode
                    }
                )
            }
            else
            {
                newQuestions.push
                (
                    {
                        type: "essay",
                        necessary : necessary,
                        question : title,
                        code : questionCode
                    }
                )
            }
            setQuestionCode(questionCode + 1)
        }
        else
        {
            let index = questions.findIndex(i=>i.code == isModified)

            if(isSelect)
            {
                newQuestions[index].selects.length = parseInt(numSelect)

                newQuestions[index] =
                    {
                        type: duplicate ? "duplicate" : "single",
                        necessary : necessary,
                        question : title,
                        selects : newQuestions[index].selects.map((item)=>item !== undefined? item : ""),
                        code : isModified
                    }
            }
            else
            {
                newQuestions[index] =
                    {
                        type: "essay",
                        necessary : necessary,
                        question : title,
                        code : isModified
                    }
            }

        }



        setQuestions(newQuestions)
        setIsPopUp(false)

    }

    function deleteQuestion(code)
    {
        var newQuestions = [...questions]
        newQuestions = newQuestions.filter((item)=>item.code != code)
        setQuestions(newQuestions)
    }
    function openModifiedPopUp(isS, code)
    {
        let q = questions.find(i=>i.code == code)
        setTitle(q.question)
        setNecessary(q.necessary)
        if(isS)
        {
            setDuplicate(q.type == "duplicate")
            setNumSelect(q.selects.length)
        }
        setIsModified(code)
        setIsSelect(isS)
        setIsPopUp(true)
    }

    function updateQuestions(value, Index,isTitle,SelectIndex)
    {
        var newQuestions = [...questions]
        if(isTitle)
            newQuestions[Index].question = value
        else
            newQuestions[Index].selects[SelectIndex] = value
        setQuestions(newQuestions)    
    }

}

export default SurveyPostPage;