import PageHeading from '../components/PageHeading';
import { NotFoundState } from '../components/StateViews';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Сторінку не знайдено');

  return (
    <div className="not-found">
      <PageHeading>Сторінку не знайдено</PageHeading>
      <NotFoundState title="Такої адреси в застосунку немає" to="/" linkLabel="На головну">
        Перевірте посилання або почніть з головної.
      </NotFoundState>
    </div>
  );
}
