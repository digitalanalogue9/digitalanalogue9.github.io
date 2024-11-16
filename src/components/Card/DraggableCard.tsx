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

const DraggableCard = memo(function DraggableCard({
    value,
    onDrop,
    onMoveUp,
    onMoveDown,
    onMoveBetweenCategories,
    currentCategory,
    columnIndex,
    onClick
}: CardProps) {
    const debug = getEnvBoolean('debug', false);
    const [isDragging, setIsDragging] = useState(false);
    const [isOver, setIsOver] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showMoveOptions, setShowMoveOptions] = useState(false);
    const moveRef = useRef<{ pending: boolean }>({ pending: false });
    const { isMobile } = useMobile();

    if (!value) return null;
    const isInCategory = columnIndex !== undefined;

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
        if (isMobile) {
            e.preventDefault();
            return;
        }
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

    const handleCardClick = () => {
        if (isMobile && onClick) {
            onClick(value);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        if (isMobile) return;
        e.preventDefault();
        setIsOver(true);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (isMobile) return;
        e.preventDefault();
        setIsOver(false);
        
        try {
            const droppedValue = JSON.parse(e.dataTransfer.getData('text/plain')) as DroppedValue;
    
            if (droppedValue.isInternalDrag && droppedValue.sourceCategory === currentCategory) {
                const sourceIndex = droppedValue.sourceIndex;
                let targetIndex: number;
    
                const dropzone = (e.target as HTMLElement).closest('[data-dropzone]');
                
                if (dropzone) {
                    targetIndex = parseInt(dropzone.getAttribute('data-index') || '0', 10);
                    console.log('Indices:', { sourceIndex, targetIndex });
    
                    if (sourceIndex !== undefined && sourceIndex !== targetIndex) {
                        onMoveUp || onMoveDown ? 
                            (sourceIndex < targetIndex ? onMoveDown?.() : onMoveUp?.()) :
                            null;
                    }
                } else {
                    return;
                }
            } else if (onDrop) {
                onDrop(droppedValue);
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    };
    
    const handleDragEnd = (): void => {
        if (isMobile) return;
        setIsDragging(false);
        setIsOver(false);
        moveRef.current.pending = false;
        if (debug) console.log('🏁 Card dragEnd:', { value, columnIndex });
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
        if (isMobile) return;
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
        if (isMobile) return;
        e.preventDefault();
        setIsOver(false);
    };

    const { postItBaseStyles, tapeEffect } = getPostItStyles(isDragging, isOver);

    if (isInCategory) {
        return (
            <div
                id={`card-${value.title}`}
                data-index={columnIndex}
                data-dropzone="true"
                draggable={!isMobile}
                onClick={handleCardClick}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`${postItBaseStyles} ${tapeEffect} w-full max-w-full min-h-[40px] relative
                    ${isMobile ? 'touch-manipulation' : ''}`}
            >
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
                {!isMobile && showMoveOptions && onMoveBetweenCategories && currentCategory && (
                    <div className="absolute right-2 top-8 z-50">
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
            draggable={!isMobile}
            onClick={handleCardClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`${postItBaseStyles} ${tapeEffect} w-48 h-48 
                ${isMobile ? 'touch-manipulation active:scale-95 transition-transform' : ''}`}
        >
            <div className="relative z-10">
                <h3 className="font-medium text-gray-800 mb-3">{value.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{value.description}</p>
            </div>
        </div>
    );
});

export default DraggableCard;
