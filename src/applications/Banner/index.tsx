import { CountButton } from '~features/CountButton';

export const Banner: React.FC = () => {
  return (
    <div
      style={{
        background: 'red',
        color: '#fff',
        width: '100%',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
      }}>
      Random participant message
      <CountButton />
    </div>
  );
};
