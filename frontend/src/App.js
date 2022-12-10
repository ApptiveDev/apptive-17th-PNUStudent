import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login'
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import AppHeader from './component/App/AppHeader';
import { createContext } from 'react';
import AnnouncePage from './pages/AnnouncePage';
import AnnounceDetailPage from './pages/AnnounceDetailPage';
import PetitionPage from './pages/PetitionPage';
import PetitionPostPage from './pages/PetitionPostPage';
import PetitionDetailPage from './pages/PetitionDetailPage';
import SurveyDetailPage from './pages/SurveyDetailPage';

export const isLoginContext = createContext()

function App() {

  const [isLogin,setIsLogin] = useState(false)

  return (
    <div className="App">
        <isLoginContext.Provider value={{isLogin,setIsLogin}}>  
          <AppHeader/>
          <div className='RoutesDiv'>
          <Routes>
            <Route path ="/" element = {<Home/>}/>
            <Route path ="/Login" element = {<Login/>}/>
            <Route path ="/SignUp" element = {<SignUp/>}/>
            <Route path ="/Announce" element={<AnnouncePage/>}/>
            <Route path ="/Benefit" element={<AnnouncePage/>}/>
            <Route path ="/AnnounceDetail/:mode/:index" element={<AnnounceDetailPage/>}/>
            <Route path ="/Survey/:page" element={<PetitionPage/>}/>
            <Route path ="/Petition/:page" element={<PetitionPage/>}/>
            <Route path ="/Inquiry/:page" element={<PetitionPage/>}/>
            <Route path ="/PetitionDetail/:mode/:index" element={<PetitionDetailPage/>}/>
            <Route path ="/Petition/Post" element={<PetitionPostPage/>}/>
            <Route path ="/Inquiry/Post" element={<PetitionPostPage/>}/>
            <Route path= "/SurveyDetail/:index" element={<SurveyDetailPage/>}/>
          </Routes>
          </div>
        </isLoginContext.Provider>
    </div>
  );
}

export default App;
