import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };


  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className='bg-gray-900'>
        <div className='p-4 max-w-2xl mx-auto bg-gray-900 text-gray-100 rounded-lg shadow-lg'>
          <h1 className='text-3xl font-bold text-center my-6 text-cyan-400'>Profile</h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type='file'
              ref={fileRef}
              hidden
              accept='image/*'
            />
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt='profile'
              className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-2 border-cyan-500'
            />
            <p className='text-sm self-center'>
              {fileUploadError ? (
                <span className='text-red-500'>
                  Error Image upload (image must be less than 2 mb)
                </span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className='text-yellow-400'>{`Uploading ${filePerc}%`}</span>
              ) : filePerc === 100 ? (
                <span className='text-green-500'>Image successfully uploaded!</span>
              ) : (
                ''
              )}
            </p>
            <input
              type='text'
              placeholder='username'
              defaultValue={currentUser.username}
              id='username'
              className='bg-gray-800 border border-gray-600 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500'
              onChange={handleChange}
            />
            <input
              type='email'
              placeholder='email'
              id='email'
              defaultValue={currentUser.email}
              className='bg-gray-800 border border-gray-600 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500'
              onChange={handleChange}
            />
            <input
              type='password'
              placeholder='password'
              onChange={handleChange}
              id='password'
              className='bg-gray-800 border border-gray-600 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500'
            />
            <button
              disabled={loading}
              className='bg-cyan-600 text-white rounded-md p-3 uppercase hover:bg-cyan-500 disabled:opacity-60'
            >
              {loading ? 'Loading...' : 'Update'}
            </button>
            <Link
              className='bg-green-600 text-white p-3 rounded-md uppercase text-center hover:bg-green-500'
              to={'/create-listing'}
            >
              Create Listing
            </Link>
          </form>
          <div className='flex justify-between mt-5 text-sm'>
            <span
              onClick={handleDeleteUser}
              className='text-red-500 cursor-pointer hover:underline'
            >
              Delete account
            </span>
            <span onClick={handleSignOut} className='text-red-500 cursor-pointer hover:underline'>
              Sign out
            </span>
          </div>

          <p className='text-red-500 mt-4'>{error ? error : ''}</p>
          <p className='text-green-500 mt-4'>
            {updateSuccess ? 'User is updated successfully!' : ''}
          </p>
          <button onClick={handleShowListings} className='text-cyan-400 hover:underline mt-4 w-full'>
            Show Listings
          </button>
          <p className='text-red-500 mt-3'>
            {showListingsError ? 'Error showing listings' : ''}
          </p>

          {userListings && userListings.length > 0 && (
            <div className='flex flex-col gap-4 mt-6'>
              <h1 className='text-center text-2xl font-bold text-cyan-400'>Your Listings</h1>
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className='border border-gray-700 rounded-lg p-3 flex justify-between items-center gap-4 bg-gray-800'
                >
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      src={listing.imageUrls[0]}
                      alt='listing cover'
                      className='h-16 w-16 object-contain rounded'
                    />
                  </Link>
                  <Link
                    className='text-cyan-300 font-semibold hover:underline truncate flex-1'
                    to={`/listing/${listing._id}`}
                  >
                    <p>{listing.name}</p>
                  </Link>
                  <div className='flex flex-col items-center gap-1'>
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className='text-red-500 text-sm hover:underline'
                    >
                      Delete
                    </button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-green-500 text-sm hover:underline'>Edit</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}


        </div>
        <footer className="bg-gray-800 text-gray-300 py-10 mt-16">
          <div className="w-full px-6 flex flex-col sm:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
            <div className="text-center sm:text-left">
              <div>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                  <span className='text-green-400'>DEV</span>
                  <span className='text-purple-400'>Estate</span>
                </h1>
              </div>         <p className="text-base">Find your perfect place to live or share.</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-base">
                &copy; {new Date().getFullYear()} MyRealEstate. All rights reserved.
              </p>
              <div className="flex justify-center sm:justify-end gap-6 mt-3">
                <a href="#" className="hover:text-white transition text-base">Privacy</a>
                <a href="#" className="hover:text-white transition text-base">Terms</a>
                <a href="#" className="hover:text-white transition text-base">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

    </>

  );
}
