/** Props for the content section of a card */
export interface CardContentProps {
    /** Title text of the card */
    title: string;
    /** Description text of the card */
    description: string;
    /** Flag indicating if card content is expanded */
    isExpanded: boolean;
    /** Optional control elements to render */
    controls?: React.ReactNode;
  }