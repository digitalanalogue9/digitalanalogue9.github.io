// DraggableCard.tsx
'use client'

import { memo, useRef, useState } from 'react';
import { CardProps } from './types';
import { getEnvBoolean } from '@/utils/config';
import { CardControls } from './CardControls';
import { CardMoveOptions } from './CardMoveOptions';
import { CardContent } from './CardContent';
import { getPostItStyles } from './styles';
import { CategoryName, Value } from '@/types';


interface DroppedValue extends Value {
    sourceCategory?: CategoryName;
    isInternalDrag?: boolean;
    sourceIndex?: number;
}

const DraggableCard = memo(function DraggableCard({
    value,
    onDrop,
    onMoveUp,
    onMoveDown,
    onMoveToCategory,
    currentCategory,
    columnIndex
}: CardProps) {
    const debug = getEnvBoolean('debug', false);
    const [isDragging, setIsDragging] = useState(false);
    const [isOver, setIsOver] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showMoveOptions, setShowMoveOptions] = useState(false);
    const moveRef = useRef<{ pending: boolean }>({ pending: false });
    const touchTimeoutRef = useRef<NodeJS.Timeout>();
    const draggedCategoryRef = useRef<string | null>(null);

    if (!value) return null;
    const isInCategory = columnIndex !== undefined;

    const handleTouchStart = () => {
        touchTimeoutRef.current = setTimeout(() => {
            setIsDragging(true);
        }, 200);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault(); // Prevent scrolling

        const touch = e.touches[0];
        const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
        const categoryElement = elements.find(el => el.hasAttribute('data-category'));
        
        // Clear previous category highlight
        if (draggedCategoryRef.current) {
            const prevElement = document.querySelector(`[data-category="${draggedCategoryRef.current}"]`);
            prevElement?.classList.remove('bg-blue-50', 'border-blue-400');
        }

        if (categoryElement) {
            const category = categoryElement.getAttribute('data-category');
            if (category) {
                draggedCategoryRef.current = category;
                categoryElement.classList.add('bg-blue-50', 'border-blue-400');
            }
        } else {
            draggedCategoryRef.current = null;
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchTimeoutRef.current) {
            clearTimeout(touchTimeoutRef.current);
        }

        if (!isDragging) return;

        const touch = e.changedTouches[0];
        const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
        const categoryElement = elements.find(el => el.hasAttribute('data-category'));

        if (categoryElement) {
            const category = categoryElement.getAttribute('data-category') as CategoryName;
            if (category && onDrop) {
                // Create a drop payload similar to drag and drop
                const dropPayload = {
                    ...value,
                    sourceCategory: currentCategory,
                    isInternalDrag: Boolean(currentCategory),
                    sourceIndex: columnIndex
                };
                
                onDrop(dropPayload);
                categoryElement.classList.remove('bg-blue-50', 'border-blue-400');
            }
        }

        // Clean up
        if (draggedCategoryRef.current) {
            const element = document.querySelector(`[data-category="${draggedCategoryRef.current}"]`);
            element?.classList.remove('bg-blue-50', 'border-blue-400');
            draggedCategoryRef.current = null;
        }

        setIsDragging(false);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
        setIsDragging(true);
        const dragData = {
            ...value,
            sourceCategory: currentCategory,
            isInternalDrag: isInCategory,
            sourceIndex: columnIndex
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
        
        if (debug) console.log('🎪 Card dragStart:', { value, columnIndex, isInCategory });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsOver(true);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        
        try {
            const droppedValue = JSON.parse(e.dataTransfer.getData('text/plain')) as DroppedValue;
    
            // If this is an internal drag within the same category
            if (droppedValue.isInternalDrag && droppedValue.sourceCategory === currentCategory) {
                const sourceIndex = droppedValue.sourceIndex;
                let targetIndex: number;
    
                // Get either this card's dropzone or the category container
                const dropzone = (e.target as HTMLElement).closest('[data-dropzone]');
                
                if (dropzone) {
                    targetIndex = parseInt(dropzone.getAttribute('data-index') || '0', 10);
                    console.log('Indices:', { sourceIndex, targetIndex });
    
                    // Only move if we have valid indices and they're different
                    if (sourceIndex !== undefined && sourceIndex !== targetIndex) {
                        onMoveUp || onMoveDown ? 
                            (sourceIndex < targetIndex ? onMoveDown?.() : onMoveUp?.()) :
                            null;
                    }
                } else {
                    // Let the category container handle the drop
                    return;
                }
            } else if (onDrop) {
                // Handle drops from other categories or new cards
                onDrop(droppedValue);
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    };
    
    const handleDragEnd = (): void => {
        setIsDragging(false);
        setIsOver(false);
        moveRef.current.pending = false;
        if (debug) console.log('🏁 Card dragEnd:', { value, columnIndex });
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsOver(false);
    };

    const { postItBaseStyles, tapeEffect } = getPostItStyles(isDragging, isOver);

    const cardClasses = `
        ${postItBaseStyles} 
        ${tapeEffect} 
        ${isDragging ? 'border-2 border-blue-400 opacity-75' : ''}
        ${isInCategory ? 'w-full max-w-full min-h-[40px]' : 'w-48 h-48'} 
        relative
        touch-manipulation
    `;


    if (isInCategory) {
        return (
            <div
                id={`card-${value.title}`}
                data-index={columnIndex}
                data-dropzone="true"
                draggable="true"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cardClasses}
            >
                <CardContent
                    title={value.title}
                    description={value.description}
                    isExpanded={isExpanded}
                    controls={
                        <CardControls
                            onMoveUp={onMoveUp}
                            onMoveDown={onMoveDown}
                            onShowMoveOptions={() => setShowMoveOptions(!showMoveOptions)}
                            currentCategory={currentCategory}
                            isExpanded={isExpanded}
                            onToggleExpand={() => setIsExpanded(!isExpanded)}
                            value={value}
                        />
                    }
                />
                {showMoveOptions && onMoveToCategory && currentCategory && (
                    <div className="absolute right-2 top-8 z-50">
                        <CardMoveOptions
                            value={value}
                            currentCategory={currentCategory}
                            onMoveToCategory={onMoveToCategory}
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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cardClasses}
        >
            <div className="relative z-10">
                <h3 className="font-medium text-gray-800 mb-3">{value.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{value.description}</p>
            </div>
        </div>
    );
});

export default DraggableCard;
