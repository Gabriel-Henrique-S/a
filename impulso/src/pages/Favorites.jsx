import { useEffect, useMemo } from 'react';
import { Bookmark, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import contents from '../data/contents.json';
import { filterContents } from '../lib/content.mjs';
import { useImpulso } from '../state';
import Feed from '../components/Feed';
import Mascot from '../components/Mascot';
import ExploreFilters, { useContentFilters } from '../components/ExploreFilters';

export default function Favorites() {
  const { favorites } = useImpulso();
  const { filters, setFilter, reset } = useContentFilters();
  const saved = useMemo(() => favorites.map((id) => contents.find((item) => item.id === id)).filter((item) => item?.status === 'published'), [favorites]);
  const filtered = useMemo(() => filterContents(saved, filters), [saved, filters.category, filters.format, filters.search]);
  useEffect(() => { document.title = 'Seus favoritos — Impulso'; }, []);
  return <div className="container listing-page favorites-page"><div className="page-heading"><div><p className="eyebrow"><Bookmark size={13}/> PRA VOLTAR QUANDO PRECISAR</p><h1>Seu cantinho de<br/><span className="orange-text">inspiração.</span></h1><p>Guarde o que acende algo em você. Volte no seu tempo.</p></div><span className="saved-summary"><Bookmark size={18}/>{favorites.length} {favorites.length === 1 ? 'impulso guardado' : 'impulsos guardados'}</span></div>{saved.length ? <><ExploreFilters filters={filters} setFilter={setFilter} reset={reset} count={filtered.length}/><Feed items={filtered} onReset={reset}/><p className="favorites-note">Seus favoritos ficam salvos neste navegador. Você pode removê-los pelo ícone de marcador em cada cartão.</p></> : <div className="favorites-empty"><div className="empty-mascot-wrap"><Mascot className="empty-mascot" decorative/><span className="empty-bookmark"><Bookmark size={23}/></span></div><h2>Ainda tem espaço<br/>para o que te inspira.</h2><p>Toque no marcador de um conteúdo para guardar<br className="desktop-break"/> aqui e encontrar de novo quando precisar.</p><Link className="button button-primary" to="/explorar">Encontrar meu primeiro favorito<ArrowUpRight size={18}/></Link><span className="empty-privacy">Só seu. Sem conta e sem complicação.</span></div>}</div>;
}
