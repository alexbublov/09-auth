import { useRouter } from 'next/navigation';
import css from './BackButton.module.css';

const BackButton = () => {
  const router = useRouter();

  return (
    <button className={css['back-button']} onClick={router.back}>
      Back
    </button>
  );
};

export default BackButton;
