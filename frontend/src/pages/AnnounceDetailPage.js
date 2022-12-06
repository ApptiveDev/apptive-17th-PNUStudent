import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import "../css/AnnounceDetailPage.css"
import test from "../img/test.png"
import MenuDownImg from "../img/header/navMenuDown.png"
import { useRef } from 'react';
import { requestGet } from '../requests/requests';

function AnnounceDetailPage({postInp})
{
    const {mode, index} = useParams();
    const nav = useNavigate();
    const locate = useLocation();

    var imgsDivRef = useRef();
    const [markColors,setMarkColors] = useState([0]);

    const [postStringList,setPostStringList] = useState([mode + index,'yyyy-mm-dd','ooo','0','내용'])
    const [imgJSXList,setImgJSXList] = useState(GetImgs([test]))

    useEffect(onLoadPage,[locate.pathname])

    return (
        <div className='DefaultPage'>
            <div className='DummyHeader'/>

            <div className='PostTitle'>{postStringList[0]}</div>
            <div className='PostTitleBottomDiv'>
                <div className='PostTitleBottomText'>{postStringList[1]}</div>
                <div className='PostTitleBottomText'>작성자 {postStringList[2]}</div>
                <div className='PostTitleBottomText'>조회수 {postStringList[3]}</div>
            </div>

            <div className='PostImgsDiv' onScroll={()=>scrollImg()} ref={imgsDivRef}>
                {imgJSXList}
            </div>

            <div className='PostMarkDiv'>
                {GetMarks(imgJSXList.length)}
            </div>

            <div className='PostArticle'>
                {postStringList[4]}
            </div>

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

        </div>
    )

    function onLoadPage()
    {
        fetchGetAnnounceDetail()
    }

    function fetchGetAnnounceDetail()
    {
        requestGet((mode === 'Announce' ? '/announces':'/benefits')+'/'+index).then(
            (data)=>
            {                
                var resultString = [data.title,data.created_at.substr(0,10),data.writer.name,'0',data.content]
                setPostStringList(resultString)
                //data.photos = [test,test,test,test]
                setImgJSXList(GetImgs(data.photos.length > 0 ? data.photos: [test]))
                scrollImg(data.photos.length > 0 ? data.photos.length : 1)
            }
            ).catch(
                (err)=>console.log(err)
            )
    }

    function GetImgs(srcList)
    {
        var result = []
        for(var i = 0; i<srcList.length;i++)
        {
            result[i] = (<img key={i} src={srcList[i]} className='PostImg'/>)
        }
        return result
    }

    function GetMarks(imgCount)
    {
        var result = []

        for(let i = 0; i<imgCount;i++)
            result[i] = (<div key={i} className='PostMark' style={{"backgroundColor":`RGB(${markColors[i]},${markColors[i]},${markColors[i]})`}}/>)
  
        return result
    }

    function scrollImg(imgCount)
    {
        if(imgCount == null)
            imgCount = imgJSXList.length    
        var scrollLeft = imgsDivRef.current.scrollLeft
        var scrollWidth = imgsDivRef.current.clientWidth
        var result = []
        for(var i = 0;i<imgCount;i++)
        {
            var weight = 100 * Math.min(2 , Math.abs(scrollLeft - (i*scrollWidth)) / scrollWidth)
            result[i] = weight
        }
        setMarkColors(result)
    }

    function movePage(i)
    {
        if(i === -1 && index === '1')
            return
        nav("/AnnounceDetail/"+mode+"/"+ `${parseInt(index) + i}`)
        
    }
}



export default AnnounceDetailPage;