import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Poll } from '../types/poll';

interface EditPollProps {
  poll: Poll;
  onUpdate: (updatedPoll: Poll) => void;
}

export default function EditPoll({ poll, onUpdate }: EditPollProps) {
  const [editedPoll, setEditedPoll] = useState(poll);
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    onUpdate(editedPoll);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Poll</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Poll</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            value={editedPoll.question}
            onChange={(e) => setEditedPoll({
              ...editedPoll,
              question: e.target.value
            })}
            placeholder="Poll question"
          />
          {editedPoll.options.map((option, index) => (
            <Input
              key={option._id}
              value={option.text}
              onChange={(e) => {
                const newOptions = [...editedPoll.options];
                newOptions[index] = { ...option, text: e.target.value };
                setEditedPoll({ ...editedPoll, options: newOptions });
              }}
              placeholder={`Option ${index + 1}`}
            />
          ))}
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}