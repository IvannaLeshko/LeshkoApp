import { useFavorites } from '../hooks/useFavorites';
import { StarIcon } from './Icons';

/** Одна й та сама кнопка на картці каталогу та на сторінці деталей: стан бере зі спільного контексту. */
export default function FavoriteButton({ item, withLabel = false, className = '' }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(item.id);

  return (
    <button
      type="button"
      className={`favorite-button${active ? ' is-active' : ''}${withLabel ? ' favorite-button--labeled' : ''} ${className}`.trim()}
      aria-pressed={active}
      aria-label={withLabel ? undefined : `${active ? 'Прибрати з обраного' : 'Додати в обране'}: ${item.name}`}
      onClick={() => toggle(item)}
    >
      <StarIcon filled={active} />
      {withLabel && <span>{active ? 'В обраному' : 'В обране'}</span>}
    </button>
  );
}
