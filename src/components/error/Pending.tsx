import { motion } from 'framer-motion';

export default function Pending() {
    return (
        <div className="text-center max-w-6xl mx-6">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary text-xl md:text-3xl font-bold mt-6"
            >
                Memuat...
            </motion.h1>
        </div>
    );
}