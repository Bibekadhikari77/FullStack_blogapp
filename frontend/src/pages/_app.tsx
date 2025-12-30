import '@/styles/globals.css';
import 'react-quill/dist/quill.snow.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </Layout>
    </AuthProvider>
  );
}
