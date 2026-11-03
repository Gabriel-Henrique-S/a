import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Sparkles, Heart, SlidersHorizontal, Flame, MoveUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import contents from '../data/contents.json';
import categories from '../data/categories.json';
import { filterContents, recommend } from '../lib/content.mjs';
import { useImpulso } from '../state';
import Mascot from '../components/Mascot';
import Feed, { FormatTabs } from '../components/Feed';
import { categoryIcons } from '../components/Icons';

export default function Home() {
  const { interests, setInterestsOpen } = useImpulso();
  const [format, setFormat] = useState('all');
  useEffect(() => { document.title = 'Impulso — Seu próximo passo começa aqui'; }, []);
  const items = useMemo(() => filterContents(recommend(contents, interests, categories), { format }).slice(0, 6), [format, interests]);
  return <>
    <section className="hero container" aria-labelledby="hero-title">
      <motion.div className="hero-copy" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
        <p className="eyebrow"><span className="orange-dot"/> UM ESPAÇO PRA VOCÊ.</p>
        <h1 id="hero-title">Às vezes, tudo<br/>começa com um<br/><span className="spray-underline">pequeno impulso.</span></h1>
        <p className="hero-description">Frases que acolhem. Histórias que inspiram. Vídeos que dão aquele empurrãozinho.<br className="desktop-break"/> Encontre o que faz sentido para o seu momento.</p>
        <div className="hero-actions"><Link className="button button-primary" to="/explorar">Encontrar meu impulso<ArrowUpRight size={19}/></Link><span className="hero-small-note"><Heart size={14}/>No seu ritmo. Sempre.</span></div>
      </motion.div>
      <motion.div className="hero-visual" initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .6 }}>
        <span className="hero-orbit orbit-one" aria-hidden="true"/><span className="hero-orbit orbit-two" aria-hidden="true"/>
        <span className="hero-small-star" aria-hidden="true"><Sparkles/></span>
        <div className="welcome-bubble">Ei, que bom<br/>que você chegou.<span aria-hidden="true"><MoveUpRight size={29}/></span></div>
        <div className="mascot-floor" aria-hidden="true"/>
        <Mascot className="hero-mascot"/>
        <div className="hero-sticker" aria-hidden="true">VAI.<br/><span>NO SEU TEMPO.</span></div>
        <div className="hero-quote"><span className="quote-line"/><p>“Um passo já<br/>é movimento.”</p><span>UM LEMBRETE DO IMPULSO</span><MoveUpRight size={21}/></div>
        <span className="visual-caption">ACENDA O QUE TE MOVE.</span>
      </motion.div>
    </section>

    <section className="categories-section container" aria-labelledby="categories-title"><div className="section-heading"><div><p className="eyebrow">POR ONDE VOCÊ QUER COMEÇAR?</p><h2 id="categories-title">Escolha seu <span>Impulso.</span></h2></div><Link className="text-link" to="/explorar">Explorar tudo<ArrowUpRight size={17}/></Link></div><div className="category-grid">{categories.map((category, index) => {
      const Icon = categoryIcons[category.icon];
      return <Link key={category.id} className={`category-card category-${index}`} to={`/explorar?categoria=${category.id}`}><div className="category-top"><span className="category-symbol"><Icon size={22} strokeWidth={1.6}/></span><ArrowUpRight size={16} className="category-arrow"/></div><h3>{category.name}</h3><p>{category.description}</p>{interests.includes(category.id) && <span className="preferred-dot" aria-label="Um dos seus interesses"/>}</Link>;
    })}</div></section>

    <section className="container recommended-section" aria-labelledby="recommended-title"><div className="section-heading"><div><p className="eyebrow"><Flame size={12}/> UMA DOSE DE INSPIRAÇÃO</p><h2 id="recommended-title">{interests.length ? 'Mais a sua cara.' : 'Para o seu momento.'}</h2><p className="section-description">{interests.length ? 'Seus temas favoritos e conexões que podem te surpreender.' : 'Talvez o seu próximo passo comece com uma dessas ideias.'}</p></div><button className="text-link" type="button" onClick={() => setInterestsOpen(true)}><SlidersHorizontal size={15}/>Personalizar meu feed</button></div><div className="feed-toolbar"><FormatTabs value={format} onChange={setFormat}/><span className="feed-toolbar-note">UM POUCO DE CADA. TUDO PRA VOCÊ.</span></div><Feed items={items} onReset={() => setFormat('all')}/><div className="feed-end"><Link className="button button-secondary" to="/explorar">Tem mais impulso por aqui<ArrowRight size={18}/></Link></div></section>

    <section className="container personal-callout" aria-labelledby="personal-title"><div className="callout-icon"><Sparkles size={29}/></div><div><p className="eyebrow">INSPIRAÇÃO COM A SUA CARA</p><h2 id="personal-title">O que te move hoje?</h2><p>Escolha seus interesses. A gente aproxima as ideias que combinam com você.</p></div><button className="button button-primary" type="button" onClick={() => setInterestsOpen(true)}>{interests.length ? 'Ajustar meus interesses' : 'Escolher meus interesses'}<ArrowUpRight size={18}/></button><span className="callout-graffiti" aria-hidden="true">+</span></section>
  </>;
}
