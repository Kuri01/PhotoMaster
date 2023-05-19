import React, { useState } from 'react';
import UserNavigationBar from './UserNavigationBar';
import UserPhotos from './UserPhotos';
import PhotoUpload from './PhotoUpload';
import DrawingBoard from './DrawingBoard';
import BoardsGrid from './BoardsGrid';
const UserProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState('photos');

  const renderTab = () => {
    switch (selectedTab) {
      case 'photos':
        return <UserPhotos />;
      case 'upload':
        return <PhotoUpload />;
      case 'drawings':
        return <DrawingBoard />;
      case 'boardsgrid':
        return <BoardsGrid />;
      default:
        return <UserPhotos />;
    }
  };

  return (
    <div>
      <UserNavigationBar setSelectedTab={setSelectedTab} />
      {renderTab()}
    </div>
  );
};

export default UserProfilePage;
