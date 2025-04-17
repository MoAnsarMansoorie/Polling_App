import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { Poll } from '@/types/poll';

export default function PollsList() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [votedPolls, setVotedPolls] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    loadPolls();
    const voted = JSON.parse(localStorage.getItem('votedPolls') || '{}');
    setVotedPolls(voted);
  }, []);

  const loadPolls = async () => {
    try {
      const data = await api.getPolls();
      setPolls(data);
    } catch (error) {
      console.error('Error loading polls:', error);
    }
  };

  const handleVote = async (pollId: string) => {
    try {
      if (votedPolls[pollId]) {
        alert('You have already voted on this poll');
        return;
      }

      const optionId = selectedOptions[pollId];
      const response = await api.votePoll(pollId, optionId);
      
      if (response.message) {
        alert(response.message);
        return;
      }

      const newVotedPolls = { ...votedPolls, [pollId]: true };
      localStorage.setItem('votedPolls', JSON.stringify(newVotedPolls));
      setVotedPolls(newVotedPolls);
      
      navigate(`/results/${pollId}`);
    } catch (error) {
      console.error('Error voting:', error);
      alert('An error occurred while voting');
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Available Polls
      </h1>
      
      {polls.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-6">
          No polls available at the moment
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {polls.map((poll) => (
            <Card 
              key={poll._id} 
              className="shadow-sm hover:shadow-md transition-all duration-200 bg-white"
            >
              <CardHeader className="text-center py-3 px-4 border-b relative">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {poll.question}
                </h2>
                {votedPolls[poll._id] && (
                  <div className="absolute top-2 right-2 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                    Voted
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4">
                <RadioGroup
                  className="space-y-2"
                  value={selectedOptions[poll._id]}
                  onValueChange={(value) => 
                    setSelectedOptions({...selectedOptions, [poll._id]: value})
                  }
                  disabled={votedPolls[poll._id]}
                >
                  {poll.options.map((option) => (
                    <div 
                      key={option._id} 
                      className={`flex items-center space-x-2 p-2 rounded 
                        ${!votedPolls[poll._id] ? 'hover:bg-gray-50' : ''} 
                        transition-colors`}
                    >
                      <RadioGroupItem 
                        value={option._id} 
                        id={option._id}
                        className="w-4 h-4"
                        disabled={votedPolls[poll._id]}
                      />
                      <Label 
                        htmlFor={option._id} 
                        className={`text-sm cursor-pointer w-full 
                          ${votedPolls[poll._id] ? 'text-gray-500' : 'text-gray-700'}`}
                      >
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="flex justify-center mt-4">
                  {votedPolls[poll._id] ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-4 py-1 min-w-[80px]"
                      onClick={() => navigate(`/results/${poll._id}`)}
                    >
                      See Results
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="px-4 py-1 min-w-[80px]"
                      onClick={() => handleVote(poll._id)}
                      disabled={!selectedOptions[poll._id]}
                    >
                      Vote
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}