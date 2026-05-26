import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface ErrorPageProps {
    error?: Error;
    resetError?: () => void;
}

export default function ErrorPage({ error, resetError }: ErrorPageProps) {
    const handleRefresh = () => {
        if (resetError) {
            resetError();
        } else {
            window.location.reload();
        }
    };

    return (
        <div className="text-center max-w-6xl mx-6 md:mx-auto my-12">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary text-xl md:text-3xl font-bold mt-6"
            >
                Terjadi Kesalahan
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-muted-foreground text-sm md:text-base mt-3"
            >
                Maaf, terjadi kesalahan saat memuat halaman ini.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
            >
                <Button onClick={handleRefresh}>
                    Muat Ulang Halaman
                </Button>
            </motion.div>
        </div>
    );
}