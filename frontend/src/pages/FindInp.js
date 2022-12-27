import "../css/Login.css"
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPost, requestGetWithAccess } from '../requests/requests';
import { useContext } from 'react';
import { isLoginContext } from '../App';

function FindInp()
{
    const nav = useNavigate();


    let IDInput = useRef();

    return (
        <div className='LoginDiv'> 
            <div className="LoginInputDiv">
                <div className='FindText'>
                    회원가입시 등록한 이메일을 입력해주세요 <br/>
                    해당 이메일로 비밀번호를 입력해주세요. 
                </div>
                <input className='LoginInput' ref={IDInput} placeholder="  이메일" />

                <button style={{marginTop:"20px"}} className='LoginButton' onClick={fetchPostMail}>
                    메일 발송
                </button>
            </div>
        </div>
    )

    
    function fetchPostMail()
    {
        nav("/Login")
    }


}

export default FindInp;