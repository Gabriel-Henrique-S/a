import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import contents from './data/contents.json';
import categories from './data/categories.json';
import { parseSelection, safeSelection, toggleSelection } from './lib/content.mjs';

const ImpulsoContext = createContext(null);
const categoryIds = categories.map((item) => item.id);
const contentIds = contents.filter((item) => item.status === 'published').map((item) => item.id);
export const STORAGE_KEYS = { interests: 'impulso:v1:interests', favorites: 'impulso:v1:favorites' };

function useStoredList(key, allowed) {
  const [items, setItems] = useState(() => {
    try { return parseSelection(localStorage.getItem(key), allowed); }
    catch { return []; }
  });
  const [available, setAvailable] = useState(true);
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(items)); setAvailable(true); }
    catch { setAvailable(false); }
  }, [key, items]);
  useEffect(() => {
    function sync(event) {
      if (event.key === key) setItems(parseSelection(event.newValue, allowed));
      if (event.key === null) setItems([]);
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [key, allowed]);
  return [items, setItems, available];
}

export function ImpulsoProvider({ children }) {
  const [interests, setInterests, interestsAvailable] = useStoredList(STORAGE_KEYS.interests, categoryIds);
  const [favorites, setFavorites, favoritesAvailable] = useStoredList(STORAGE_KEYS.favorites, contentIds);
  const [interestsOpen, setInterestsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const notify = useCallback((message) => setToast({ message, id: Date.now() }), []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const toggleFavorite = useCallback((id) => {
    if (!contentIds.includes(id)) return;
    const saved = favorites.includes(id);
    setFavorites((current) => toggleSelection(current, id));
    notify(saved ? 'Conteúdo removido dos favoritos.' : 'Pronto! Guardado nos seus favoritos.');
  }, [favorites, setFavorites, notify]);

  const saveInterests = useCallback((selected) => {
    setInterests(safeSelection(selected, categoryIds));
    setInterestsOpen(false);
    notify(selected.length ? 'Seu Impulso agora tem mais a sua cara.' : 'Interesses limpos. Vamos explorar de tudo um pouco.');
  }, [setInterests, notify]);

  const value = useMemo(() => ({
    interests, favorites, toggleFavorite, saveInterests, interestsOpen, setInterestsOpen,
    storageAvailable: interestsAvailable && favoritesAvailable, toast, dismissToast: () => setToast(null),
  }), [interests, favorites, toggleFavorite, saveInterests, interestsOpen, interestsAvailable, favoritesAvailable, toast]);
  return <ImpulsoContext.Provider value={value}>{children}</ImpulsoContext.Provider>;
}

export function useImpulso() {
  const value = useContext(ImpulsoContext);
  if (!value) throw new Error('useImpulso must be used inside ImpulsoProvider');
  return value;
}
