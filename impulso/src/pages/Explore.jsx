import { useEffect, useMemo } from 'react';
import { Compass, SlidersHorizontal } from 'lucide-react';
import contents from '../data/contents.json';
import categories from '../data/categories.json';
import { recommend, filterContents } from '../lib/content.mjs';
import { useImpulso } from '../state';
import Feed from '../components/Feed';
import ExploreFilters, { useContentFilters } from '../components/ExploreFilters';

export default function Explore() {
  const { interests, setInterestsOpen } = useImpulso();
  const { filters, setFilter, reset } = useContentFilters();
  const items = useMemo(() => filterContents(recommend(contents, interests, categories), filters), [interests, filters.category, filters.format, filters.search]);
  useEffect(() => { document.title = 'Explorar — Impulso'; }, []);
  return <div className="container listing-page"><div className="page-heading"><div><p className="eyebrow"><Compass size={13}/> SIGA A SUA CURIOSIDADE</p><h1>Encontre o que<br/><span className="orange-text">te move.</span></h1><p>Ideias diferentes para os muitos momentos de ser você.</p></div><button className="button button-secondary" type="button" onClick={() => setInterestsOpen(true)}><SlidersHorizontal size={16}/>Ajustar meus interesses</button></div><ExploreFilters filters={filters} setFilter={setFilter} reset={reset} count={items.length}/><Feed items={items} onReset={reset}/>{items.length > 0 && <p className="listing-end"><span className="orange-dot"/>Por hoje, é isso por aqui. Seu próximo passo é com você.</p>}</div>;
}
