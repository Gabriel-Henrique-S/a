import { useEffect, useRef } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { Bookmark, Compass, House, SlidersHorizontal, ArrowUpRight, X, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useImpulso } from '../state';
import Mascot from './Mascot';
import InterestDialog from './InterestDialog';

const links = [
  { to: '/', label: 'Início', Icon: House, end: true },
  { to: '/explorar', label: 'Explorar', Icon: Compass },
  { to: '/favoritos', label: 'Favoritos', Icon: Bookmark },
];

function Navigation({ mobile = false }) {
  const { favorites } = useImpulso();
  return <nav className={mobile ? 'bottom-nav' : 'desktop-nav'} aria-label={mobile ? 'Navegação mobile' : 'Navegação principal'}>
    {links.map(({ to, label, Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-icon"><Icon size={mobile ? 21 : 16} aria-hidden="true"/>{to === '/favoritos' && favorites.length > 0 && <span className="favorite-count" aria-label={`${favorites.length} conteúdos salvos`}>{favorites.length}</span>}</span>{label}</NavLink>)}
  </nav>;
}

export default function Layout() {
  const { setInterestsOpen, interests, toast, dismissToast, storageAvailable } = useImpulso();
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.querySelector('#main-content')?.focus({ preventScroll: true });
  }, [pathname]);

  return <>
    <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
    <header className="site-header"><div className="container header-inner">
      <Link className="brand" to="/" aria-label="Impulso — início"><Mascot decorative/><span>impulso<span className="brand-dot">.</span></span></Link>
      <Navigation/>
      <button className="interests-button" type="button" onClick={() => setInterestsOpen(true)}><SlidersHorizontal size={16}/><span>Meus interesses</span>{interests.length > 0 && <span className="interests-count">{interests.length}</span>}</button>
    </div></header>
    {!storageAvailable && <div className="storage-notice" role="status">O armazenamento está indisponível neste navegador. Suas escolhas serão mantidas nesta aba enquanto ela estiver aberta.</div>}
    <main id="main-content" tabIndex={-1}><Outlet/></main>
    <footer className="site-footer"><div className="container footer-top"><div><Link className="brand" to="/" aria-label="Impulso — início"><Mascot decorative/><span>impulso<span className="brand-dot">.</span></span></Link><p>Um espaço para se inspirar.<br/>Um passo de cada vez.</p></div><div className="footer-message">SEM PRESSA.<br/><span>SEM COMPARAÇÃO.</span><ArrowUpRight size={26}/></div><nav aria-label="Navegação do rodapé"><Link to="/">Início</Link><Link to="/explorar">Explorar conteúdos</Link><Link to="/favoritos">Meus favoritos</Link></nav></div><div className="container footer-bottom"><p>© {new Date().getFullYear()} Impulso. Feito para gente.</p><span>Você não precisa ter tudo resolvido para começar.<span className="orange-dot"/></span></div></footer>
    <Navigation mobile/>
    <InterestDialog/>
    <div className="toast-region" role="status" aria-live="polite" aria-atomic="true"><AnimatePresence>{toast && <motion.div key={toast.id} className="toast" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}><span className="toast-check"><Check size={16}/></span><span>{toast.message}</span><button type="button" onClick={dismissToast} aria-label="Fechar notificação"><X size={16}/></button></motion.div>}</AnimatePresence></div>
  </>;
}
