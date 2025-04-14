import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className='bg-gray-900 text-white min-h-screen'>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  className='relative h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                >
                  {listing.offer && (
                    <div className='absolute top-6 left-6 bg-red-600 text-white px-5 py-2 rounded-xl text-2xl font-bold shadow-lg'>
                      ₹{+listing.regularPrice - +listing.discountPrice} OFF
                    </div>
                  )}

                  <div className='absolute bottom-6 left-6 bg-gray-800 bg-opacity-80 text-white px-4 py-1 rounded-lg text-lg font-medium'>
                    {listing.type === 'rent'
                      ? 'For Rent'
                      : listing.type === 'sale'
                      ? 'For Sale'
                      : 'Shared'}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-gray-700 cursor-pointer'>
            <FaShare
              className='text-white'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-gray-700 text-white p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              <div className='flex flex-wrap'>
                {listing.name} - ₹{' '}
                {listing.offer
                  ? listing.discountPrice.toLocaleString('en-IN')
                  : listing.regularPrice.toLocaleString('en-IN')}
                {listing.type === 'rent' && ' / month'}

                <p className='flex items-center ml-8 gap-2 text-gray-300 text-sm'>
                  <FaMapMarkerAlt className='text-green-400' />
                  {listing.address}
                </p>
              </div>

              <ul className='text-green-300 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6 mt-2'>
                <li className='flex items-center gap-1 whitespace-nowrap'>
                  <FaBed className='text-lg' />
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} beds `
                    : `${listing.bedrooms} bed `}
                </li>
                <li className='flex items-center gap-1 whitespace-nowrap'>
                  <FaBath className='text-lg' />
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} baths `
                    : `${listing.bathrooms} bath `}
                </li>
                <li className='flex items-center gap-1 whitespace-nowrap'>
                  <FaParking className='text-lg' />
                  {listing.parking ? 'Parking spot' : 'No Parking'}
                </li>
                <li className='flex items-center gap-1 whitespace-nowrap'>
                  <FaChair className='text-lg' />
                  {listing.furnished ? 'Furnished' : 'Unfurnished'}
                </li>
              </ul>
            </p>

            <p className='text-gray-300'>
              <span className='font-semibold text-white'>Description - </span>
              {listing.description}
            </p>

            <div className='flex gap-4'>
              {listing.type === 'shared' && (
                <div className='w-full max-w-md p-4 rounded-xl bg-gray-800 shadow-md'>
                  <div className='text-sm text-gray-300 mb-2 flex items-center gap-2'>
                    <span className='font-semibold text-white'>
                      Tenants filled:
                    </span>
                    <span className='bg-gray-700 px-2 py-0.5 rounded-md'>
                      {listing.tenantsFilled} / {listing.tenantsneed}
                    </span>
                  </div>

                  {listing.tenantOccupations.length > 0 && (
                    <div className='text-sm text-gray-300 mb-2'>
                      <span className='font-semibold text-white'>
                        Professions:{' '}
                      </span>
                      {listing.tenantOccupations.map((occupation, index) => (
                        <span
                          key={index}
                          className='inline-block bg-green-900 text-green-100 px-2 py-0.5 rounded-full text-xs mr-1 mb-1'
                        >
                          {occupation}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className='text-sm text-gray-300'>
                    <span className='font-semibold text-white'>
                      Cost per person:
                    </span>{' '}
                    <span className='text-green-300 font-medium'>
                      ₹{listing.costPerPerson.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {currentUser && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-gray-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
