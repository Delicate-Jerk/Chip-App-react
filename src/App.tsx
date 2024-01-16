import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import './ChipInput.css';

interface Chip {
  id: string;
  label: string;
}

const ChipInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [chips, setChips] = useState<Chip[]>([]);
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [highlightedChip, setHighlightedChip] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = ['Nick Giannopoulos', 'John Doe', 'Jane Doe', 'Alice', 'Bob'];

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      setFilteredItems([]);
    } else {
      const filtered = items.filter(item => item.toLowerCase().includes(value.toLowerCase()));
      setFilteredItems(filtered);
    }
  };

  const handleItemClick = (item: string) => {
    setChips(prevChips => [...prevChips, { id: item, label: item }]);
    setInputValue('');
    setFilteredItems(filteredItems.filter(i => i !== item));
  };

  const handleChipRemove = () => {
    if (highlightedChip) {
      setChips(prevChips => prevChips.filter(chip => chip.id !== highlightedChip));
      setFilteredItems(prevItems => [...prevItems, highlightedChip]);
      setHighlightedChip(null);
    } else if (chips.length > 0) {
      const lastChip = chips[chips.length - 1];
      setHighlightedChip(lastChip.id);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && inputValue === '') {
      handleChipRemove();
    }
  };

  const handleChipClick = (chipId: string) => {
    setHighlightedChip(chipId);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chips]);

  return (
    <div className="chip-input-container">
      <div className="chips-container">
        {chips.map(chip => (
          <div
            key={chip.id}
            className={`chip ${highlightedChip === chip.id ? 'highlighted' : ''}`}
            onClick={() => handleChipClick(chip.id)}
          >
            {chip.label}
            <span className="remove-icon" onClick={() => handleChipRemove()}>
              X
            </span>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Type to search..."
        />
      </div>
      <ul className="item-list">
        {filteredItems.map(item => (
          <li key={item} onClick={() => handleItemClick(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChipInput;
