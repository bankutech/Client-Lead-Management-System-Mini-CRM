import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/leads/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <div className="flex h-full items-center justify-center"><div className="loader"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Leads" value={analytics.stats.total} icon={<Users />} color="text-primary" bg="bg-primary/20" />
        <StatCard title="New Leads" value={analytics.stats.newLeads} icon={<Activity />} color="text-blue-400" bg="bg-blue-400/20" />
        <StatCard title="Converted" value={analytics.stats.converted} icon={<Target />} color="text-accent" bg="bg-accent/20" />
        <StatCard title="Conversion Rate" value={`${analytics.stats.conversionRate}%`} icon={<TrendingUp />} color="text-warning" bg="bg-warning/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 h-96">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Leads by Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.statusDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="_id" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{backgroundColor: '#1E293B', borderColor: '#ffffff20'}} />
              <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel p-6 h-96">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Lead Sources</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analytics.sourceDistribution}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
              >
                {analytics.sourceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{backgroundColor: '#1E293B', borderColor: '#ffffff20'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-panel p-6 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
      </div>
    </motion.div>
  );
}
