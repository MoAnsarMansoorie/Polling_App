import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../lib/api';
import EditPoll from './Editpoll';

interface Option {
  _id: string;
  text: string;
  votes: number;
}

interface Poll {
  _id: string;
  question: string;
  options: Option[];
}

export default function Dashboard() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '', '', '']
  });
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
      return;
    }
    loadPolls();
  }, [navigate]);

  const loadPolls = async () => {
    try {
      const data = await api.getPolls();
      setPolls(data);
    } catch (error) {
      setError('Failed to load polls');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoll.question.trim()) {
      setError('Please enter a question');
      return;
    }
    const validOptions = newPoll.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      setError('Please enter at least 2 options');
      return;
    }
    try {
      await api.createPoll({
        question: newPoll.question,
        options: validOptions
      });
      setNewPoll({ question: '', options: ['', '', '', ''] });
      setError('');
      loadPolls();
    } catch (error) {
      setError('Failed to create poll');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this poll?')) return;
    try {
      await api.deletePoll(id);
      loadPolls();
    } catch (error) {
      setError('Failed to delete poll');
    }
  };

  const handleUpdate = async (updatedPoll: Poll) => {
    try {
      await api.updatePoll(updatedPoll._id, {
        question: updatedPoll.question,
        options: updatedPoll.options.map(opt => opt.text)
      });
      loadPolls();
    } catch (error) {
      setError('Failed to update poll');
    }
  };

  const handleViewChart = (poll: Poll) => {
    setSelectedPoll(selectedPoll?._id === poll._id ? null : poll);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Poll Administration</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}
      
      <Card className="mb-8">
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

      <div className="space-y-6">
        {polls.map((poll) => (
          <Card key={poll._id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold">{poll.question}</h3>
                <div className="flex space-x-2">
                  <EditPoll poll={poll} onUpdate={handleUpdate} />
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDelete(poll._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              
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
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => handleViewChart(poll)}
                >
                  {selectedPoll?._id === poll._id ? 'Hide Chart' : 'View Chart'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}