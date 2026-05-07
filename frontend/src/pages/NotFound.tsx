import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/common/PageContainer';
import { Button } from '@/components/common/Button';

const NotFoundPage = () => (
  <PageContainer>
    <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
      <p className="text-sm text-slate-400">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">Page not found</h1>
      <p className="mt-2 text-sm text-slate-300">The route you requested does not exist in this cluster.</p>
      <Button className="mt-5"><Link to="/">Back to home</Link></Button>
    </div>
  </PageContainer>
);

export default NotFoundPage;
