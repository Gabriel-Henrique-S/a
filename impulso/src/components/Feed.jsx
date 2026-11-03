import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, SearchX } from 'lucide-react';
import ContentCard from './ContentCard';
import { FORMATS } from '../lib/content.mjs';
import { formatIcons } from './Icons';
import { Link } from 'react-router-dom';

export function FormatTabs({ value, onChange }) {
  return <div className="format-tabs" role="group" aria-label="Filtrar por formato">{FORMATS.map((format) => {
    const Icon = formatIcons[format.id];
    return <button key={format.id} type="button" aria-pressed={value === format.id} className={value === format.id ? 'active' : ''} onClick={() => onChange(format.id)}>{Icon && <Icon size={14} aria-hidden="true"/>}{format.label}</button>;
  })}</div>;
}

export function EmptyState({ title = 'Nenhum impulso por aqui. Ainda.', description = 'Experimente outra categoria, formato ou palavra na busca.', onReset, favorites = false }) {
  return <div className="empty-state"><div className="empty-icon"><SearchX size={30} aria-hidden="true"/></div><h2>{title}</h2><p>{description}</p>{favorites ? <Link className="button button-primary" to="/explorar">Explorar conteúdos<ArrowRight size={18}/></Link> : onReset && <button className="button button-secondary" type="button" onClick={onReset}>Limpar filtros</button>}</div>;
}

export default function Feed({ items, onReset }) {
  return items.length ? <motion.div layout className="content-grid"><AnimatePresence mode="popLayout">{items.map((item, index) => <ContentCard key={item.id} item={item} index={index}/>)}</AnimatePresence></motion.div> : <EmptyState onReset={onReset}/>;
}
