import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../lib/api';
import { Poll } from '../types/poll';

export default function PollResults() {
  const { pollId } = useParams();
  const [poll, setPoll] = useState<Poll | null>(null);

  useEffect(() => {
    if (pollId) {
      loadPollResults(pollId);
    }
  }, [pollId]);

  const loadPollResults = async (id: string) => {
    try {
      const data = await api.getPoll(id);
      setPoll(data);
    } catch (error) {
      console.error('Error loading poll results:', error);
    }
  };

  if (!poll) return <div>Loading...</div>;

  const chartData = poll.options.map(option => ({
    name: option.text,
    votes: option.votes
  }));

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">{poll.question}</h1>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votes" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}