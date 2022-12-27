import "../css/Login.css"
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPost, requestGetWithAccess } from '../requests/requests';
import { useContext } from 'react';
import { isLoginContext } from '../App';

function Login()
{
    const nav = useNavigate();

    var canLogin = true;

    let IDInput = useRef();
    let passwordInput = useRef();

    var {setIsLogin} = useContext(isLoginContext)

    return (
        <div className='LoginDiv'> 
            <div className="LoginInputDiv">
                <input className='LoginInput' ref={IDInput} placeholder="  이메일" />

                <input className='LoginInput' ref={passwordInput} placeholder="  비밀번호" type="password"/>  

                <button className='LoginButton' onClick={fetchSignIn}>
                    로그인
                </button>
                <div className='LoginUnderDiv'>
                    <p className='LoginUnderText' onClick={()=>nav("/FindInp")}>
                        회원 정보찾기
                    </p>
                    <p className='LoginUnderBar'>
                        |
                    </p>
                    <p className='LoginUnderText' style={{marginLeft:"auto"}} onClick={()=>nav("/SignUp")} >
                        회원가입
                    </p>
                </div>
            </div>
        </div>
    )

    
    function fetchSignIn()
    {
        if(!canLogin)
        return;
        canLogin = false;
        requestPost("/users/login",
        {
            username:IDInput.current.value, 
            password:passwordInput.current.value
        }
        )
        .then(data=>
        {
            if(data.error != null)
            {
                alert(data.error)
                canLogin = true
                return
            }
            localStorage.setItem("AccessKey",data.token)
            //localStorage.setItem("RefreshKey",data.refresh)
            //localStorage.setItem("UserName",username)

            requestGetWithAccess("/users/mypage")
            .then(data=>
            {
                if(data.error != null)
                {
                    localStorage.removeItem("AccessKey")
                    alert(data.error)
                    canLogin = true
                    return
                }
                localStorage.setItem("UserName",data.name)             
                setIsLogin(true)
                nav("/") 
            }
            ).catch((e)=>{localStorage.removeItem("AccessKey");alert(`(catch)로그인에 실패하였습니다.\n${e}`); canLogin = true})
             
        }
        ).catch((e)=>{alert(`(catch)로그인에 실패하였습니다.\n${e}`); canLogin = true})
    }


}

export default Login;