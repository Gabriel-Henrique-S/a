import { useEffect, useRef, useState } from 'react';
import { Check, ArrowRight, X, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import categories from '../data/categories.json';
import { useImpulso } from '../state';
import { toggleSelection } from '../lib/content.mjs';
import { categoryIcons } from './Icons';

export default function InterestDialog() {
  const { interests, interestsOpen, setInterestsOpen, saveInterests, storageAvailable } = useImpulso();
  const [selected, setSelected] = useState(interests);
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    if (interestsOpen) {
      setSelected(interests);
      if (!element.open) element.showModal();
      document.body.classList.add('dialog-open');
    } else {
      if (element.open) element.close();
      document.body.classList.remove('dialog-open');
    }
    return () => document.body.classList.remove('dialog-open');
  }, [interestsOpen, interests]);
  return <dialog ref={dialog} className="interest-dialog" aria-labelledby="interests-title" onClose={() => setInterestsOpen(false)} onClick={(event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) setInterestsOpen(false);
  }}>
    <button className="dialog-close" type="button" onClick={() => setInterestsOpen(false)} aria-label="Fechar interesses"><X size={20}/></button>
    <span className="dialog-symbol"><SlidersHorizontal size={24}/></span>
    <p className="eyebrow">DO SEU JEITO</p>
    <h2 id="interests-title">O que te move<br/>neste momento?</h2>
    <p className="dialog-description">Escolha os temas que fazem sentido para você. A gente dá prioridade a eles no seu feed.</p>
    <div className="interest-choices">{categories.map((category) => {
      const Icon = categoryIcons[category.icon];
      const active = selected.includes(category.id);
      return <button type="button" key={category.id} aria-pressed={active} className={active ? 'selected' : ''} onClick={() => setSelected((current) => toggleSelection(current, category.id))}><Icon size={21}/><span>{category.name}</span><span className="selection-check">{active && <Check size={13}/>}</span></button>;
    })}</div>
    <div className="interests-selection"><span>{selected.length ? `${selected.length} ${selected.length === 1 ? 'tema escolhido' : 'temas escolhidos'}` : 'Você também pode explorar todos os temas.'}</span>{selected.length > 0 && <button type="button" onClick={() => setSelected([])}>Limpar</button>}</div>
    <button className="button button-primary w-full" type="button" onClick={() => saveInterests(selected)}>Salvar minhas escolhas<ArrowRight size={18}/></button>
    <p className="privacy-note"><ShieldCheck size={15}/>{storageAvailable ? 'Sem conta. Suas escolhas ficam só neste navegador.' : 'O navegador bloqueou o armazenamento. Suas escolhas ficam nesta aba.'}</p>
  </dialog>;
}
