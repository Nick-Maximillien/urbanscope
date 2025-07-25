import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <header>
        <Image src="/images/logo.jpeg" alt="UrbanScope Logo" width={80} height={80} className="logo" />
        <h1 className="title">UrbanScope</h1>
      </header>

      <section className="description">
        <p>
          UrbanScope is a blockchain-powered land use notification system that brings transparency to urban development. 
          Residents can view development proposals in their area, while the city hall admin securely submits updates on-chain.
        </p>
      </section>

      <section className="buttons">
        <Link href="/admin">
          <button className="btn">Admin Dashboard</button>
        </Link>
        <Link href="/resident">
          <button className="btn">Resident Dashboard</button>
        </Link>
      </section>
    </div>
  );
}
