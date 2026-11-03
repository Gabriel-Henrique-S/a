import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Mascot from '../components/Mascot';

export default function NotFound({ content = false }) {
  return <div className="container not-found"><Mascot className="empty-mascot" decorative/><p className="eyebrow">ESSA ROTA PEDE UM RECOMEÇO.</p><h1>{content ? 'Esse impulso não está por aqui.' : 'Não encontramos essa página.'}</h1><p>Mas ainda tem muita inspiração esperando por você.</p><Link className="button button-primary" to="/explorar"><ArrowLeft size={18}/>Voltar para explorar</Link></div>;
}
