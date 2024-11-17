'use client'

import { memo, useRef, useState } from 'react';
import { CardProps } from './types';
import { getEnvBoolean } from '@/utils/config';
import { CardControls } from './CardControls';
import { CardMoveOptions } from './CardMoveOptions';
import { CardContent } from './CardContent';
import { getPostItStyles } from './styles';
import { CategoryName, Value } from '@/types';
import { useMobile } from '@/contexts/MobileContext';

interface DroppedValue extends Value {
    sourceCategory?: CategoryName;
    isInternalDrag?: boolean;
    sourceIndex?: number;
}

const Card = memo(function Card({
    value,
    onDrop,
    onMoveUp,
    onMoveDown,
    onMoveBetweenCategories,
    currentCategory,
    columnIndex,
    onClick,
    selectedMobileCard
}: CardProps) {
    const debug = getEnvBoolean('debug', false);
    const [isDragging, setIsDragging] = useState(false);
    const [isOver, setIsOver] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showMoveOptions, setShowMoveOptions] = useState(false);
    const draggedIndexRef = useRef<number | null>(null);
    const { isMobile } = useMobile();

    if (!value) return null;
    const isInCategory = columnIndex !== undefined;

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
        if (isMobile) {
            e.preventDefault();
            return;
        }
        setIsDragging(true);
        draggedIndexRef.current = columnIndex !== undefined ? columnIndex : null;
        
        const dragData = {
            id: value.id,
            title: value.title,
            description: value.description,
            sourceCategory: currentCategory,
            sourceIndex: columnIndex,
            isInternalDrag: isInCategory
        };
        
        e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
        e.dataTransfer.effectAllowed = 'move';
        
        if (debug) console.log('🎪 Card dragStart:', dragData);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        if (isMobile) return;
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (isMobile) return;
        e.preventDefault();
        e.stopPropagation();
        setIsOver(false);
        
        try {
            const droppedData = JSON.parse(e.dataTransfer.getData('text/plain'));
            const sourceIndex = droppedData.sourceIndex;
            const targetIndex = columnIndex;
            const sourceCategory = droppedData.sourceCategory;

            if (debug) {
                console.log('📥 Drop data:', {
                    droppedData,
                    sourceIndex,
                    targetIndex,
                    sourceCategory,
                    currentCategory
                });
            }

            // Handle internal category reordering
            if (droppedData.isInternalDrag && 
                sourceCategory === currentCategory && 
                sourceIndex !== undefined && 
                targetIndex !== undefined) {
                
                if (sourceIndex < targetIndex) {
                    onMoveDown?.();
                } else if (sourceIndex > targetIndex) {
                    onMoveUp?.();
                }
            } 
            // Handle between category movement
            else if (sourceCategory && currentCategory && sourceCategory !== currentCategory) {
                onMoveBetweenCategories?.(
                    { id: droppedData.id, title: droppedData.title, description: droppedData.description },
                    sourceCategory,
                    currentCategory
                );
            }
            // Handle new card drop
            else if (onDrop) {
                onDrop(droppedData);
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    };
    
    const handleDragEnd = (): void => {
        if (isMobile) return;
        setIsDragging(false);
        setIsOver(false);
        draggedIndexRef.current = null;
        if (debug) console.log('🏁 Card dragEnd:', { value, columnIndex });
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
        if (isMobile) return;
        e.preventDefault();
        e.stopPropagation();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
        if (isMobile) return;
        e.preventDefault();
        e.stopPropagation();
        setIsOver(false);
    };

    const handleCardClick = () => {
        if (isMobile && onClick) {
            onClick(value);
        }
    };

    const { postItBaseStyles, tapeEffect } = getPostItStyles(isDragging, isOver);

    const cardContainerClasses = `
    ${postItBaseStyles} 
    ${tapeEffect} 
    ${isInCategory ? 'w-full max-w-full min-h-[40px]' : 'w-48 h-48'}
    relative select-none cursor-move
    ${isMobile ? 'touch-manipulation' : ''}
    ${isOver ? 'border-2 border-blue-300' : ''}
    ${isMobile && onClick && !isInCategory ? 'hover:bg-yellow-50 active:bg-yellow-200' : ''}
    ${selectedMobileCard ? 'bg-yellow-200' : ''} // Add this for selected state
`;

    if (isInCategory) {
        return (
            <div
                id={`card-${value.id}`}
                data-index={columnIndex}
                data-dropzone="true"
                draggable="true"
                onClick={handleCardClick}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cardContainerClasses}
                role="article"
                aria-label={`Value card: ${value.title}`}
                tabIndex={0}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleCardClick();
                    }
                }}
            >
                <div >
                    <CardContent
                        title={value.title}
                        description={value.description}
                        isExpanded={isExpanded}
                        controls={!isMobile ? 
                            <CardControls
                                onMoveUp={onMoveUp}
                                onMoveDown={onMoveDown}
                                onShowMoveOptions={() => setShowMoveOptions(!showMoveOptions)}
                                currentCategory={currentCategory}
                                isExpanded={isExpanded}
                                onToggleExpand={() => setIsExpanded(!isExpanded)}
                                value={value}
                            />
                            : null
                        }
                    />
                </div>
                {!isMobile && showMoveOptions && onMoveBetweenCategories && currentCategory && (
                    <div 
                        className="absolute right-2 top-8 z-50"
                        role="dialog"
                        aria-label="Move options"
                    >
                        <CardMoveOptions
                            value={value}
                            currentCategory={currentCategory}
                            onMoveBetweenCategories={onMoveBetweenCategories}
                            onClose={() => setShowMoveOptions(false)}
                        />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            draggable="true"
            onClick={handleCardClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cardContainerClasses}
            role="article"
            aria-label={`Value card: ${value.title}`}
            tabIndex={0}
            onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick();
                }
            }}
        >
            <div 
                className="relative z-10 pointer-events-none"
                role="region"
                aria-label={`Content for ${value.title}`}
            >
                <h3 className="font-medium text-gray-800 mb-3">{value.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{value.description}</p>
            </div>
        </div>
    );
});

export default Card;
