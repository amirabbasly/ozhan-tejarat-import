import { FaUserCircle, FaEnvelope, FaBriefcase, FaCalendarAlt } from "react-icons/fa";

const UserProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 font-vazir">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 sm:p-8 flex flex-col gap-6 animate-pulse">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="h-8 sm:h-9 w-48 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mt-3 relative">
          <div className="relative">
            <FaUserCircle className="text-8xl sm:text-9xl text-gray-200" />
            <div className="absolute bottom-0 right-0 bg-gray-200 p-2 rounded-full w-10 h-10"></div>
          </div>
        </div>

        {/* Info Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-gray-200 text-2xl" />
            <div className="flex-1">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-40 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaEnvelope className="text-gray-200 text-2xl" />
            <div className="flex-1">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaBriefcase className="text-gray-200 text-2xl" />
            <div className="flex-1">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-36 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaBriefcase className="text-gray-200 text-2xl" />
            <div className="flex-1">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-gray-200 text-2xl" />
            <div className="flex-1">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-gray-200 text-2xl" />
            <div className="flex-1">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;