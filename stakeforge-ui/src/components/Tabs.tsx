import { useState, ReactNode, createContext, useContext } from 'react';
import './Tabs.css';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: 'default' | 'pills' | 'underline';
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  children: ReactNode;
  defaultTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  className?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({
  children,
  defaultTab,
  variant = 'default',
  fullWidth = false,
  className = '',
  onChange
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || '');

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  const classes = [
    'tabs',
    `tabs--${variant}`,
    fullWidth && 'tabs--full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange, variant }}>
      <div className={classes}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: ReactNode;
  className?: string;
}

export function TabList({ children, className = '' }: TabListProps) {
  return (
    <div className={`tabs__list ${className}`} role="tablist">
      {children}
    </div>
  );
}

interface TabProps {
  id: string;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tab({ id, children, icon, disabled = false, className = '' }: TabProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');
  
  const { activeTab, setActiveTab, variant } = context;
  const isActive = activeTab === id;

  const classes = [
    'tabs__tab',
    `tabs__tab--${variant}`,
    isActive && 'tabs__tab--active',
    disabled && 'tabs__tab--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(id)}
    >
      {icon && <span className="tabs__tab-icon">{icon}</span>}
      {children}
    </button>
  );
}

interface TabPanelProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ id, children, className = '' }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');
  
  const { activeTab } = context;
  const isActive = activeTab === id;

  if (!isActive) return null;

  return (
    <div 
      className={`tabs__panel ${className}`}
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={id}
    >
      {children}
    </div>
  );
}
