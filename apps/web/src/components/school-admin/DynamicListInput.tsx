import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DynamicListInputProps {
  label: string;
  placeholder?: string;
  items: string[];
  onChange: (items: string[]) => void;
  maxItems?: number;
}

export function DynamicListInput({ 
  label, 
  placeholder = "Add item...", 
  items, 
  onChange, 
  maxItems = 10 
}: DynamicListInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && items.length < maxItems && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    onChange(items.filter((_, i) => i !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddItem(e);
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label} {items.length >= maxItems && <span className="text-red-500 text-xs">(Max reached)</span>}</Label>
      
      <div className="flex gap-2">
        <Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={items.length >= maxItems}
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleAddItem}
          disabled={!inputValue.trim() || items.length >= maxItems}
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add
        </Button>
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200">
              {item}
              <button 
                type="button" 
                onClick={() => handleRemoveItem(index)}
                className="ml-2 text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
