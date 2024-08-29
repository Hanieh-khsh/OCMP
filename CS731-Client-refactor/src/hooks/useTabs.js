import { useState } from 'react';

const useTabs = (initialTab) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const changeTab = (tab) => setActiveTab(tab);

  return [activeTab, changeTab];
};

export default useTabs;
