import { Search, X, SlidersHorizontal } from 'lucide-react';
import categories from '../data/categories.json';
import { FormatTabs } from './Feed';
import { useSearchParams } from 'react-router-dom';
import { FORMATS } from '../lib/content.mjs';

export function useContentFilters() {
  const [params, setParams] = useSearchParams();
  const rawCategory = params.get('categoria');
  const rawFormat = params.get('formato');
  const filters = {
    category: categories.some((c) => c.id === rawCategory) ? rawCategory : 'all',
    format: FORMATS.some((f) => f.id === rawFormat) ? rawFormat : 'all',
    search: params.get('busca') || '',
  };
  function setFilter(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true, preventScrollReset: true });
  }
  return { filters, setFilter, reset: () => setParams({}, { replace: true }) };
}

export default function ExploreFilters({ filters, setFilter, reset, count }) {
  const active = filters.category !== 'all' || filters.format !== 'all' || !!filters.search;
  return <div className="explore-filters">
    <div className="search-row"><label className="search-field"><Search size={19} aria-hidden="true"/><span className="sr-only">Buscar conteúdos</span><input type="search" placeholder="Uma palavra pode ser o começo. O que você procura?" value={filters.search} onChange={(e) => setFilter('busca', e.target.value)} maxLength={160}/></label><span className="search-note"><SlidersHorizontal size={15}/>ENCONTRE O SEU MOMENTO.</span></div>
    <div className="category-filter" role="group" aria-label="Filtrar por categoria"><button type="button" aria-pressed={filters.category === 'all'} className={filters.category === 'all' ? 'active' : ''} onClick={() => setFilter('categoria', 'all')}>Todos os temas</button>{categories.map((category) => <button type="button" key={category.id} aria-pressed={filters.category === category.id} className={filters.category === category.id ? 'active' : ''} onClick={() => setFilter('categoria', category.id)}>{category.name}</button>)}</div>
    <div className="feed-toolbar explore-toolbar"><FormatTabs value={filters.format} onChange={(value) => setFilter('formato', value)}/><div className="result-status"><span role="status" aria-live="polite">{count} {count === 1 ? 'conteúdo' : 'conteúdos'}</span>{active && <button type="button" className="reset-filters" onClick={reset}><X size={13}/>Limpar filtros</button>}</div></div>
  </div>;
}
