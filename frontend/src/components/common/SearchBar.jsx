import React from 'react';
import './SearchBar.css';

const SearchBar = ({ value, onChange, onSearch }) => (
  <div className="searchbar-input-box">
    <input
      className="searchbar-input"
      type="text"
      placeholder="Tìm kiếm"
      value={value}
      onChange={onChange}
    />
    <button
      className="searchbar-btn"
      onClick={e => {
        e.preventDefault();
        if (onSearch) onSearch();
      }}
      type="button"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="#2563eb" strokeWidth="2"/>
        <path d="M20 20L17 17" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </button>
  </div>
);

export default SearchBar; 