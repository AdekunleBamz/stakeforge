import { useState, ReactNode, createContext, useContext } from 'react';
import './Accordion.css';

interface AccordionContextValue {
  expanded: string[];
  toggle: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

interface AccordionProps {
  children: ReactNode;
  defaultExpanded?: string[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  children,
  defaultExpanded = [],
  allowMultiple = false,
  className = ''
}: AccordionProps) {
  const [expanded, setExpanded] = useState<string[]>(defaultExpanded);

  const toggle = (id: string) => {
    setExpanded(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <AccordionContext.Provider value={{ expanded, toggle, allowMultiple }}>
      <div className={`accordion ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function AccordionItem({ id, children, className = '' }: AccordionItemProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionItem must be used within Accordion');
  
  const isExpanded = context.expanded.includes(id);
  
  return (
    <div className={`accordion__item ${isExpanded ? 'accordion__item--expanded' : ''} ${className}`}>
      {children}
    </div>
  );
}

interface AccordionTriggerProps {
  id: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function AccordionTrigger({ id, children, icon, className = '' }: AccordionTriggerProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used within Accordion');
  
  const isExpanded = context.expanded.includes(id);
  
  return (
    <button
      className={`accordion__trigger ${className}`}
      onClick={() => context.toggle(id)}
      aria-expanded={isExpanded}
      aria-controls={`accordion-content-${id}`}
    >
      {icon && <span className="accordion__trigger-icon">{icon}</span>}
      <span className="accordion__trigger-text">{children}</span>
      <svg 
        className={`accordion__chevron ${isExpanded ? 'accordion__chevron--rotated' : ''}`} 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M7 10l5 5 5-5z"/>
      </svg>
    </button>
  );
}

interface AccordionContentProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function AccordionContent({ id, children, className = '' }: AccordionContentProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used within Accordion');
  
  const isExpanded = context.expanded.includes(id);
  
  return (
    <div 
      id={`accordion-content-${id}`}
      className={`accordion__content ${isExpanded ? 'accordion__content--expanded' : ''} ${className}`}
      role="region"
      aria-labelledby={id}
      hidden={!isExpanded}
    >
      <div className="accordion__content-inner">
        {children}
      </div>
    </div>
  );
}
