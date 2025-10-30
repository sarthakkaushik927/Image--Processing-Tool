import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Search, FileText, Repeat, RefreshCw, Wand2, Sun, Crop, Star
} from 'lucide-react';
// Assuming ToolCard is imported from MainView utilities if needed, 
// but defining it locally for simplicity in this utility file:

// --- Helper Component: ToolCard ---
function ToolCard({ icon, title, onClick }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={onClick}
            className="bg-[#1f1f3d]/50 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center gap-4 aspect-square cursor-pointer transition-all border-2 border-transparent hover:border-purple-500"
        >
            <div className="text-purple-400 flex flex-col items-center justify-center">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-white text-center">{title}</h3>
        </motion.div>
    );
}

// =======================================================================
// Tools Navigation Hub
// =======================================================================
export default function ToolsView({ setPage }) {
    
    return (
        <motion.div
            key="tools-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-0 md:p-0 text-white"
        >
            {/* Back button */}
            <button onClick={() => setPage(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <ArrowLeft size={18} /> Back to Home
            </button>

            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-bold text-center">Tools</h2>
                <span className="bg-purple-600/50 text-purple-300 border border-purple-400 rounded-full px-4 py-1 text-sm font-semibold">
                    Special Features
                </span>
            </div>

            {/* Tools Grid (3x3 layout) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 ">
                
                {/* Row 1 */}
                <ToolCard
                    icon={<Search size={48} />}
                    title="Find Object"
                    onClick={() => setPage('find-object')}
                />
                <ToolCard
                    icon={<FileText size={48} />}
                    title="Text Extractor"
                    onClick={() => setPage('text-extractor')}
                />
                <ToolCard
                    icon={<Repeat size={48} />}
                    title="Converter"
                    onClick={() => setPage('format-converter')}
                />

                {/* Row 2 */}
                <ToolCard
                    icon={<Wand2 size={48} />}
                    title="Magic Brush"
                    onClick={() => setPage('magic-brush')}
                />
                <ToolCard
                    icon={<Sun size={48} />}
                    title="Adjustments"
                    onClick={() => setPage('adjustments')} 
                />
                 <ToolCard
                    icon={<Star size={48} />}
                    title="Sharpness" // Links to the same adjustments page
                    onClick={() => setPage('adjustments')} 
                />

                {/* Row 3 */}
                <ToolCard
                    icon={<Crop size={48} />}
                    title="Crop"
                    onClick={() => setPage('crop')}
                />
                <ToolCard
                    icon={<Repeat size={48} className="rotate-90" />}
                    title="Angle Slider"
                    onClick={() => setPage('angle-slider')}
                />
                 <ToolCard
                    icon={<RefreshCw size={48} />}
                    title="Filter Effects" // Placeholder for potential future dedicated filter component
                    onClick={() => setPage('adjustments')} 
                />

            </div>
        </motion.div>
    );
}
