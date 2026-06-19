import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const STAGES = ['New Lead', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Negotiation', 'Converted', 'Lost'];

export default function LeadPipeline() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    setLeads(prev => prev.map(lead => 
      lead._id === draggableId ? { ...lead, status: newStatus } : lead
    ));

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/leads/${draggableId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to update status', err);
      fetchLeads(); // Revert on failure
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center"><div className="loader"></div></div>;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center flex-shrink-0">
        <h1 className="text-2xl font-bold">Sales Pipeline</h1>
        <button className="btn-primary">Add New Lead</button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full items-start w-max">
            {STAGES.map(stage => {
              const stageLeads = leads.filter(l => l.status === stage);
              return (
                <div key={stage} className="w-80 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-semibold text-slate-200">{stage}</h3>
                    <span className="bg-slate-800 text-xs px-2 py-1 rounded-full text-slate-400 font-medium">
                      {stageLeads.length}
                    </span>
                  </div>
                  
                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 glass-panel p-3 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? 'bg-card/90 ring-1 ring-primary/50' : ''}`}
                      >
                        {stageLeads.map((lead, index) => (
                          <Draggable key={lead._id} draggableId={lead._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-slate-800 border border-white/5 rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-shadow ${snapshot.isDragging ? 'shadow-xl ring-1 ring-primary/50 scale-105 opacity-90' : ''}`}
                                style={provided.draggableProps.style}
                              >
                                <h4 className="font-semibold text-slate-200 mb-1">{lead.name}</h4>
                                <p className="text-xs text-slate-400 mb-3">{lead.company || lead.email}</p>
                                <div className="flex justify-between items-center">
                                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-sm ${lead.priority === 'High' ? 'bg-red-500/20 text-red-400' : lead.priority === 'Low' ? 'bg-slate-700 text-slate-300' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {lead.priority}
                                  </span>
                                  {lead.budget && <span className="text-xs font-medium text-emerald-400">{lead.budget}</span>}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
