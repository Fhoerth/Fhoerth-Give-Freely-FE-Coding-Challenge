import { useMemo } from 'react';

interface MenuSkeletonProps {
  quantity?: number;
}

export const MenuSkeleton: React.FC<MenuSkeletonProps> = ({ quantity = 3 }) => {
  const items = useMemo(() => {
    return [...Array(quantity).keys()].map((n) => `skeleton-item-${n}`);
  }, [quantity]);

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item}>
          <div className="animate-pulse">
            <div className="bg-gray-400 p-3 h-14 w-[350px]"></div>
          </div>
        </li>
      ))}
    </ul>
  );
};
