export const getPostItStyles = (isDragging: boolean, isOver: boolean) => {
  const postItBaseStyles = `
    relative
    p-2
    rounded-sm
    transform
    transition-all
    duration-200
    cursor-move
    bg-gradient-to-br
    from-yellow-100
    to-yellow-200
    shadow-[2px_3px_10px_rgba(0,0,0,0.3)]
    hover:shadow-[3px_5px_12px_rgba(0,0,0,0.35)]
    ${Math.random() > 0.5 ? 'rotate-1' : '-rotate-1'}
    ${isDragging ? 'scale-105 opacity-75 z-50' : ''}
    ${isOver ? 'ring-2 ring-blue-400' : ''}
  `;

  const tapeEffect = `
    before:content-['']
    before:absolute
    before:-top-2
    before:left-1/2
    before:-translate-x-1/2
    before:w-8
    before:h-4
    before:bg-[rgba(255,255,255,0.5)]
    before:rounded-sm
    before:transform
    before:rotate-2
    after:content-['']
    after:absolute
    after:top-0
    after:left-0
    after:right-0
    after:h-8
    after:bg-gradient-to-b
    after:from-yellow-50/30
    after:to-transparent
  `;

  return { postItBaseStyles, tapeEffect };
};
