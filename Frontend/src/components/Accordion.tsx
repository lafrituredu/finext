import React, { Children, useState, type ReactNode, isValidElement } from "react";

interface AccordionItemProps {
  id: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

function Accordion({ children }: { children: ReactNode }) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-1">
      {Children.map(children, (child) => {
        if (!isValidElement<AccordionItemProps>(child)) return null;

        return React.cloneElement(child, {
          isOpen: openAccordion === child.props.id,
          onToggle: () => toggle(child.props.id),
        });
      })}
    </div>
  );
}

export default Accordion;
