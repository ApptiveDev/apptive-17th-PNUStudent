import "../css/SignUp.css";
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPost } from '../requests/requests';
var majors=
[
    "국어국문학과,일어일문학과",
    "행정학과,정치외교학과",
    "수학과,통계학과"
]


function SignUp()
{
    const nav = useNavigate();

    let ID = useRef();

    let passwordInput = useRef();
    let passwordCheckInput = useRef();

    let [passwordText,setPasswordText] = useState("비밀번호를 입력해주세요.");

    var isPasswordChecked = false;

    let nameInput = useRef();

    let collegeSelect = useRef();
    let majorSelect = useRef();

    let [major,setMajor] = useState(getJSX(0));
    
    return (
        <div className='SignUpDiv'>

                <div className="DummyHeader"/>

                <div className='SignUpFirstLabel' onClick={()=>{nav('/Login')}}>
                    이미 가입한 회원이신가요?
                </div>

                <div className='SignUpLabel'>
                    웹메일
                </div>

                <div className='SignUpIDDiv'>
                    <input className='SignUpID' ref={ID} placeholder="  웹메일"/>

                    <div className='SignUpEmailURL'>
                    &nbsp;&nbsp;@pusan.ac.kr&nbsp;&nbsp;
                    </div>
                </div>

                <div className='SignUpLabel'>
                    비밀번호
                </div>

                <input className='SignUpInput' ref={passwordInput} type={"password"} placeholder="  비밀번호" onChange={checkPassword}/>

                <div className='SignUpLabel'>
                    비밀번호 확인
                </div>

                <input className='SignUpInput' ref={passwordCheckInput} type={"password"} placeholder="  비밀번호 확인" onChange={checkPassword} />

                <div className='SignUpPasswordText'>
                    {passwordText}
                </div>

                <div className='SignUpLabel'>
                    이름
                </div>

                <input className='SignUpInput' ref={nameInput} placeholder="  이름"/>

                <div className='SignUpLabel'>
                    단과대
                </div>

                <select className='SignUpSelect' onChange={(event)=>{setOption(event.target.value)}} ref={collegeSelect}>
                    <option value={0}>인문대학</option>
                    <option value={1}>사회과학대학</option>
                    <option value={2}>자연과학대학</option>
                </select>

                <div className='SignUpLabel'>
                    학과
                </div>

                <select className='SignUpSelect' ref={majorSelect}>
                    {major}
                </select>

                <button className='SignUpButton' onClick={fetchSingUp}>
                    가입하기
                </button>
                
        </div>
    )

function setOption(value)
{
    setMajor(getJSX(value));
}

function getJSX(value)
{
    var nowMajors = majors[value].split(",")
    var result = []
    for(var i = 0; i< nowMajors.length;i++)
    {
        result[i] = (<option value = {nowMajors[i]} key = {i}>{nowMajors[i]}</option>)
    }
    return result;

}

function checkPassword()
{
    var [min,max] = [4,12];

    var pw = passwordInput.current.value;

    if(pw.length < min || max < pw.length)
    {
        setPasswordText("비밀번호는 4 ~ 12 길이로 설정해주세요.")
        isPasswordChecked = false;
        return
    }

    var alphaCheck = false
    var NumCheck = false;

    for(var i = 0; i<pw.length;i++)
    {
        var asc = pw.charCodeAt(i)
        if((65<=asc && asc<=90) || (97<= asc && asc<= 122))
            alphaCheck = true
        if(48<=asc && asc<=57)
            NumCheck = true
    }

    if(!alphaCheck || !NumCheck)
    {
        setPasswordText("비밀번호는 최소 한개씩의 영어와 숫자로 구성해주세요.")
        isPasswordChecked = false;
        return
    }

    if(pw === passwordCheckInput.current.value)
    {
        setPasswordText("사용하실 수 있는 비밀번호입니다.")
        isPasswordChecked = true;
    }
    else
    {
        setPasswordText("비밀번호가 동일하지 않습니다.")
        isPasswordChecked = false;
    }

}

function fetchSingUp()
{

    if(passwordText != "사용하실 수 있는 비밀번호입니다.")
    {
        alert(passwordText)
        return
    }

    requestPost("/users/",{
        username : ID.current.value,
        password : passwordInput.current.value,
        //name : nameInput.current.value,
        //college: collegeSelect.current.options[collegeSelect.current.selectedIndex].innerHTML,
        major : majorSelect.current.options[majorSelect.current.selectedIndex].innerHTML //"aerospaceE"
    }).then((data)=>
    {     
            if(data.username != ID.current.value)
            {
                alert("회원가입에 실패하였습니다.")
                return
            }
            alert("회원가입에 성공하였습니다. 이메일의 인증메일을 확인해주세요")
            nav("/Login");         
    }
    ).catch((e)=>alert(`회원가입에 실패하였습니다.\n${e}`))

}



}





export default SignUp;