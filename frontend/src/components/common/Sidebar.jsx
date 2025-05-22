import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, menuItems, onProfileClick }) => {
  return (
    <div className="sidebar">
      <nav className="menu">
        {menuItems.map(item => {
          if (item.isProfile) {
            return (
              <div
                key={item.id}
                className="menu-item"
                onClick={onProfileClick}
              >
                <div className="icon avatar">
                  <span>T</span>
                </div>
                <div className="user-info">
                  <h2>{item.label}</h2>
                  <p>{item.subLabel}</p>
                </div>
              </div>
            );
          }
          return (
            <div
              key={item.id}
              className={`menu-item ${activeTab === item.id ? 'active' : ''} ${item.color}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar; 