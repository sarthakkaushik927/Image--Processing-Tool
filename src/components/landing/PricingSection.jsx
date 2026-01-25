import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "Starter",
    price: "Free",
    desc: "For hobbyists.",
    features: ["5 Credits / Month", "Standard Speed", "720p Exports"],
    highlight: false
  },
  {
    name: "Creator",
    price: "$19",
    desc: "For power users.",
    features: ["Unlimited Credits", "Fast GPU Mode", "4K Exports", "Commercial License"],
    highlight: true 
  },
  {
    name: "Team",
    price: "$49",
    desc: "For agencies.",
    features: ["Everything in Creator", "API Access", "SSO Support", "Priority Support"],
    highlight: false
  }
];

export default function PricingSection() {
  return (
    <section className="relative z-10 py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple Pricing.</h2>
          <p className="text-gray-400">Start for free, upgrade when you go viral.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-[2rem] border backdrop-blur-xl ${
                plan.highlight 
                  ? 'bg-white/10 border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.2)] scale-105 z-10' 
                  : 'bg-black/40 border-white/10'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">{plan.price}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, k) => (
                  <li key={k} className="flex items-center gap-3 text-gray-300 text-sm">
                    <div className="p-1 rounded-full bg-white/10"><Check size={12} className="text-green-400" /></div>
                    {feat}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-xl font-bold transition-all ${
                plan.highlight ? 'bg-white text-black' : 'bg-white/5 text-white'
              }`}>
                Choose {plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}