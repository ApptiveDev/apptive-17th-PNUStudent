import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../css/PetitionDetailPage.css"
import MenuDownImg from "../img/header/navMenuDown.png"
import { requestGet, requestPutWithAccess } from "../requests/requests";

function PetitionDetailPage()
{
    const {mode, index} = useParams();
    const nav = useNavigate();
    const locate = useLocation();

    const [petitionPostStringList,setPetitionPostStringList] = useState(['제목','ooo','yyyy-mm-dd','0','내용'])
    const [commentList,setCommentList] =useState([])

    useEffect(onLoadPage,[locate.pathname])

    return( 
        <div className="DefaultPage">
            <div className="DummyHeader"/>

            <div className="PetitionDetailHeader">
                <div className="PetitionDetailTitle">{petitionPostStringList[0]}</div>
                <div className="PetitionDetailInp">작성자 {petitionPostStringList[1]} 작성일 {petitionPostStringList[2]} 조회수 {petitionPostStringList[3]}</div>
            </div>

            <div className="PetitionDetailArticle">
                {petitionPostStringList[4]}
            </div>

            <div className="PetitionDetailCommentsHeader">
                <div>댓글({commentList.length})</div>
                {mode === 'Petition' ?(<div className="PetitionDetailAgreeButton" onClick={fetchPutAgree}>동의하기</div>):""}
            </div>

            <div className="PetitionDetailCommentsDiv">
                {getJSXComments(commentList)}
            </div>

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

            <div className="PetitionDetailCommentDiv">
                <input className="PetitionDetailCommentInput"/>
                <button className="PetitionDetailCommentButton">등록</button>
            </div>

        </div>
    )

    function onLoadPage()
    {
        setPetitionPostStringList(['제목','ooo','yyyy-mm-dd','0','내용'])
        setCommentList([])
        fetchGetPetition()
    }

    function fetchGetPetition()
    {
        requestGet((mode === 'Survey' ? "/surveys" : (mode === 'Petition' ? "/petitions" : "/inquiries") ) + '/' + index).then(
            (data)=>
            {
                var result = []
                result[0] = data.title
                result[1] = data.writer.name
                if(data.created_at) result[2] = data.created_at.substr(0,10); else result[2] = "2022-12-29"
                if(data.hits) result[3] = data.hits; else result[3] = 10
                result[4] = data.content

                if(data.is_answered)
                {
                    requestGet("/inquiries" + '/' + index + '/answer').then(
                        (data)=>
                        {
                            result[4] += "\n\n답변-----------\n\n" + data.inquiry_content;
                            setPetitionPostStringList(result)
                        }
                    ).catch((err)=>{setPetitionPostStringList(result);console.log(err)})
                }
                else
                    setPetitionPostStringList(result)
                
                if(data.comments)setCommentList(data.comments)
            }
        ).catch(
            (err)=>console.log(err)
        )
    }

    function getJSXComments(comments)
    {
        if(comments.length == 0)
            return [(<p key={0}>댓글이 없습니다.</p>)]
        
        var result = []
        for(let i = 0; i<comments.length;i++)
        {
            result[i] =(
                <div className="PetitionDetailComment" key={i}>
                    <div className="PetitionDetailCommentWriter">{comments[i].user.name}&nbsp;</div>
                    <div className="PetitionDetailCommentPayload">{comments[i].payload}</div>
                </div>
            )
        }  
        return result  
            
    }

    function movePage(i)
    {
        if(i === -1 && index === '1')
            return
        nav("/PetitionDetail/"+mode+"/"+ `${parseInt(index) + i}`)
        
    }

    function fetchPutAgree()
    {
        requestPutWithAccess("/petitions/" + index + "/agree").then(
            (data)=>
            {
                alert(data);
            }
        ).catch(
            (err)=>console.log(err)
        )
    }
}

export default PetitionDetailPage;