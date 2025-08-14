import PostManager from './PostManager';
import PostListNew from './PostListNew';
import PostCreateModal from './PostCreateModal';
import PostEditModal from './PostEditModal';
import PostDeleteModal from './PostDeleteModal';
import PostCommentsModal from './PostCommentsModal';
import PostReactionsModal from './PostReactionsModal';
import CreatePostNew from '../../components/CreatePostNew';
import PostDemo from './PostDemo';
import LoadingOverlay from './LoadingOverlay';
import ErrorBoundary from './ErrorBoundary';

const PostsApp = ({ userId = null, isUserPosts = false, showCreatePost = true, showDemo = false }) => {
    return (
        <ErrorBoundary>
            <PostManager>
                {/* Loading Overlay */}
                <LoadingOverlay />
                
                {/* Demo (for testing) */}
                {showDemo && <PostDemo />}

                {/* Create Post */}
                {showCreatePost && <CreatePostNew />}

                {/* Main content */}
                <PostListNew userId={userId} isUserPosts={isUserPosts} />
                
                {/* Modals */}
                <PostCreateModal />
                <PostEditModal />
                <PostDeleteModal />
                <PostCommentsModal />
                <PostReactionsModal />
            </PostManager>
        </ErrorBoundary>
    );
};

export default PostsApp;
