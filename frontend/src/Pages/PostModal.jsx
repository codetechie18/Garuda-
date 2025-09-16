import React, { useEffect } from 'react';

const PostModal = ({ post, onClose }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-modal-title"
    >
      <div className="modal-content post-modal">
        <div className="modal-header">
          <h2 id="post-modal-title">Full Post Content</h2>
          <button 
            className="modal-close"
            onClick={onClose}
            aria-label="Close post modal"
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="post-modal__platform">
            <span className={`platform-badge platform-badge--${post.platform.toLowerCase()}`}>
              {post.platform}
            </span>
          </div>
          
          <div className="post-modal__content">
            <p>{post.post}</p>
          </div>
          
          <div className="post-modal__meta">
            <div className="post-modal__user">
              <strong>User:</strong> {post.user.name} ({post.user.username})
            </div>
            <div className="post-modal__date">
              <strong>Reported:</strong> {new Date(post.reportedAt).toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <a 
            href={post.postLink}
            target="_blank"
            rel="noopener noreferrer"
            className="post-link post-link--primary"
          >
            View Original Post
          </a>
          <button className="modal-button modal-button--secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;