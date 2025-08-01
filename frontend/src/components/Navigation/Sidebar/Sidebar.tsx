import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router';
import {
  Home,
  Sparkles,
  Video,
  Images,
  Settings,
  Palette,
  FileArchiveIcon as FileCompress,
  BookImage,
  Lock,
  User,
} from 'lucide-react';
import CustomizationPopup from './CustomizationPopup';
import ImageCompressor from './ImageCompressor';
import AvatarCropper from './AvatarCropper';
import { defaultStyles, type CustomStyles } from './styles';
import { ROUTES } from '@/constants/routes';

// Define the NavItem interface for navigation items
interface NavItem {
  path: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Extend CSSProperties to support custom CSS variables
type CustomCSSProperties = React.CSSProperties & {
  '--bg-active'?: string;
  '--text-active'?: string;
  '--bg-hover'?: string;
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  // const [] = useState<boolean>(false);
  const [showCustomize, setShowCustomize] = useState<boolean>(false);
  const [showImageCompressor, setShowImageCompressor] =
    useState<boolean>(false);
  const [styles, setStyles] = useState<CustomStyles>(defaultStyles);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState<boolean>(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [showAvatarCropper, setShowAvatarCropper] = useState<boolean>(false);
  const [croppedAvatar, setCroppedAvatar] = useState<string | null>(null);

  // Check if the current path matches the given path
  const isActive = (path: string): boolean => location.pathname === path;

  // Update the body background color when the UI background color changes
  useEffect(() => {
    document.body.style.backgroundColor = styles.uiBackgroundColor;
  }, [styles.uiBackgroundColor]);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      (event.target as HTMLElement).click();
    }
  }, []);

  // Handle avatar file upload
  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];
    setAvatarError(null);

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please upload a valid image file (JPEG, PNG, GIF)');
      return;
    }

    setIsAvatarLoading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setIsAvatarLoading(false);
        setShowAvatarCropper(true);
      };
      reader.onerror = () => {
        setAvatarError('Error reading file. Please try again.');
        setIsAvatarLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setAvatarError('An unexpected error occurred. Please try again.');
      setIsAvatarLoading(false);
    }
  };

  // Handle avatar crop completion
  const handleCropComplete = (croppedImage: string): void => {
    setCroppedAvatar(croppedImage);
    setShowAvatarCropper(false);
  };

  // Define the sidebar style
  const sidebarStyle: CustomCSSProperties = {
    background: styles.bgColor,
    color: styles.textColor,
    borderColor: styles.borderColor,
    borderRadius: `${styles.borderRadius}px`,
    backgroundSize: 'cover',
    fontFamily: styles.fontFamily,
    fontSize: `${styles.fontSize}px`,
    boxShadow:
      '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '--bg-active': styles.activeBackgroundColor,
    '--text-active': styles.activeTextColor,
    '--bg-hover': styles.hoverBackgroundColor,
    width: '100%', // Ensure full width within container
    height: '100%', // Ensure full height
  };

  // Define the navigation items
  const navItems: NavItem[] = [
    { path: `/${ROUTES.LAYOUT.HOME}`, label: 'Home', Icon: Home },
    { path: `/${ROUTES.LAYOUT.AI}`, label: 'AI Tagging', Icon: Sparkles },
    { path: `/${ROUTES.LAYOUT.VIDEOS}`, label: 'Videos', Icon: Video },
    { path: `/${ROUTES.LAYOUT.ALBUMS}`, label: 'Albums', Icon: Images },
    { path: `/${ROUTES.LAYOUT.SETTINGS}`, label: 'Settings', Icon: Settings },
    {
      path: `/${ROUTES.LAYOUT.SECURE_FOLDER}`,
      label: 'Secure Folder',
      Icon: Lock,
    },
    { path: `/${ROUTES.LAYOUT.MEMORIES}`, label: 'Memories', Icon: BookImage },
  ];

  return (
    <>
      {/* Background Video */}
      {styles.backgroundVideo && (
        <div className="fixed inset-0 z-[-1] h-full w-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 h-auto min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2 transform object-cover"
          >
            <source src={styles.backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Sidebar */}
      <div className="h-fit p-4">
        <nav
          className="sidebar relative z-10 flex h-[calc(100vh-2rem)] flex-col justify-between overflow-hidden rounded-3xl border-r backdrop-blur-sm transition-all duration-300 ease-in-out"
          style={sidebarStyle}
          aria-label="Main Navigation"
        >
          <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent mt-4 flex flex-col items-center overflow-y-auto">
            {/* Avatar Section */}
            <div className="group relative mb-6 flex w-full justify-center px-4">
              <div
                className={`avatar-container relative cursor-pointer transition-all duration-300 ${
                  isAvatarLoading ? 'pointer-events-none opacity-50' : ''
                }`}
                onClick={() => document.getElementById('avatarUpload')?.click()}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-label="Change profile picture"
              >
                <div className="hover:border-primary relative h-20 w-20 overflow-hidden rounded-full border-4 border-white/30 shadow-xl transition-all duration-300 hover:shadow-2xl sm:h-24 sm:w-24">
                  {croppedAvatar ? (
                    <img
                      src={croppedAvatar || '/placeholder.svg'}
                      alt="User Avatar"
                      className="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : avatar ? (
                    <img
                      src={avatar || '/placeholder.svg'}
                      alt="User Avatar"
                      className="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                      <User className="h-10 w-10 text-white/90 sm:h-12 sm:w-12" />
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-center text-xs font-medium text-white drop-shadow-md sm:text-sm">
                      Change Photo
                    </span>
                  </div>
                </div>

                {isAvatarLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {avatarError && (
                <div className="absolute bottom-0 left-1/2 w-max max-w-[200px] -translate-x-1/2 translate-y-4 transform rounded-lg bg-red-100 px-3 py-1 text-center text-sm text-red-700">
                  {avatarError}
                </div>
              )}

              <input
                type="file"
                id="avatarUpload"
                accept="image/*"
                onChange={handleAvatarChange}
                className="sr-only"
                aria-describedby="avatarError"
              />
            </div>

            {/* Navigation Items */}
            <div className="w-full space-y-1 px-3">
              {navItems.map(({ path, label, Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`group flex flex-col items-center gap-1 rounded-xl px-2 py-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                    isActive(path)
                      ? 'bg-[var(--bg-active)] text-[var(--text-active)] shadow-lg'
                      : 'text-default hover:bg-[var(--bg-hover)]'
                  }`}
                  aria-current={isActive(path) ? 'page' : undefined}
                >
                  <Icon
                    style={{
                      width: styles.iconSize,
                      height: styles.iconSize,
                      color: isActive(path)
                        ? styles.activeTextColor
                        : styles.iconColor,
                    }}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="mt-1 text-xs font-medium tracking-wide whitespace-nowrap">
                    {label}
                  </span>
                </Link>
              ))}

              {/* Image Compressor Button */}
              <button
                onClick={() => setShowImageCompressor(true)}
                className="text-default group flex w-full flex-col items-center gap-1 rounded-xl px-2 py-3 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-hover)] active:scale-[0.98]"
                aria-label="Open Image Compressor"
                onKeyDown={handleKeyDown}
              >
                <FileCompress
                  style={{
                    width: styles.iconSize,
                    height: styles.iconSize,
                    color: styles.iconColor,
                  }}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span className="mt-1 text-xs font-medium tracking-wide">
                  Compressor
                </span>
              </button>
            </div>
          </div>

          {/* Customize Button */}
          <div className="mt-auto flex items-center justify-center p-3">
            <button
              onClick={() => setShowCustomize(true)}
              className="rounded-full bg-[var(--bg-hover)] p-3 shadow-md transition-all duration-300 hover:bg-[var(--bg-active)] hover:shadow-lg focus:outline-none"
              aria-label="Customize sidebar"
              onKeyDown={handleKeyDown}
            >
              <Palette size={20} className="text-[var(--text-active)]" />
            </button>
          </div>
        </nav>
      </div>

      {/* Customization Popup */}

      {showCustomize && (
        <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm transition-opacity duration-300">
          <div className="m-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white/90 p-4 shadow-2xl dark:bg-gray-800/90">
            <CustomizationPopup
              styles={styles}
              setStyles={setStyles}
              onClose={() => setShowCustomize(false)}
            />
          </div>
        </div>
      )}

      {/* Image Compressor Popup */}

      {showImageCompressor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
          <div className="m-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white/90 p-6 shadow-2xl dark:bg-gray-800/90">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                Image Compressor
              </h2>
              <button
                onClick={() => setShowImageCompressor(false)}
                className="rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Close image compressor"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <ImageCompressor />
          </div>
        </div>
      )}

      {/* Avatar Cropper Popup */}
      {showAvatarCropper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
          <div className="m-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white/90 p-6 shadow-2xl dark:bg-gray-800/90">
            <div className="mb-6">
              <h2 className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                Crop Avatar
              </h2>
            </div>
            <AvatarCropper
              image={avatar as string}
              onCropComplete={handleCropComplete}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
