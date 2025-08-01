import { useState } from "react";
import { useAtom } from "jotai";
import { authUser } from "lib/api/zipform";
import { useRouter } from "next/navigation";
import { agentReadWriteAtom } from "store/atoms/agent-atom";
import { propertyReadWriteAtom } from "store/atoms/property";
import Image from "next/image";

interface User {
  id: number;
  avatar: string;
}
interface PropertyCardProps {
  price?: string;
  propertyAddress?: string;
  propertyId?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  propertyImage?: string;
  propertyProgress?: number;
  status?: string;
  users?: User[];
  id?: string;
  userId: string;
  engagedProperty:any
}

const AgentPropertyCard: React.FC<PropertyCardProps> = ({
  price = "0",
  propertyAddress,
  propertyId,
  city,
  state,
  zipCode,
  propertyImage,
  propertyProgress,
  users,
  userId,
  id,
  engagedProperty
}) => {
  const router = useRouter();
  const [_, setPropertyState] = useAtom(propertyReadWriteAtom);
  const [agent, setAgent] = useAtom(agentReadWriteAtom);
  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    setLoading(true);
    try {
      const data = await authUser();      
      if (data?.data?.contextId) {
        setAgent({
          ...agent,
          contextId: data?.data?.contextId||"",
        });
      }
      console.log("Daatatta : ",engagedProperty);
      
      setPropertyState({
        selectedProperty: {
          propertyId,
          propertyAddress,
          city,
          state,
          zipCode,
          propertyImage,
          propertyProgress,
          userId,
          id,
        },
        engagedProperty:engagedProperty
      });

      router.push(`/dashboard/buy/${id}/overview?propertyId=${propertyId}`);
    } catch (error) {
      console.error("Error loading property:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-black text-white">
      {/* Property Image */}
      <div className="relative h-48">
        <Image
          src={propertyImage}
          alt="Property"
          fill
          priority
          unoptimized
        />
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Price and propertyProgress */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold">${price?.toLocaleString()}</h2>
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-gray-700 flex items-center justify-center">
              <span className="text-sm font-semibold">{propertyProgress}%</span>
            </div>
          </div>
        </div>

        {/* Property Address */}
        <p className="text-gray-300 mb-4">
          {propertyAddress}
          <br />
          {city}
          <br />
          {zipCode}
        </p>

        {/* Bottom Section */}
        <div className="flex justify-between items-center">
          {/* View Button with Loader */}
          <button
            className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              handleOnClick();
            }}
            disabled={loading} 
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-gray-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "View"
            )}
          </button>

          {/* User Avatars */}
          <div className="flex -space-x-3">
            {users?.map((user, index) => (
              <img
                key={user?.id}
                src={user?.avatar}
                alt={`User ${user?.id}`}
                className="w-8 h-8 rounded-full border-2 border-black"
              />
            ))}
            {users?.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-xs">
                +{users?.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPropertyCard;
