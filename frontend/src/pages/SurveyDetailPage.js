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

    const [headerStringList,setHeaderStringList] = useState(['[진행중] 제목','YYYY-MM-DD','작성자','0','0']);
    const [bodyElementList,setBodyElementList] = useState({type : 'end', questions : []})

    var surveyResult = []

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

                <div className='PetitionPostNavList' onClick={()=>movePage(-1)}>
                    <img src={MenuDownImg} style={{"transform":"rotate(180deg)"}} className='PostNavImg'/>
                    <div className='PostNavText1'>이전 글</div>
                    <div className='PostNavText2'>내용적는 칸</div>
                </div>

                <div className='PetitionPostNavList' onClick={()=>movePage(1)}>
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
        setBodyElementList(
            {
                type : 'proceed', 

                isSubmitted:false,

                article:"설문조사테스트입니다.",

                questions: [
                    {
                        type : 'single',
                        question : '좋아하는 과일은?',
                        selects : [{pk:'1', content: '사과' ,numSelect:'100'} , {pk:'2', content: '딸기' ,numSelect:'200'}]
                    },
                    {
                        type : 'duplicate',
                        question : '좋아하는 색깔은?',
                        selects : [{pk:'3', content: '검은색' ,numSelect:'100'} , {pk:'4', content: '하얀색' ,numSelect:'200'},{pk:'5', content: '빨간색' ,numSelect:'200'}]
                    },
                    {
                        type : 'essay',
                        question : '좋아하는 음악은?'
                    }
                ]
            }
            )
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
                <div className="SurveyHeaderTitle">{stringList[0]}</div>
                <div className="SurveyHeaderElement">{stringList[1]}</div>
                <div className="SurveyHeaderElement">작성자 {stringList[2]}  조회수 {stringList[3]}  참여자 {stringList[4]}</div>
            </div>
        )
    }

    function BodyJSX({elementList})
    {
        surveyResult = []
        if(elementList.type == 'proceed')
            return(
                <div className="SurveyBody">
                    <div className="SurveyArticle">{elementList.article}</div>
                    <button className="SurveyToSubmitButton" onClick={elementList.isSubmitted?()=>'':toSubmit}>{elementList.isSubmitted ? '참여완료':'참여하기'}</button>
                </div>
            )
        else if(elementList.type == 'end')  
        {  
            var result = []
            let divKey = 0

            for(let i = 0; i< elementList.questions.length;i++)
            {
                if(elementList.questions[i].type != 'essay')
                {
                    result.push((<div key={divKey++} className="SurveyQuestion">{i+1}. {elementList.questions[i].question}</div>))
                    var totalSelect = 0;
                    elementList.questions[i].selects.forEach(element => totalSelect += parseInt(element.numSelect));

                    for(let j = 0;j<elementList.questions[i].selects.length;j++)
                        result.push((<div key={divKey++} className="SurveySelect">({j+1}) {elementList.questions[i].selects[j].content} {(elementList.questions[i].selects[j].numSelect*100/totalSelect).toFixed(2)}%</div>))
                }
            }


            return(
                <div className="SurveyBody">
                    <div className="SurveyArticle">
                        {result}
                    </div>
                </div>
            )
        }
        else if(elementList.type == 'submit')   
        {
            var result = []
            let divKey = 0

            for(let i = 0; i< elementList.questions.length;i++)
            {
                result.push((<div key={divKey++} className="SurveyQuestion">{i+1}. {elementList.questions[i].question}</div>))

                if(elementList.questions[i].type == 'single')
                {
                    surveyResult.push('')
                    for(let j = 0;j<elementList.questions[i].selects.length;j++)
                        result.push(
                            (
                            <div key={divKey++} className="SurveySelect">
                                <input id={divKey-1} className="SurveyCheckBox" onClick={()=>surveyResult[i] = elementList.questions[i].selects[j].pk} type="radio" name={'question' + String(i+1)} value={elementList.questions[i].selects[j].pk}/>
                                <label htmlFor={divKey-1}>{elementList.questions[i].selects[j].content}</label>
                            </div>
                            )
                            )
                }
                else if(elementList.questions[i].type == 'duplicate')
                {
                    surveyResult.push([])
                    for(let j = 0;j<elementList.questions[i].selects.length;j++)
                        result.push(
                            (
                            <div key={divKey++} className="SurveySelect">
                                <input id={divKey-1} className="SurveyCheckBox" onChange={(e)=>changeCheckBox(i,e)} type="checkbox" name={'question' + String(i+1)} value={elementList.questions[i].selects[j].pk}/>
                                <label htmlFor={divKey-1}>{elementList.questions[i].selects[j].content}</label>
                            </div>
                            )
                            )
                }
                else
                {
                    surveyResult.push('')
                    result.push(
                        (
                            <textarea key={divKey++} onChange={(e)=>surveyResult[i] = e.target.value} className="SurveyTextArea"></textarea>
                        )
                    )
                }
            }
 
            return(
                <div className="SurveyBody">
                    <div className="SurveyArticle">
                        {result}
                    </div>
                    <button onClick={fetchPostSurvey} className="SurveyToSubmitButton">제출하기</button>
                </div>
            )
        }    
    }

    function toSubmit()
    {
        var tmpList = {...bodyElementList}
        tmpList.type = 'submit'
        setBodyElementList(tmpList)
    }

    function changeCheckBox(idx,e)
    {
        if(e.target.checked)
        {
            surveyResult[idx].push(e.target.value)
        }
        else
            surveyResult[idx] = surveyResult[idx].filter(element=>element != e.target.value)
    }

    function fetchPostSurvey()
    {
        console.log(surveyResult)
        nav("/PostSuccess/Survey")
    }
}

export default SurveyDetailPage;
