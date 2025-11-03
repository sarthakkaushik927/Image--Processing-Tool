import React from 'react';
import { 
  Crop, Repeat, Wand2, FileText, 
  Search, Sun 
} from 'lucide-react';

export const toolsData = [
  {
    title: 'Image Adjustments',
    description: 'Fine-tune brightness, contrast, saturation, and more.',
    page: 'adjustments',
    icon: <Sun size={32} />,
    type: 'featured'
  },
  {
    title: 'Crop',
    description: 'Cut and resize your image.',
    page: 'crop',
    icon: <Crop size={32} />,
    type: 'standard'
  },
  {
    title: 'Converter',
    description: 'Convert to JPG, PNG, WEBP.',
    page: 'format-converter',
    icon: <Repeat size={32} />,
    type: 'standard'
  },
  {
    title: 'Magic Brush',
    description: 'Remove any background.',
    page: 'magic-brush',
    icon: <Wand2 size={32} />,
    type: 'standard'
  },
  {
    title: 'Text Extractor',
    description: 'Pull text from any image.',
    page: 'text-extractor',
    icon: <FileText size={32} />,
    type: 'standard'
  },
  {
    title: 'Find Object',
    description: 'Detect objects in your photo.',
    page: 'find-object',
    icon: <Search size={32} />,
    type: 'standard'
  },
  {
    title: 'Angle Slider',
    description: 'Straighten and rotate.',
    page: 'angle-slider',
    icon: <Repeat size={32} className="rotate-90" />,
    type: 'standard'
  }
];