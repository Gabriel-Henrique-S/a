import { Bookmark, ArrowUpRight, Play, Quote, Clock3, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useImpulso } from '../state';
import categories from '../data/categories.json';
import { FORMATS, mediaUrl } from '../lib/content.mjs';
import { formatIcons } from './Icons';

export default function ContentCard({ item, index = 0 }) {
  const { favorites, toggleFavorite } = useImpulso();
  const saved = favorites.includes(item.id);
  const category = categories.find((c) => c.id === item.category);
  const FormatIcon = formatIcons[item.type];
  const format = FORMATS.find((f) => f.id === item.type);
  return <motion.article layout className={`content-card content-card--${item.type}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .22, delay: Math.min(index, 5) * .035 }}>
    <Link className="content-card-link" to={`/conteudo/${item.id}`} aria-label={`Abrir ${format.singular.toLowerCase()}: ${item.title}`}>
      <div className={`card-art art-${index % 4}`}>
        <span className="format-stamp"><FormatIcon size={13} aria-hidden="true"/>{format.singular}</span>
        {item.type === 'phrase' && <><Quote className="quote-mark" size={32} aria-hidden="true"/><p className="card-quote">{item.title}</p><span className="quote-signature">um lembrete do impulso.</span></>}
        {item.type === 'video' && <><img src={mediaUrl(item.media.poster)} alt="" width="960" height="540" loading="lazy"/><span className="card-play"><Play size={22} fill="currentColor" aria-hidden="true"/></span><span className="video-duration">{item.media.duration}</span></>}
        {item.type === 'story' && <><span className="story-orbit" aria-hidden="true"/><span className="story-art-icon"><BookOpen size={38} strokeWidth={1.2} aria-hidden="true"/></span><p className="story-name">{item.media?.headline || item.title.split(':')[0].toUpperCase()}</p><span className="story-art-label">GENTE REAL. CAMINHOS QUE INSPIRAM.</span></>}
      </div>
      <div className="card-body">
        <span className="category-label">{category.name}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="card-meta"><span><Clock3 size={12} aria-hidden="true"/>{item.type === 'video' ? `${item.media.duration} de pausa` : `${item.readingMinutes} min de leitura`}</span><ArrowUpRight size={17} aria-hidden="true"/></div>
      </div>
    </Link>
    <button type="button" className={`favorite-button ${saved ? 'is-saved' : ''}`} onClick={() => toggleFavorite(item.id)} aria-pressed={saved} aria-label={`${saved ? 'Remover dos' : 'Salvar nos'} favoritos: ${item.title}`} title={saved ? 'Remover dos favoritos' : 'Salvar nos favoritos'}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true"/></button>
  </motion.article>;
}
