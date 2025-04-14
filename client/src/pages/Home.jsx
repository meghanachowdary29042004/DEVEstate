import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div className="bg-[#0f172a] text-white font-mono">
      {/* Swiper with Hero Text Overlay */}
      <div className="relative max-w-6xl mx-auto rounded-lg overflow-hidden shadow-lg">
        <Swiper navigation loop={true}>
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div className="relative h-[500px] w-full">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `url(${listing.imageUrls[0]}) center center / cover no-repeat`,
                    }}
                  ></div>

                  {/* Dark overlay for readability */}
                  <div className="absolute inset-0 bg-black bg-opacity-70"></div>

                  {/* Top Badge */}
                  <span className="absolute top-4 left-4 bg-green-500 text-black text-xs md:text-sm font-bold px-3 py-1 rounded-full shadow-md z-10 uppercase tracking-widest">
                    Top Finds
                  </span>

                  {/* Hero Text */}
                  <div className="absolute inset-0 flex flex-col justify-center items-start gap-6 px-6 md:px-16 z-10">
                    <h1 className="font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight text-green-400 drop-shadow-md">
                      Find your next <span className="text-cyan-400">perfect</span> <br /> place with ease
                    </h1>
                    <p className="text-base md:text-lg text-slate-300 max-w-xl">
                      This is the best place to find your next perfect place to live.
                      <br className="hidden sm:block" />
                      We have a wide range of properties for you to choose from.
                    </p>
                    <Link
                      to="/search"
                      className="text-cyan-400 font-bold text-sm md:text-base underline hover:text-green-400 transition"
                    >
                      {'>>'} Let's get started...
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Listings */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-10">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-cyan-300">Recent Offers</h2>
              <Link
                className="text-sm text-green-400 hover:underline"
                to="/search?offer=true"
              >
                View more
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-cyan-300">Places for Rent</h2>
              <Link
                className="text-sm text-green-400 hover:underline"
                to="/search?type=rent"
              >
                View more
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-cyan-300">Places for Sale</h2>
              <Link
                className="text-sm text-green-400 hover:underline"
                to="/search?type=sale"
              >
                View more
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
     
    </div>
  );
}
