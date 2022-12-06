import "../css/Home/Home.css"
import HomePageAnnounce from '../component/Home/HomePageAnnounce';
import HomePagePetition from '../component/Home/HomePagePetition';
import HomePageBenefit from '../component/Home/HomePageBenefit';

import { Route, Routes } from "react-router-dom";
import { useState } from 'react';

function Home()
{
    return (
        <div className='Home'>
            <HomePageAnnounce/>
            <HomePagePetition mode='Petition'/>
            <HomePagePetition mode='Survey'/>
            <HomePageBenefit/>
        </div>
    )

}



export default Home;