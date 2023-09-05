import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/Container';
import styles from './404.module.scss';

export default function Error404() {
  return (
    <>
      <Container className={styles.notFound}>
        <img alt='Ghost getting abducted by aliens' src='/img/abduction.svg' />
        <h3>Looks like this page is a ghost that got abducted by aliens...</h3>
        <Link href='/'>Return to the site</Link>
      </Container>
    </>
  );
}
