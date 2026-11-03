import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Bookmark, Clock3, Link2, Lightbulb } from 'lucide-react';
import contents from '../data/contents.json';
import categories from '../data/categories.json';
import { mediaUrl, safeEmbed, recommend } from '../lib/content.mjs';
import { useImpulso } from '../state';
import { formatIcons } from '../components/Icons';
import Feed from '../components/Feed';
import NotFound from './NotFound';

function VideoPlayer({ item }) {
  const embed = safeEmbed(item.media);
  if (item.media.kind === 'embed' && !embed) return <p className="unavailable-media">Este vídeo está indisponível no momento. O texto do conteúdo continua abaixo.</p>;
  return <div className="video-player">{embed ? <iframe src={embed} title={item.title} allow="fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/> : <video controls playsInline preload="metadata" poster={mediaUrl(item.media.poster)} aria-label={item.title}><source src={mediaUrl(item.media.src)} type="video/mp4"/>{item.media.captions && <track kind="captions" src={mediaUrl(item.media.captions)} srcLang="pt-BR" label="Português"/>}Seu navegador não conseguiu reproduzir o vídeo.</video>}</div>;
}

export default function Content() {
  const { id } = useParams();
  const item = contents.find((content) => content.id === id && content.status === 'published');
  const { favorites, toggleFavorite, interests } = useImpulso();
  useEffect(() => { document.title = item ? `${item.title} — Impulso` : 'Conteúdo não encontrado — Impulso'; }, [item]);
  if (!item) return <NotFound content/>;
  const category = categories.find((c) => c.id === item.category);
  const Icon = formatIcons[item.type];
  const saved = favorites.includes(item.id);
  const related = recommend(contents.filter((c) => c.id !== item.id), [item.category, ...interests], categories).slice(0, 3);
  return <>
    <article className={`container detail-page detail-${item.type}`}>
      <Link className="back-link" to="/explorar"><ArrowLeft size={16}/>Voltar para explorar</Link>
      <div className="detail-heading"><div className="detail-tags"><span className="detail-format"><Icon size={14}/>{item.type === 'phrase' ? 'Frase' : item.type === 'story' ? 'História real' : 'Vídeo original'}</span><Link to={`/explorar?categoria=${category.id}`}>{category.name}<ArrowUpRight size={13}/></Link></div><h1>{item.title}</h1><p>{item.description}</p><div className="detail-byline"><span>{item.author}</span><span><Clock3 size={14}/>{item.type === 'video' ? item.media.duration : `${item.readingMinutes} min de leitura`}</span><button className={`detail-save ${saved ? 'is-saved' : ''}`} type="button" onClick={() => toggleFavorite(item.id)} aria-pressed={saved}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'}/>{saved ? 'Salvo nos favoritos' : 'Guardar este impulso'}</button></div></div>
      {item.type === 'video' && <VideoPlayer key={item.id} item={item}/>}
      <div className="detail-reading"><div className="article-body">{item.type === 'phrase' && <blockquote><span aria-hidden="true">“</span>{item.body[0]}</blockquote>}{item.body.slice(item.type === 'phrase' ? 1 : 0).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<aside className="reflection-box"><Lightbulb size={24}/><div><span>LEVE ESSA IDEIA COM VOCÊ</span><h2>{item.prompt}</h2></div></aside><div className="source-box"><Link2 size={18}/><div><h2>{item.source.kind === 'external' ? 'Créditos e fonte' : 'Conteúdo autoral'}</h2><p>{item.source.kind === 'external' ? 'Síntese editorial do Impulso. Consulte a fonte para conhecer a história completa.' : 'Produzido para o Impulso. Uma ideia para refletir, sem regras sobre como você deve se sentir.'}</p>{item.source.url ? <a href={item.source.url} target="_blank" rel="noopener noreferrer">{item.source.label}<ArrowUpRight size={14}/><span className="sr-only"> (abre em outra aba)</span></a> : <span className="original-credit">{item.source.label}</span>}</div></div></div></div>
    </article>
    <section className="container related-section" aria-labelledby="related-title"><div className="section-heading"><div><p className="eyebrow">MAIS UM POUCO DE INSPIRAÇÃO</p><h2 id="related-title">Continue no seu ritmo.</h2></div><Link className="text-link" to="/explorar">Ver tudo<ArrowUpRight size={17}/></Link></div><Feed items={related}/></section>
  </>;
}
