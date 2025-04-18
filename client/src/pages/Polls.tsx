import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

interface Poll {
  _id: string;
  question: string;
  totalVotes: number;
}

const Polls = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const data = await api.getPolls();
        setPolls(data);
      } catch (err) {
        console.log(err)
        setError('Failed to load polls');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Active Polls</h1>
        <div className="space-y-4">
          {polls.map((poll) => (
            <Link
              key={poll._id}
              to={`/poll/${poll._id}`}
              className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{poll.question}</h2>
              <p className="text-gray-600">
                {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'}
              </p>
            </Link>
          ))}
          {polls.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No active polls available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Polls;