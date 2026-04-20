import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, PlusCircle } from 'lucide-react';

export interface RoomType {
  type: string;
  priceAddon: number;
}

interface RoomTypeEditorProps {
  roomTypes: RoomType[];
  onChange: (roomTypes: RoomType[]) => void;
  basePriceUSD: number;
}

export function RoomTypeEditor({ roomTypes, onChange, basePriceUSD }: RoomTypeEditorProps) {
  const [newType, setNewType] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleAdd = () => {
    if (newType.trim()) {
      const price = parseFloat(newPrice) || 0;
      onChange([...roomTypes, { type: newType.trim(), priceAddon: price }]);
      setNewType('');
      setNewPrice('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(roomTypes.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4 items-end">
        <div className="col-span-6 md:col-span-5 space-y-2">
          <Label>Room Type Name</Label>
          <Input 
            placeholder="e.g. Dormitory, Glamping..." 
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
          />
        </div>
        <div className="col-span-6 md:col-span-4 space-y-2">
          <Label>Price Add-on (USD)</Label>
          <Input 
            type="number"
            placeholder="0" 
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <Button type="button" variant="secondary" className="w-full" onClick={handleAdd} disabled={!newType.trim()}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add Room
          </Button>
        </div>
      </div>

      <div className="border rounded-md divide-y overflow-hidden">
        <div className="bg-slate-50 p-3 grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-5">Room Type</div>
          <div className="col-span-3 text-right">Add-on</div>
          <div className="col-span-3 text-right">Total Price</div>
          <div className="col-span-1"></div>
        </div>
        
        {roomTypes.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">
            No room types added. Consider adding Shared and Private.
          </div>
        ) : (
          roomTypes.map((room, index) => (
            <div key={index} className="p-3 grid grid-cols-12 gap-4 items-center bg-white">
              <div className="col-span-5 font-medium">{room.type}</div>
              <div className="col-span-3 text-right text-slate-600">+${room.priceAddon}</div>
              <div className="col-span-3 text-right font-semibold text-primary">
                ${basePriceUSD + room.priceAddon}
              </div>
              <div className="col-span-1 flex justify-end">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemove(index)}
                  className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
