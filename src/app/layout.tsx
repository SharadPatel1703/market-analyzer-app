import './globals.css';
import Navbar  from '@/components/shared/navbar';
import { ModalProvider } from '@/contexts/modal-context';
import { ToastProvider } from '@/contexts/toast-context';
import ErrorBoundary from "@/components/error-boundary";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <ErrorBoundary>
        <ToastProvider>
            <ModalProvider>
                <Navbar />
                <main className="min-h-screen bg-gray-50">
                    {children}
                </main>
            </ModalProvider>
        </ToastProvider>
        </ErrorBoundary>
        </body>
        </html>
    );
}

export const metadata = {
    title: 'Market Research Analyzer',
    description: 'Analyze and track competitor data and market trends',
};