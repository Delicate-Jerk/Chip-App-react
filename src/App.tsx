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
    if (event.key === 'Enter') {
      const trimmedValue = inputValue.trim();
      if (trimmedValue !== '') {
        if (items.includes(trimmedValue)) {
          handleItemClick(trimmedValue);
        } else if (filteredItems.length > 0 && highlightedChip !== null) {
          handleItemClick(filteredItems[0]); // Add the first suggestion on Enter
        }
      }
    } else if (event.key === 'Backspace' && inputValue === '') {
      handleChipRemove();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      handleArrowKeyPress(event.key);
    }
  };

  const handleArrowKeyPress = (key: string) => {
    const currentHighlightedIndex = filteredItems.indexOf(highlightedChip || '');
    let newIndex;

    if (key === 'ArrowUp') {
      newIndex = currentHighlightedIndex > 0 ? currentHighlightedIndex - 1 : filteredItems.length - 1;
    } else {
      newIndex = currentHighlightedIndex < filteredItems.length - 1 ? currentHighlightedIndex + 1 : 0;
    }

    setHighlightedChip(filteredItems[newIndex]);
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
      <div className="suggestion-list">
        <ul className="item-list">
          {filteredItems.map(item => (
            <li key={item} className={highlightedChip === item ? 'highlighted' : ''} onClick={() => handleItemClick(item)}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChipInput;
