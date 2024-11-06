import { Categories, CategoryName, Value } from "@/types";

export function MobileReplayCategory({ title, cards }: { title: CategoryName; cards: Value[] }) {
    return (
        <div data-category={title} className="p-2 rounded-lg border bg-white border-gray-200">
            <div className="flex items-center justify-between">
                <span className="font-medium text-xs sm:text-sm truncate">{title}</span>
                <span className="bg-gray-200 px-1.5 py-0.5 rounded-full text-xs">
                    {cards.length}
                </span>
            </div>
            {cards.length > 0 && (
                <div className="mt-1 space-y-1">
                    {cards.map(card => (
                        <div key={card.id} className="text-xs text-gray-600 truncate">
                            {card.title}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function MobileReplayCategories({ categories }: { categories: Categories }) {
    return (
        <div className="w-full space-y-1">
            <div className="w-full">
                <MobileReplayCategory title="Very Important" cards={categories['Very Important'] || []} />
            </div>
            <div className="grid grid-cols-2 gap-1">
                <MobileReplayCategory title="Quite Important" cards={categories['Quite Important'] || []} />
                <MobileReplayCategory title="Important" cards={categories['Important'] || []} />
            </div>
            <div className="grid grid-cols-2 gap-1">
                <MobileReplayCategory title="Of Some Importance" cards={categories['Of Some Importance'] || []} />
                <MobileReplayCategory title="Not Important" cards={categories['Not Important'] || []} />
            </div>
        </div>
    );
}