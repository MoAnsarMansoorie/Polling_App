import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../lib/api';
import { Poll } from '@/types/poll';
import EditPoll from './Editpoll';

export default function AdminDashboard() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '', '', '']
  });
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    try {
      const data = await api.getPolls();
      setPolls(data);
    } catch (error) {
      console.error('Error loading polls:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoll.question.trim()) {
      alert('Please enter a question');
      return;
    }
    const validOptions = newPoll.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please enter at least 2 options');
      return;
    }
    try {
      await api.createPoll({
        question: newPoll.question,
        options: validOptions
      });
      setNewPoll({ question: '', options: ['', '', '', ''] });
      loadPolls();
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this poll?')) return;
    try {
      await api.deletePoll(id);
      loadPolls();
    } catch (error) {
      console.error('Error deleting poll:', error);
    }
  };

  const handleUpdate = async (updatedPoll: Poll) => {
    try {
      await api.updatePoll(updatedPoll._id, {
        question: updatedPoll.question,
        options: updatedPoll.options
      });
      loadPolls();
    } catch (error) {
      console.error('Error updating poll:', error);
    }
  };

  const handleViewChart = (poll: Poll) => {
    setSelectedPoll(selectedPoll?._id === poll._id ? null : poll);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Poll Administration</h1>
      
      <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center">Create New Poll</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question</label>
              <Input
                className="text-lg"
                placeholder="Enter your poll question"
                value={newPoll.question}
                onChange={(e) => setNewPoll({
                  ...newPoll,
                  question: e.target.value
                })}
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium">Options</label>
              {newPoll.options.map((option, index) => (
                <Input
                  key={index}
                  className="text-base"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newPoll.options];
                    newOptions[index] = e.target.value;
                    setNewPoll({ ...newPoll, options: newOptions });
                  }}
                />
              ))}
            </div>
            
            <div className="flex justify-center pt-4">
              <Button type="submit" className="px-8 py-2 text-lg">
                Create Poll
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {polls.map((poll) => (
          <Card key={poll._id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold mb-4">{poll.question}</h3>
              
              {selectedPoll?._id === poll._id ? (
                <div className="mb-4 h-[300px] bg-gray-50 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={poll.options}>
                      <XAxis dataKey="text" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="votes" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {poll.options.map(option => (
                    <div 
                      key={option._id} 
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                    >
                      <span className="text-gray-700">{option.text}</span>
                      <span className="font-semibold text-blue-600">
                        {option.votes} votes
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-center gap-3 mt-6">
                <EditPoll poll={poll} onUpdate={handleUpdate} />
                <Button 
                  variant="outline"
                  onClick={() => handleViewChart(poll)}
                  className="min-w-[120px]"
                >
                  {selectedPoll?._id === poll._id ? 'Hide Chart' : 'View Chart'}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(poll._id)}
                  className="min-w-[100px]"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}