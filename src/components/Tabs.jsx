import React, { useState } from 'react';
import './Tabs.css';

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const onClickTab = tab => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="tab-list">
        {children.map(child => {
          const { label } = child.props;
          return (
            <button
              key={label}
              className={`tab ${activeTab === label ? 'active' : ''}`}
              onClick={() => onClickTab(label)}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="tab-content">
        {children.map(child => {
          if (child.props.label !== activeTab) return undefined;
          return child.props.children;
        })}
      </div>
    </div>
  );
};

export default Tabs;
