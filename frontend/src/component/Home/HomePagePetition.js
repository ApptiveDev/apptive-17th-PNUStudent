import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import "../../css/Home/Home.css"
import "../../css/Home/HomePetition.css"
import sideButtonImg from "../../img/header/navMenuDown.png"
import { requestGet } from "../../requests/requests";

function HomePagePetition({mode})
{
    const nav = useNavigate();
    const locate = useLocation();

    const [petitionStringList,setPetitionStringList] = useState(['0','제목','내용'])

    useEffect(onLoadPage,[locate.pathname])

    return(
        <div className='HomePage' id="HomePagePetition">
            <div className="DummyHeader"/>

            <div className="PetitionTitle">
                {mode ==="Petition"? '청원 게시판' : '설문 조사'}
            </div>

            <div className="PetitionExplanation">
                {mode ==="Petition"? 
                '학생들이 자유롭게 의견을 가질 수 있는 공간입니다.' 
                : 
                '설문 조사에 참여하여 여러분의 목소리를 들려주세요.'
                }   
            </div>

            <div className="PetitionPostsDiv">
                <div className='PetitionPostsLeftSideDiv'><img style={{"transform":"rotate(90deg)", "filter":"brightness(200%)"}} src={sideButtonImg}/></div>

                <div className='PetitionPostsLeftCenterDiv'>

                    <div className='PetitionPostDefault'>
                        <div className='PetitionPostIsRunning'>진행중</div>
                        <div className='PetitionPostNumPeople'>{petitionStringList[0]}명 참여</div>
                    </div>

                    <div className='PetitionPostTitle'>{petitionStringList[1]}</div>

                    <div className='PetitionPostArticle'>{petitionStringList[2]}</div>

                    <div className='PetitionPostDefault' style={{"marginTop":"auto","marginBottom":"10px"}}>
                        <div className='PetitionPostTime'>2022.02.02<br/>~2022.02.03</div>
                        <div className='PetitionPostMore' onClick={mode ==="Petition"?()=>nav("/Petition/1"):()=>nav("/Survey/1")}><br/>더보기 &gt;</div>
                    </div>
                </div>

                <div className='PetitionPostsLeftSideDiv'><img style={{"transform":"rotate(-90deg)" , "filter":"brightness(200%)"}} src={sideButtonImg}/></div>

            </div>
        </div>
    )

    function onLoadPage()
    {
        fetchGetPetition()
    }   

    function fetchGetPetition()
    {
        requestGet((mode == "Petition" ? '/petitions':'/petitions')+'/main').then(
            (data)=>
            {
                var result = []
                result[0] = data[0].total_agrees
                result[1] = data[0].title
                result[2] = data[0].content
                setPetitionStringList(result)
            }
        ).catch(
            (err)=>console.log(err)
        )
    }
}
export default HomePagePetition