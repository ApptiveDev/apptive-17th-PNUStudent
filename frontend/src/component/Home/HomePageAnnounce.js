import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import "../../css/Home/Home.css"
import "../../css/Home/HomeAnnounce.css"
import test from "../../img/test.png"
import { requestGet } from "../../requests/requests";

function HomePageAnnounce()
{
    const nav = useNavigate();
    const locate = useLocation();

    const [announcePKList,setAnnouncePKList] = useState(['1','2','3'])
    const [announceImgList,setAnnounceImgList] = useState([test,test,test])
    const [announceTitleList,setAnnounceTitleList] = useState(['제목','제목','제목'])
    const [benefitPKList,setBenefitPKList] = useState(['1','2','3'])
    const [benefitImgList,setBenefitImgList] = useState([test,test,test])
    const [benefitTitleList,setBenefitTitleList] = useState(['제목','제목','제목'])

    useEffect(onLoadPage,[locate.pathname])

    return(
        <div className='HomePage' id="HomePageAnnounce">

            <div className='DummyHeader'/>

            <div className='DummyTop'/>

            <div className='AnnounceDiv'>

                <div className='AnnounceDivHeader'>
                    <div className='AnnounceTitle'>공지사항</div>
                    <div className='AnnounceMore' onClick={()=>{nav("/Announce/1")}}>더보기 &gt;</div>
                </div>

                <div className='AnnounceDivBody'>

                    <div className='AnnounceBodyElement' onClick={()=>nav(`/AnnounceDetail/Announce/${announcePKList[0]}`)}>
                        <img className='AnnounceImg' src={announceImgList[0]}/>
                        <div className='AnnouncePostTitle'>{announceTitleList[0]}</div>
                    </div>

                    <div className='AnnounceBodyElement' onClick={()=>nav(`/AnnounceDetail/Announce/${announcePKList[1]}`)}>
                        <img className='AnnounceImg' src={announceImgList[1]}/>
                        <div className='AnnouncePostTitle'>{announceTitleList[1]}</div>
                    </div>

                    <div className='AnnounceBodyElement' onClick={()=>nav(`/AnnounceDetail/Announce/${announcePKList[2]}`)}>
                        <img className='AnnounceImg' src={announceImgList[2]}/>
                        <div className='AnnouncePostTitle'>{announceTitleList[2]}</div>
                    </div>
                
                </div>  

            </div>  

            <div className='DummyCenter'/>   

            <div className='AnnounceDiv'>

                <div className='AnnounceDivHeader'>
                    <div className='AnnounceTitle'>제휴혜택</div>
                    <div className='AnnounceMore' onClick={()=>{nav("/Benefit/1")}}>더보기 &gt;</div>
                </div>

                <div className='AnnounceDivBody'>
                    
                    <div className='AnnounceBodyElement' onClick={()=>nav(`/AnnounceDetail/Benefit/${benefitPKList[0]}`)}>
                        <img className='AnnounceImg' src={benefitImgList[0]}/>
                        <div className='AnnouncePostTitle'>{benefitTitleList[0]}</div>
                    </div>

                    <div className='AnnounceBodyElement' onClick={()=>nav(`/AnnounceDetail/Benefit/${benefitPKList[1]}`)}>
                        <img className='AnnounceImg' src={benefitImgList[1]}/>
                        <div className='AnnouncePostTitle'>{benefitTitleList[1]}</div>
                    </div>

                    <div className='AnnounceBodyElement' onClick={()=>nav(`/AnnounceDetail/Benefit/${benefitPKList[2]}`)}>
                        <img className='AnnounceImg' src={benefitImgList[2]}/>
                        <div className='AnnouncePostTitle'>{benefitTitleList[2]}</div>
                    </div>
                
                </div>      

            </div>   

        </div>
    )

    function onLoadPage()
    {
        GETAnnounceMain()
    }

    function GETAnnounceMain()
    {
        requestGet("/announces/main").then(
            (data)=>
            {
                if(data.error != null)
                {
                    console.log(data.error)
                    return
                }
                var pkList = ['1','2','3']
                var imgList = [test,test,test]
                var titleList = ['제목','제목','제목']
                for(let i = 0;i<data.length;i++)
                {
                    pkList[i] = data[i].pk
                    imgList[i] = data[i].photos[0] != null ? data[i].photos[0].file : test;
                    titleList[i] = data[i].title != null ? data[i].title : '제목';
                    if(data[i].is_important)
                        titleList[i] = '[중요]' + titleList[i]
                }
                setAnnouncePKList(pkList)
                setAnnounceImgList(imgList)
                setAnnounceTitleList(titleList)

            }).catch(
                (err)=>console.log(err)
            )

            requestGet("/benefits/main").then(
                (data)=>
                {
                    if(data.error != null)
                    {
                        console.log(data.error)
                        return
                    }
                    var pkList = ['1','2','3']
                    var imgList = [test,test,test]
                    var titleList = ['제목','제목','제목']
                    for(let i = 0;i<data.length;i++)
                    {
                        pkList[i] = data[i].pk
                        if(data[i].photos)
                            imgList[i] = data[i].photos[0] != null ? data[i].photos[0] : test;
                        titleList[i] = data[i].title != null ? data[i].title : '제목';
                        if(data[i].is_important)
                            titleList[i] = '[중요]' + titleList[i]
                    }
                    setBenefitPKList(pkList)
                    setBenefitImgList(imgList)
                    setBenefitTitleList(titleList)
    
                }).catch(
                    (err)=>console.log(err)
                )    
    }
}
export default HomePageAnnounce