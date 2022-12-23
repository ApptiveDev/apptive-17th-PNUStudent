import { useNavigate } from 'react-router-dom'
import "../../css/App/AppHeader.css"
import logo from "../../img/header/pnuLogo.png"
import LoginButtonImg from "../../img/header/LoginButton.png"
import navButtonImg from "../../img/header/navButton.png"
import navSubMenuDownImg from "../../img/header/navMenuDown.png"
import test from "../../img/test.png"
import { useContext } from 'react'
import { useRef } from 'react'
import {isLoginContext} from "../../App.js"
import {requestPost,requestGetWithAccess} from "../../requests/requests.js"

var isLoad = false

function AppHeader()
{
    const nav = useNavigate();
    const {isLogin,setIsLogin,logout} = useContext(isLoginContext)

    const navBarRef = useRef()
    const grayGlassRef = useRef()

    const navMenuImgRef1 = useRef();
    const navMenuImgRef2 = useRef();
    const navMenuImgRef3 = useRef();
    const navBarSubDivRef1 = useRef();
    const navBarSubDivRef2 = useRef();
    const navBarSubDivRef3 = useRef();

    return (
        <div className='AppHeaderFullDiv'>

            <div className='headerDiv' onLoad={onLoadAppHeader}>
                <img className='headerLogo' src={logo} onClick={()=>nav("/")}/>
                <HeaderLogin/>
                <img className='headerNavButton' src={navButtonImg} onClick={navBarOn}/>
            </div>


            <div className='navBar' ref={navBarRef}>
                <div className='navBarHeader' onClick={navBarOff}>
                    <div className='navBarHeaderTitle'>메뉴</div>
                </div>

                <div className='navBarHeader' onClick={()=>OnOffSubMenu(navBarSubDivRef1.current, navMenuImgRef1.current)}>
                    <div className='navBarHeaderText'>공지사항</div>
                    <img className='navBarInButton' src={navSubMenuDownImg} ref={navMenuImgRef1}/>
                </div>

                <div className='navSubMenyDiv' ref={navBarSubDivRef1}>
                    <p className='navSubMenu' onClick={()=>nav("/Announce/1")}>- 공지사항</p>
                    <p className='navSubMenu' onClick={()=>nav("/Benefit/1")}>- 제휴혜택</p>
                </div>

                <hr/>

                <div className='navBarHeader' onClick={()=>OnOffSubMenu(navBarSubDivRef2.current, navMenuImgRef2.current)}>
                    <div className='navBarHeaderText'>소통창구</div>
                    <img className='navBarInButton' src={navSubMenuDownImg} ref={navMenuImgRef2}/>
                </div>

                <div className='navSubMenyDiv' ref={navBarSubDivRef2}>
                    <p className='navSubMenu' onClick={()=>nav("/Survey/1")}>- 설문조사</p>
                    <p className='navSubMenu' onClick={()=>nav("/Petition/1")}>- 청원 게시판</p>
                    <p className='navSubMenu' onClick={()=>nav("/Inquiry/1")}>- 문의 게시판</p>
                </div>

                <hr/>

                {
                /*
                <div className='navBarHeader' onClick={()=>OnOffSubMenu(navBarSubDivRef3.current, navMenuImgRef3.current)}>
                    <div className='navBarHeaderText'>학생복지</div>
                    <img className='navBarInButton' src={navSubMenuDownImg} ref={navMenuImgRef3}/>
                </div>

                <div className='navSubMenyDiv' ref={navBarSubDivRef3}>
                    <p className='navSubMenu' onClick={()=>nav("/")}>- 공간 대여</p>
                    <p className='navSubMenu' onClick={()=>nav("/")}>- 장비 대여</p>
                </div>
                */
                }

            </div>

            <div className='grayGlass' ref={grayGlassRef} onClick={navBarOff}/>

        </div>
    )

    function navBarOn()
    {
        navBarRef.current.style.left = "30%"
        grayGlassRef.current.style.visibility = "visible"
    }
    function navBarOff()
    {
        navBarRef.current.style.left = "100%"
        grayGlassRef.current.style.visibility = "hidden"
    }

    function HeaderLogin()
    {
        return(
            <div className='headerLogin'>
                {isLogin ? (<div style={{"display":"flex"}}><p>{localStorage.getItem("UserName")}님&nbsp;&nbsp;</p><p onClick={logout}>로그아웃</p></div>) : (<img className='headerLoginButton' src={LoginButtonImg} onClick={()=>nav("/Login")}/>)}
            </div>
        )
    }

    function onLoadAppHeader()
    {
        if(isLoad)
            return
        isLoad = true    
        if(localStorage.getItem("AccessKey") == null)
            setIsLogin(false)
        else
            fetchMyPage()
    }


    function fetchMyPage()
    {
        requestGetWithAccess("/users/mypage")
            .then(data=>
            {
                if(data.error != null)
                {
                    logout()
                    return
                }
                localStorage.setItem("UserName",data.name)             
                setIsLogin(true)
            }
            ).catch((e)=>{setIsLogin(false)})
    }

    function OnOffSubMenu(sub, MenuImg)
    {
        if(sub.clientHeight == 0)
        {
            sub.style.maxHeight = String(sub.scrollHeight) +"px"
            MenuImg.style.transform = 'rotate(180deg)'
        }
        else
        {
            sub.style.maxHeight = "0px"
            MenuImg.style.transform = 'rotate(0deg)'
        }
    }

}



export default AppHeader;