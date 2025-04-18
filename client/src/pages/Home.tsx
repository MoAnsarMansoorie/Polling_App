import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

interface Poll {
  _id: string;
  question: string;
  options: Array<{
    _id: string;
    text: string;
    votes: number;
  }>;
  totalVotes: number;
}

const Home = () => {
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
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Active Polls</h1>
      <div className="grid gap-6">
        {polls.map((poll) => (
          <div
            key={poll._id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-4">{poll.question}</h2>
            <div className="space-y-2 mb-4">
              {poll.options.map((option) => (
                <div
                  key={option._id}
                  className="flex justify-between items-center"
                >
                  <span>{option.text}</span>
                  <span className="text-gray-600">
                    {option.votes} votes
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Total votes: {poll.totalVotes}
              </span>
              <Link
                to={`/poll/${poll._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Vote Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 