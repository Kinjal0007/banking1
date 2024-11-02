import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import BankCard from './BankCard';
import Footer from './Footer';

const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">
              {/* Add null check before accessing firstName */}
              {user?.firstName ? user.firstName[0] : 'N/A'}
            </span>
          </div>
          <div className="profile-details">
            <h1 className="profile-name">
              {/* Add null check before rendering full firstName */}
              {user?.firstName || 'Unknown User'}
            </h1>
            <p className="profile-email">
              {/* Add null check before rendering email */}
              {user?.email || 'No email provided'}
            </p>
          </div>
        </div>
      </section>

      <section className="banks">
        <div className="flex w-full justify-between">
          <h2 className="header-2">My Banks</h2>
          <Link href="/" className="flex gap-2">
            <Image
              src="/icons/plus.svg"
              width={20}
              height={20}
              alt="plus"
            />
            <h2 className="text-14 font-semibold text-gray-600">
              Add Bank
            </h2>
          </Link>
        </div>

        {/* Ensure banks array is not null before rendering */}
        {banks?.length > 0 ? (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative z-10">
              <BankCard 
                key={banks[0].$id}
                account={banks[0]}
                userName={user?.firstName || 'Unknown User'}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <BankCard 
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={user?.firstName || 'Unknown User'}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        ) : (
          <p>No banks linked</p>
        )}
      </section>
    </aside>
  );
};

export default RightSidebar;
