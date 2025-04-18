import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

interface VoteBarProps {
  $width: number;
}

const VoteBar = styled.div<VoteBarProps>`
  width: ${props => props.$width}%;
  background-color: #3b82f6;
  height: 0.625rem;
  border-radius: 9999px;
`;

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

const PollView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const data = await api.getPoll(id!);
        setPoll(data);
        // Check if user has already voted using localStorage
        const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]');
        setHasVoted(votedPolls.includes(id));
      } catch (err) {
        console.log(err)
        setError('Failed to load poll');
      }
    };

    fetchPoll();
  }, [id]);

  const handleVote = async () => {
    if (!selectedOption) {
      setError('Please select an option');
      return;
    }

    try {
      await api.votePoll(id!, selectedOption);
      // Update voted polls in localStorage
      const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]');
      votedPolls.push(id);
      localStorage.setItem('votedPolls', JSON.stringify(votedPolls));
      
      // Refresh poll data
      const updatedPoll = await api.getPoll(id!);
      setPoll(updatedPoll);
      setHasVoted(true);
      setError('');
    } catch (err) {
      console.log(err)
      setError('Failed to submit vote');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const chartData = poll.options.map(option => ({
    name: option.text,
    votes: option.votes
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Go Back
        </button>

        <h1 className="text-2xl font-bold mb-6">{poll.question}</h1>
        
        {!hasVoted ? (
          <div className="space-y-4">
            <div className="space-y-2">
              {poll.options.map((option) => (
                <label
                  key={option._id}
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="pollOption"
                    value={option._id}
                    checked={selectedOption === option._id}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-3">{option.text}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleVote}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Vote
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {poll.options.map((option) => (
                <div
                  key={option._id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span>{option.text}</span>
                    <span className="text-gray-600">
                      {option.votes} votes
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <VoteBar $width={(option.votes / poll.totalVotes) * 100} />
                  </div>
                </div>
              ))}
              <div className="text-center text-gray-600 mt-4">
                Total votes: {poll.totalVotes}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Vote Distribution</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollView; 