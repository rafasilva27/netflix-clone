import React, {useEffect, useState} from "react";
import './App.css'
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import FeaturedMovie from "./components/FeaturedMovie";
import Header from './components/Header/Header'

export default () => {

  const[movieList, setMovieList] = useState([]);
  const[FeaturedData, setFeaturedData] = useState(null);
  const [blackHeader,setBlackHeader] = useState(false);

useEffect(() => {
  const loadAll = async () => {
    //pegando a lista total
    let list = await Tmdb.getHomeList();
    setMovieList(list);

    //pegando o Featured
    let originals = list.filter(i=>i.slug === 'originals');
    let randonChosen = Math.floor(Math.random()*(originals[0].items.results.length - 1));
    let chosen = originals[0].items.results[randonChosen];
    let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
    setFeaturedData(chosenInfo);
    
  }

  loadAll();
}, []);

useEffect(()=> {
  const scrollListener = () => {
    if(window.scrollY > 10){
      setBlackHeader(true)
    } else{
      setBlackHeader(false)
    }
  }
  window.addEventListener('scroll', scrollListener);

  return () => {
    window.removeEventListener('scroll', scrollListener);
  }
}, []);

  return (
    <div className="page">

      <Header black = {blackHeader} />
      
      {FeaturedData &&
      <FeaturedMovie item={FeaturedData}/>
      }

      <section className="lists">
        {movieList.map((item, key) => (
         <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Direitos de imagem para Netflix<br/>Conteúdo copiado da API do site <a href="themoviedb.org" target="_blank">TMDB</a>
      </footer>

      {movieList.length <= 0 &&
      <div className="loading">
        <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif">
        </img>
      </div>
      }
    </div>
  )
}